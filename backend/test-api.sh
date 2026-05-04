#!/bin/bash

API="http://localhost:3000/api"
HEADER_JSON="Content-Type: application/json"

echo "🧪 Linguère Digital - API Test Suite"
echo "======================================"
echo ""

# 1. Health check
echo "1️⃣ Health Check"
curl -s $API/health | jq '.'
echo ""

# 2. Get services
echo "2️⃣ Get Services"
curl -s $API/services | jq '.[0]'
echo ""

# 3. Get projects
echo "3️⃣ Get Projects"
curl -s $API/projects | jq '.[0]'
echo ""

# 4. Get testimonials
echo "4️⃣ Get Testimonials"
curl -s $API/testimonials | jq '.[0]'
echo ""

# 5. Get blog posts
echo "5️⃣ Get Blog Posts"
curl -s $API/blog | jq '.[0]'
echo ""

# 6. Contact form
echo "6️⃣ Submit Contact Form"
CONTACT_DATA='{
  "prenom": "Test",
  "nom": "User",
  "email": "test@example.com",
  "telephone": "+221771234567",
  "service": "informatique",
  "budget": "1-5M",
  "objet": "Test Request",
  "message": "Ceci est un message de test pour vérifier le formulaire de contact"
}'

curl -s -X POST $API/contact \
  -H "$HEADER_JSON" \
  -d "$CONTACT_DATA" | jq '.'
echo ""

# 7. Login
echo "7️⃣ Admin Login"
LOGIN_DATA='{
  "email": "admin@lingueredigital.com",
  "password": "Admin@2025"
}'

TOKEN=$(curl -s -X POST $API/auth/login \
  -H "$HEADER_JSON" \
  -d "$LOGIN_DATA" | jq -r '.token')

echo "Token received: ${TOKEN:0:20}..."
echo ""

# 8. Get stats (requires auth)
echo "8️⃣ Get Dashboard Stats"
curl -s $API/admin/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 9. Get admin services
echo "9️⃣ Get Admin Services"
curl -s $API/admin/services \
  -H "Authorization: Bearer $TOKEN" | jq '.[0]'
echo ""

# 10. Get messages
echo "🔟 Get Messages"
curl -s $API/admin/messages \
  -H "Authorization: Bearer $TOKEN" | jq '.[0]'
echo ""

echo "✅ API Test Suite Complete!"
