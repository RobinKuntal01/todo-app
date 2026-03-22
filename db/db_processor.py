from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine, Field, select
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


def get_task_list():

        db = SessionLocal()
        all_tasks = db.query(TaskModel).all()
       
        return all_tasks

def edit_task_db(task_id, task):

        db = SessionLocal()
        db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
        if db_task:
            db_task.name = task.name
            db_task.description = task.description
            db_task.type = task.type
            db_task.status = task.status
            db.commit()
            db.refresh(db_task)
            return db_task
        else:
            return None