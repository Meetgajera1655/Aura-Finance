@echo off
echo.
echo ==========================================
echo    FinTechForge - One-Time Project Setup
echo ==========================================
echo.

echo [1/4] Installing Node Backend dependencies...
cd backend-node
call npm install
call npx prisma generate
cd ..

echo.
echo [2/4] Setting up Python AI Backend...
cd backend-python
py -3 -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo [3/4] Installing React Frontend dependencies...
cd frontend-react
call npm install
cd ..

echo.
echo [4/4] Finalizing...
echo.
echo Project setup complete!
echo You can now use run-all.bat to start the servers.
echo.
pause
