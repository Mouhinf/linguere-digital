@echo off
setlocal enabledelayedexpansion

echo 🚀 Linguère Digital - Ngrok Share Script
echo ==========================================

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ngrok is not installed. Please install it from https://ngrok.com
    pause
    exit /b 1
)

REM Start backend
echo 📦 Starting backend server...
cd backend
call npm install --silent
start node server.js
timeout /t 2 /nobreak

REM Start frontend
echo 🖥️  Starting frontend server...
cd ..\frontend
start cmd /k "npx http-server -p 8080 -c-1"
timeout /t 2 /nobreak

REM Start ngrok
echo 🌐 Starting ngrok tunnel...
ngrok http 8080 --region eu

pause
