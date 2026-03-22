from db.db_processor import save_to_db, get_task_list, edit_task_db

def process_task(Task):
    # Here you can add any processing logic you want to perform on the Task object
    # For example, you could save it to a database, perform some calculations, etc.
    # This is just a placeholder function to demonstrate how you can separate concerns in your code.

    print(f"Inside process_task")
    res_save_task = save_to_db(Task)
    print(f"Result from save_to_db: {res_save_task}")
    if isinstance(res_save_task, Exception):
        # Handle the exception as needed (e.g., log it, return an error response, etc.)
        print(f"Error saving task to database: {res_save_task}")

    return Task

def process_task_list():

    print(f"Inside process_task_list")
    res_get_task = get_task_list()
    all_tasks = []
    for task in res_get_task:
        print(f"Task ID: {task.id}, Name: {task.name}, Description: {task.description}, Type: {task.type}, Status: {task.status}")
        all_tasks.append(task)

    print(f"Result from get_task_list: {res_get_task}")   
    return all_tasks

def process_edit_task(task_id,  task):

    print(f"Inside process_edit_task with task_id: {task_id} and task: {task}")
    res_edit_task = edit_task_db(task_id, task)
    print(f"Result from get_edit_task: {res_edit_task}")