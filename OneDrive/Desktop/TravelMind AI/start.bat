@echo off
echo ===================================================
echo   Starting TRAVELMIND-AI Full-Stack Platform
echo ===================================================

echo Starting FastAPI Backend on http://localhost:8000 ...
start "TravelMind Backend" /D "%~dp0frontend\backend" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Vite React Frontend on http://localhost:5173 ...
start "TravelMind Frontend" /D "%~dp0frontend" cmd /k "npm run dev"

echo.
echo Both services launched!
echo Open your browser at: http://localhost:5173
echo.
pause
