from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine, Field
from db.sql_eng import SessionLocal, task as TaskModel

def save_to_db(Task):
        print(f"Inside save_to_db with Task: {Task}")
        db = SessionLocal()
        db_task = TaskModel(name=Task.name, description=Task.description, type=Task.type, status=Task.status)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        print(f"Task saved to database with ID: {db_task.id}")
        return db_task


def get_task_by_id(task_id: int):
    db = SessionLocal()
    return db.query(TaskModel).filter(TaskModel.id == task_id).first()
