nursing-app/
├── src/
│   ├── app/                              # VIEW LAYER — routes only, one hook call + JSX
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx                 # calls useAuth()
│   │   │   └── signup.tsx                # calls useAuth()
│   │   │
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       ├── dashboard.tsx             # calls useDashboard()
│   │       ├── patients/
│   │       │   ├── index.tsx             # calls usePatients()
│   │       │   └── [patientId].tsx       # calls usePatientDetail()
│   │       ├── vitals.tsx                # calls useVitals()
│   │       ├── notes.tsx                 # calls useNursingNotes()
│   │       ├── medications.tsx           # calls useMedications()
│   │       ├── sbar.tsx                  # calls useSbar()
│   │       ├── dosage-calc.tsx           # calls useDosageCalc()
│   │       └── drip-calc.tsx             # calls useDripCalc()
│   │
│   ├── features/                         # HOOK LAYER — state, mock data (for now), transforms
│   │   ├── auth/
│   │   │   └── useAuth.ts
│   │   ├── dashboard/
│   │   │   └── useDashboard.ts
│   │   ├── patients/
│   │   │   ├── usePatients.ts            # list
│   │   │   ├── usePatientDetail.ts       # single patient by id
│   │   │   └── PatientCard.tsx           # feature-specific presentational component
│   │   ├── vitals/
│   │   │   └── useVitals.ts
│   │   ├── nursingNotes/
│   │   │   └── useNursingNotes.ts
│   │   ├── medications/
│   │   │   └── useMedications.ts
│   │   ├── sbar/
│   │   │   └── useSbar.ts
│   │   ├── dosageCalculator/
│   │   │   └── useDosageCalc.ts
│   │   └── dripCalculator/
│   │       └── useDripCalc.ts
│   │
│   ├── api/                              # SERVICE LAYER — raw HTTP calls, no React (empty/stubbed for now)
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── patients.ts
│   │   ├── vitals.ts
│   │   ├── notes.ts
│   │   ├── medications.ts
│   │   ├── sbar.ts
│   │   ├── dosageCalc.ts
│   │   └── dripCalc.ts
│   │
│   ├── db/                               # SERVICE LAYER — local storage (later milestone)
│   │   ├── schema.ts
│   │   ├── db.ts
│   │   └── syncQueue.ts
│   │
│   ├── sync/                             # (later milestone)
│   │   ├── syncEngine.ts
│   │   ├── conflictResolution.ts
│   │   └── netStatus.ts
│   │
│   ├── store/                            # cross-cutting state, not view-specific
│   │   └── authStore.ts                  # zustand: session, nurse_id, sync status
│   │
│   ├── components/                       # shared UI, not tied to one feature
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Header.tsx
│   │
│   ├── types/                            # mirror Pydantic response schemas
│   │   ├── patient.ts
│   │   ├── vitals.ts
│   │   ├── notes.ts
│   │   ├── medications.ts
│   │   ├── sbar.ts
│   │   └── calculations.ts
│   │
│   ├── constants/                        # existing — add API_BASE_URL, route names, etc.
│   ├── hooks/                            # existing — generic non-feature hooks (e.g. useDebounce)
│   └── utils/
│       ├── uuid.ts
│       └── validation.ts
│
├── assets/
├── app.json
├── tsconfig.json
└── package.json