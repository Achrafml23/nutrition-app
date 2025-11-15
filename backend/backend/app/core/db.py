from sqlmodel import Session, create_engine, select

from app.core.config import settings
from app.crud import crud
from app.models.models import (
    User,
)
from app.schemas.users import (
    UserCreate,
)

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    super_user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not super_user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        super_user = crud.create_user(session=session, user_create=user_in)
    client_email = "user2@example.com"
    client_password = "passwordpassword"
    fullname = "user2"
    client = session.exec(select(User).where(User.email == client_email)).first()
    if not client:
        client_in = UserCreate(
            email=client_email,
            password=client_password,
            full_name=fullname,
            is_superuser=False,
        )
        client = crud.create_user(session=session, user_create=client_in)
