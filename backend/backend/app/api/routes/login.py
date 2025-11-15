from datetime import timedelta
from typing import Annotated, Any

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.crud import crud
from app.crud.refresh_token import (
    get_refresh_token_by_jti,
    invalidate_refresh_token,
    store_refresh_token,
)
from app.models.models import Message
from app.schemas.users import NewPassword, Token, UserPublic
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    send_email,
    verify_password_reset_token,
)

secure_cookie = settings.ENVIRONMENT == "production"
router = APIRouter(tags=["login"])


@router.post("/login/access-token")
def login_access_token(
    response: Response,
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:  # Changed from Message to Token
    user = crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    refresh_token, jti = security.create_refresh_token(user.id, return_jti=True)
    store_refresh_token(session, user.id, jti)

    # Only set refresh token in httpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none"
        if secure_cookie
        else "lax",  # Changed from "lax" to "strict" for better CSRF protection
        max_age=60 * 60 * 24 * 15,  # 15 days
        path="/",
    )

    # Return access token in response body (will be stored in memory)
    return Token(access_token=access_token, token_type="bearer", user=user)


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/password-recovery/{email}")
def recover_password(email: str, session: SessionDep) -> Message:
    """
    Password Recovery
    """
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Password recovery email sent")


@router.post("/reset-password/")
def reset_password(session: SessionDep, body: NewPassword) -> Message:
    """
    Reset password
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(password=body.new_password)
    user.hashed_password = hashed_password
    session.add(user)
    session.commit()
    return Message(message="Password updated successfully")


@router.post(
    "/password-recovery-html-content/{email}",
    dependencies=[Depends(get_current_active_superuser)],
    response_class=HTMLResponse,
)
def recover_password_html_content(email: str, session: SessionDep) -> Any:
    """
    HTML Content for Password Recovery
    """
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )

    return HTMLResponse(
        content=email_data.html_content, headers={"subject:": email_data.subject}
    )


@router.post("/login/refresh-token", response_model=Token)
def refresh_access_token(request: Request, response: Response, session: SessionDep):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        jti = payload.get("jti")
        if not jti or not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    db_token = get_refresh_token_by_jti(session, jti)
    if not db_token:
        raise HTTPException(status_code=401, detail="Token has been used or is invalid")

    # Invalidate the old token (rotate)
    invalidate_refresh_token(session, jti)

    user = crud.get_user_by_id(session=session, id=user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    # Create new tokens
    new_refresh_token, new_jti = security.create_refresh_token(user_id, return_jti=True)
    store_refresh_token(session, user_id, new_jti)
    new_access_token = security.create_access_token(user_id, timedelta(minutes=20))

    # Only set refresh token in cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="none"
        if secure_cookie
        else "lax",  # Changed from "lax" to "strict" for better CSRF protection
        max_age=60 * 60 * 24 * 15,  # 15 days
        path="/",
    )

    # Return access token in response body
    return Token(access_token=new_access_token, token_type="bearer", user=user)


# TODO: add secure=True in production
@router.post("/logout")
def logout(request: Request, response: Response, session: SessionDep):
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token:
        try:
            payload = jwt.decode(
                refresh_token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            jti = payload.get("jti")
            if jti:
                invalidate_refresh_token(session, jti)
        except Exception:
            pass  # Token might be invalid, but we still want to clear the cookie

    response.delete_cookie("refresh_token", httponly=True, samesite="strict")
    return Message(message="Successfully logged out")
