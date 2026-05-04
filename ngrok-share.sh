#!/bin/bash

echo "🚀 Linguère Digital - Ngrok Share Script"
echo "=========================================="

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Installing..."
    brew install ngrok  # macOS
    # For Linux: wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip && unzip ngrok-stable-linux-amd64.zip
fi

# Start backend
echo "📦 Starting backend server..."
cd backend
npm install --silent
node server.js &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "🖥️  Starting frontend server..."
cd ../frontend
npx http-server -p 8080 -c-1 &
FRONTEND_PID=$!
sleep 2

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
ngrok http 8080 --region eu

# Cleanup
kill $BACKEND_PID $FRONTEND_PID
