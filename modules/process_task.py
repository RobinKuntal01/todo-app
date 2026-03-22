from db.db_processor import save_to_db, get_task_by_id

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

def my_get_task(task_id: int):

    print(f"Inside get_task_by_id with task_id: {task_id}")

    res_get_task = get_task_by_id(task_id)
    print(f"Result from get_task_by_id: {res_get_task}")   
    return res_get_task