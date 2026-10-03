# GameVerse ETMS (Esports Tournament Management System)

## Important Commands

### Backend (Spring Boot)
To run the backend development server (Port 8081):
```bash
cd gameverse-backend
.\mvnw spring-boot:run
```

To compile the backend:
```bash
cd gameverse-backend
.\mvnw clean compile
```

### Frontend (React + Vite)
To run the frontend development server (Port 5173):
```bash
cd gameverse-frontend
npm run dev
```

### Python Vision Worker (FastAPI)
To run the Python Vision Worker for live OCR scoring (Port 8090):
```bash
cd ../vision-worker
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8090
```

### End-to-End Testing (Playwright)
To run Playwright tests:
```bash
cd gameverse-frontend
npx playwright test
```

To view the Playwright test report:
```bash
cd gameverse-frontend
npx playwright show-report
```
