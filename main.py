import uvicorn
from fastapi import FastAPI, Request
from modules.models import Task
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from modules.process_task import process_task, process_task_list, process_edit_task

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/")
async def sample():
    return {"message": "Hello World"}

@app.get("/todo", response_class=HTMLResponse)
async def todo_form(request: Request):
    return templates.TemplateResponse("todo.html", {"request": request})

@app.post("/tasks")
async def create_task(task: Task, status_code=201):
    res = process_task(task)
    print(f"Task processed: {res}")
    return {"message": "Task created successfully", "task": res}

@app.get("/task_list")
async def get_task():
    print("Fetching task list...")
    res = process_task_list()
    print(f"Task list fetched: {res}")
    return {'status': 'success', 'tasks': res}

@app.post("/edit_task")
async def edit_task(task_id: int, task: Task):
    # Implementation for editing a task
    res = process_edit_task(task_id, task)
    return {"message": "Task edited successfully", "task_id": task_id, "updated_task": task}



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

