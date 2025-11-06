@echo off
echo Starting Agri-Link Development Environment...
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak > nul

REM Start backend in new window
echo Starting Backend Server...
start "Agri-Link Backend" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting Frontend...
npm run dev

pause