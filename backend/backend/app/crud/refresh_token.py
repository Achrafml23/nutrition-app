from sqlalchemy.orm import Session

from app.models.models import RefreshToken


def store_refresh_token(session: Session, user_id: str, jti: str):
    token_entry = RefreshToken(user_id=user_id, token=jti)
    session.add(token_entry)
    session.commit()
    return token_entry


def get_refresh_token_by_jti(session: Session, jti: str):
    return session.query(RefreshToken).filter_by(token=jti, is_active=True).first()


def invalidate_refresh_token(session: Session, jti: str):
    token = session.query(RefreshToken).filter_by(token=jti).first()
    if token:
        token.is_active = False
        session.commit()
