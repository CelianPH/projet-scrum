from sqlalchemy import Column, Integer, String, Enum
from app.core.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    GESTIONNAIRE = "gestionnaire"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.GESTIONNAIRE)
    full_name = Column(String, nullable=True)
