# Todo App

A simple FastAPI-based todo application that allows users to create and manage tasks through a web interface.

## Features

- Create todo tasks with name, description, status, and type
- Web-based form interface at `/todo`
- REST API endpoint for task creation at `/tasks`
- Modern, responsive UI with CSS styling
- Client-side form validation with JavaScript

## Tech Stack

- **Backend**: FastAPI
- **Frontend**: HTML, CSS, JavaScript
- **Templates**: Jinja2
- **Server**: Uvicorn

## Project Structure

```
todo-app/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── config.py              # Configuration settings
├── modules/
│   └── models.py          # Pydantic models (Task)
├── db/                    # Database related files
├── auth/                  # Authentication modules
├── templates/
│   └── todo.html          # Todo form template
├── static/
│   ├── css/
│   │   └── todo.css       # Form styling
│   └── js/
│       └── todo.js        # Form validation and AJAX
└── README.md              # This file
```

## Installation

1. Clone or download the project
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - Linux/Mac: `source .venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the development server:
   ```bash
   python main.py
   ```
   or
   ```bash
   fastapi dev
   ```

2. Open your browser and navigate to:
   - **Todo Form**: http://localhost:8000/todo
   - **API Root**: http://localhost:8000/

3. Fill out the todo form and submit to create tasks.

## API Endpoints

- `GET /` - Welcome message
- `GET /todo` - HTML form for creating tasks
- `POST /tasks` - Create a new task (JSON API)

## Task Model

```python
{
    "id": Optional[int],
    "name": str,        # 2-100 characters
    "description": str, # Max 500 characters
    "type": str,        # Max 100 characters
    "status": int       # Default: 0
}
```

## Development

The application uses:
- FastAPI for the web framework
- Pydantic for data validation
- Jinja2 for HTML templating
- Static files served from `/static/` directory

## License

This project is open source and available under the MIT License.