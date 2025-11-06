@echo off
echo Installing backend dependencies...
cd backend
npm install
echo.
echo Backend setup complete!
echo.
echo To start the backend server:
echo cd backend
echo npm run dev
echo.
echo Make sure MongoDB is running on localhost:27017
pause