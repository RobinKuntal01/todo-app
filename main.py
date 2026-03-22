import uvicorn
from fastapi import FastAPI, Request
from modules.models import Task
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from modules.process_task import process_task, my_get_task

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
async def create_task(Task: Task, status_code=201):
    res = process_task(Task)
    print(f"Task processed: {res}")
    return JSONResponse(content={"message": "Task created successfully", "task": res.dict()}, status_code=status_code)  
    # return {"message": "Task created successfully", "task": Task, "status_code": status_code}   

@app.get("/tasks/{task_id}")
async def get_task(task_id: int):
    res = my_get_task(task_id)
    return res
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

