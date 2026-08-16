# Digital Nursing Assistant — Backend

FastAPI backend for a digital nursing assistant application that helps healthcare staff manage patients, nursing records, and clinical calculations.

## Features

* Nurse account and profile management
* Patient management and nurse assignment
* Medication dosage calculations
* IV drip rate calculations
* Nursing notes and patient observations
* SBAR-based shift handovers
* Calculation history and patient records
* RESTful API with automatic Swagger documentation

## Tech Stack

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **Pydantic**
* **SQLite**
* **Uvicorn**

## Project Structure

```text
Nursing-App/
├── main.py
├── db_model.py
├── storage.py
├── requirements.txt
│
├── nurse/
│   ├── nurse_router.py
│   ├── nurse_service.py
│   └── nurse_helper.py
│
├── patient/
│   ├── patient_router.py
│   └── patient_service.py
│
├── calculations/
│   ├── calculations_router.py
│   └── calculations_service.py
│
└── schema/
    ├── nurse_schema.py
    └── register_schema.py
```

## Getting Started

### Prerequisites

* Python 3.8+
* pip

### 1. Clone the repository

```bash
git clone <repository-url>
cd Nursing-App
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=sqlite:///./nursing_app.db
```

### 5. Initialize the database

```bash
python -c "from storage import DBManager; db = DBManager(); db.initialize_db()"
```

### 6. Run the application

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

## API Documentation

FastAPI automatically provides interactive API documentation:

* **Swagger UI:** `http://localhost:8000/docs`
* **ReDoc:** `http://localhost:8000/redoc`

## API Modules

| Module        | Description                             |
| ------------- | --------------------------------------- |
| Nurse         | Account and profile management          |
| Patient       | Patient records and assignments         |
| Calculations  | Dosage and IV drip calculations         |
| Nursing Notes | Patient observations and clinical notes |
| SBAR          | Structured shift handovers              |

## Architecture

The backend follows a layered structure:

```text
Client
  ↓
FastAPI Routers
  ↓
Services
  ↓
SQLAlchemy / Database
```

Routers handle HTTP requests, services contain business logic, and the database layer manages persistence.

## Configuration

The application uses environment variables for configuration.

Example:

```env
DATABASE_URL=sqlite:///./nursing_app.db
```

For production deployments, a production database such as PostgreSQL can be configured through `DATABASE_URL`.

## License

License information will be added later.
