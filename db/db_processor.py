from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine, Field

class task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str | None = Field(default=None, unique=True)
    description: str
    type: str 
    status: int | None = Field(default=0)

