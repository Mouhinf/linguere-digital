#!/bin/bash
# Linguère Digital - Share Project Link
# This script starts the backend and ngrok tunnel for sharing

set -e

PROJECT_DIR="/home/mouhammad/linguere-digital"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "🚀 Linguère Digital - Share Project Link"
echo "=========================================="

# Check if backend is already running on port 3001
if lsof -ti:3001 > /dev/null 2>&1; then
  echo "✅ Backend already running on port 3001"
else
  echo "📦 Starting backend server..."
  cd "$BACKEND_DIR"
  npm start &
  BACKEND_PID=$!
  sleep 3
  
  # Verify backend is running
  if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
  else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
fi

# Kill any existing ngrok processes
pkill -9 ngrok 2>/dev/null || true
sleep 1

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
ngrok http 3001 &
NGROK_PID=$!
sleep 5

# Get the public URL
PUBLIC_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | python3 -c "import sys,json; data=json.load(sys.stdin); print(data['tunnels'][0]['public_url'])" 2>/dev/null)

if [ -z "$PUBLIC_URL" ]; then
  echo "❌ Failed to get ngrok URL. Check ngrok logs."
  exit 1
fi

echo ""
echo "=========================================="
echo "🎉 YOUR PROJECT IS NOW ONLINE!"
echo "=========================================="
echo ""
echo "📱 Share this link with your expert:"
echo "   $PUBLIC_URL"
echo ""
echo "📋 Quick Links:"
echo "   Frontend: $PUBLIC_URL"
echo "   Admin:    $PUBLIC_URL/admin/login.html"
echo "   API:      $PUBLIC_URL/api/health"
echo ""
echo "🔐 Admin Credentials:"
echo "   Email:    admin@lingueredigital.com"
echo "   Password: Admin@2025"
echo ""
echo "⚠️  Note: This link is active until you stop this script (Ctrl+C)"
echo "=========================================="

# Update config.js with the new URL
CONFIG_FILE="$PROJECT_DIR/frontend/js/config.js"
if [ -f "$CONFIG_FILE" ]; then
  sed -i "s|window\.LINGUERE_API_URL = '.*';|window.LINGUERE_API_URL = '${PUBLIC_URL}/api';|" "$CONFIG_FILE"
  echo "📝 Updated frontend/js/config.js with new URL"
fi

# Keep the script running
trap "echo ''; echo '🛑 Stopping ngrok and backend...'; kill $NGROK_PID 2>/dev/null; kill $BACKEND_PID 2>/dev/null; echo '✅ Done'; exit 0" INT TERM

echo "Press Ctrl+C to stop sharing"
wait
