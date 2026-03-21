from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class Task(BaseModel):
    id: Optional[int] = None
    name: str = Field(min_length=2, max_length=100)
    description: str = Field(max_length=500)
    type: str = Field(max_length=100)
    status: int = 0

