@echo off
REM FARMERS NATION - Complete Setup Script for Windows

echo.
echo ========================================
echo FARMERS NATION - Setup Script (Windows)
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it first.
    exit /b 1
)
echo [OK] Node.js is installed

REM Setup Backend
echo.
echo [INFO] Setting up Backend...
cd backend

echo Installing backend dependencies...
call npm install

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo [WARN] .env created. Please update it with your credentials.
)

if not exist uploads (
    mkdir uploads
)
echo [OK] Backend setup complete

REM Setup Frontend
echo.
echo [INFO] Setting up Frontend...
cd ..\frontend

echo Installing frontend dependencies...
call npm install

echo [OK] Frontend setup complete

REM Final Instructions
echo.
echo ========================================
echo [OK] FARMERS NATION Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Update .\backend\.env with your credentials
echo    - Database credentials
echo    - M-Pesa API keys
echo    - JWT secret
echo.
echo 2. Start the Backend:
echo    cd backend
echo    npm run dev
echo.
echo 3. Start the Frontend (in new terminal):
echo    cd frontend
echo    npm start
echo.
echo 4. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo.
echo Contact: 0725822740
echo Location: Busia, Kenya
echo Slogan: Turning Farms Into Fortunes
echo.
pause
