#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$HOME/linguere-digital"
PUBLIC_DIR="$HOME/public_html"
BACKEND_DIR="$REPO_DIR/backend"

echo "=== Déploiement Linguère Digital ==="

echo "[1/5] Git pull..."
cd "$REPO_DIR"
git fetch origin
git reset --hard origin/main

echo "[2/5] Copie frontend vers public_html..."
cp -f "$REPO_DIR/frontend/"*.html "$PUBLIC_DIR/"
cp -f "$REPO_DIR/frontend/robots.txt" "$PUBLIC_DIR/"
cp -f "$REPO_DIR/frontend/sitemap.xml" "$PUBLIC_DIR/"
cp -rf "$REPO_DIR/frontend/css/" "$PUBLIC_DIR/css/"
cp -rf "$REPO_DIR/frontend/js/" "$PUBLIC_DIR/js/"
cp -rf "$REPO_DIR/frontend/services/" "$PUBLIC_DIR/services/"
cp -rf "$REPO_DIR/frontend/admin/" "$PUBLIC_DIR/admin/"
cp -rf "$REPO_DIR/frontend/assets/" "$PUBLIC_DIR/assets/"

echo "[3/5] Installation dépendances backend..."
cd "$BACKEND_DIR"
npm install --production

echo "[4/5] Restart PM2..."
pm2 restart linguere-api || pm2 start server.js --name linguere-api -- --env production
pm2 save

echo "[5/5] Vérification..."
pm2 status
echo "=== Déploiement terminé ==="
