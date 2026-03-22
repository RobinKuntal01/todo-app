from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = sqlalchemy.orm.declarative_base()

# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)


class task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    type = Column(String, nullable=False) 
    status= Column(Integer, default=0)

Base.metadata.create_all(bind=engine)