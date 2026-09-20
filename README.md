# Digital Nursing Assistant

A nursing application for managing nurses, patients, clinical records, nursing notes, SBAR handovers, vitals, medications, and dosage or IV drip calculations.

## Features

- Nurse registration, login, and profile management
- Patient registration, assignment, profiles, and clinical records
- Vital-sign recording and patient monitoring
- Nursing assessments and nursing note history
- SOAP notes for structured clinical documentation
- SBAR handovers with situation, background, assessment, and recommendation
- Patient medication management
- Medication dosage and IV drip-rate calculators
- Dashboard views for patients, notes, medications, and clinical activity

## Backend Architecture

The backend is a Python FastAPI service. `main.py` registers feature routers, which delegate business logic to services. Pydantic schemas validate data, while SQLAlchemy models and `storage.py` manage SQLite persistence.

```text
Nursing-App/
├── main.py                 # FastAPI application and router registration
├── db_model.py             # SQLAlchemy database models
├── storage.py              # Database engine and sessions
├── nurse/                  # Nurse registration, login, and profiles
├── patient/                # Patient records and assignments
├── dosage/                 # Medication dosage calculations
├── drip/                   # IV drip calculations
├── medication/             # Patient medications
├── nursing_notes/          # Nursing notes and SOAP records
├── sbar/                   # SBAR handovers
├── vitals/                 # Patient vital signs
└── schema/                 # Pydantic request and response schemas
```

Each backend feature folder contains a router and service layer. The request flow is:

```text
Client -> FastAPI router -> Feature service -> SQLAlchemy / SQLite
```

## Frontend Architecture

The project includes a Streamlit dashboard and a deployed TypeScript Expo mobile app. The mobile app uses Expo Router for file-based navigation, React Context for authentication, Axios services for API communication, and feature hooks for data fetching and actions.

```text
dashboard/
├── app.py                  # Streamlit dashboard entry point
├── api/client.py           # Dashboard API client
└── pages/                  # Dashboard feature pages

mobile-app/
├── app.json                # Expo application configuration
├── package.json            # Frontend dependencies and scripts
└── src/
    ├── app/                # Expo Router screens and route layouts
    │   ├── (auth)/         # Login, signup, and staff profile
    │   ├── (tabs)/         # Dashboard, patients, notes, and profile tabs
    │   ├── calculations/   # Dosage and IV drip screens
    │   ├── notes/          # Assessment, history, SBAR, and SOAP screens
    │   ├── patients/       # Patient list, details, and creation screens
    │   └── _layout.tsx     # Root navigation and authentication provider
    ├── components/common/  # Reusable UI components
    ├── context/            # Authentication state and session storage
    ├── hooks/              # Feature data-fetching and mutation hooks
    ├── services/           # Axios client and feature API services
    ├── theme/              # Shared colors and styling values
    ├── types/              # TypeScript data models
    └── utils/              # Shared frontend utilities
```
