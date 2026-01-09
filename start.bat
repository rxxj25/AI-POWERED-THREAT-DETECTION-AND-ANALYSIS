@echo off
REM Windows batch script to start both backend and frontend

echo ========================================
echo   AI Threat Detection Dashboard Startup
echo ========================================
echo.

cd /d "%~dp0"

REM Check if model exists, if not train it
if not exist "saved_model.pkl" (
    echo [1/4] Training ML model...
    python train_saved_model.py
    if errorlevel 1 (
        echo Error: Model training failed!
        pause
        exit /b 1
    )
    echo [OK] Model trained successfully!
) else (
    echo [1/4] Model already trained [OK]
)

REM Check backend dependencies
echo [2/4] Checking backend dependencies...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Installing backend dependencies...
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
echo [OK] Backend ready!

REM Check frontend dependencies
echo [3/4] Checking frontend dependencies...
cd ..\frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
echo [OK] Frontend ready!
cd ..

echo.
echo [4/4] Starting servers...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in new window
start "Backend Server" /min cmd /c "cd /d %~dp0\backend && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

REM Wait a moment for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend
cd frontend
npm run dev

REM If frontend exits, cleanup
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1
