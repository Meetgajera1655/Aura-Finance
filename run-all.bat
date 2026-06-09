@echo off
cd /d %~dp0

echo.
echo ==========================================
echo    Starting FinTechForge Services...
echo ==========================================
echo.

:: Check if node_modules exists in root, if not install dependencies
if not exist "node_modules\" (
    echo Installing required orchestration tools...
    npm install
)

echo Starting all services in this terminal...
npm start

echo.
echo All services have stopped.
pause