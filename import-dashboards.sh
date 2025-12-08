#!/bin/bash

echo "📊 Import des dashboards Grafana"
echo "=================================="

# Configuration
GRAFANA_URL="http://localhost:3001"
GRAFANA_USER="admin"
GRAFANA_PASS="admin"

# Créer le dossier E-Commerce
echo "1. Création du dossier E-Commerce..."
FOLDER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"title":"E-Commerce"}' \
  http://$GRAFANA_USER:$GRAFANA_PASS@$GRAFANA_URL/api/folders)

FOLDER_UID=$(echo $FOLDER_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('uid', ''))" 2>/dev/null)

if [ -z "$FOLDER_UID" ]; then
  echo "⚠️  Dossier existe déjà ou erreur, récupération..."
  FOLDER_UID=$(curl -s http://$GRAFANA_USER:$GRAFANA_PASS@$GRAFANA_URL/api/folders | \
    python3 -c "import sys,json; folders=json.load(sys.stdin); print([f['uid'] for f in folders if f['title']=='E-Commerce'][0])" 2>/dev/null)
fi

echo "✅ Folder UID: $FOLDER_UID"

# Importer E-Commerce Overview
echo ""
echo "2. Import dashboard E-Commerce Overview..."
DASHBOARD1=$(cat grafana/dashboards/ecommerce-overview.json)
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"dashboard\":$DASHBOARD1,\"folderId\":0,\"overwrite\":true}" \
  http://$GRAFANA_USER:$GRAFANA_PASS@$GRAFANA_URL/api/dashboards/db | \
  python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ ' + r.get('status', 'unknown') + ': ' + r.get('url', ''))" 2>/dev/null

# Importer API Performance
echo ""
echo "3. Import dashboard API Performance..."
DASHBOARD2=$(cat grafana/dashboards/api-performance.json)
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"dashboard\":$DASHBOARD2,\"folderId\":0,\"overwrite\":true}" \
  http://$GRAFANA_USER:$GRAFANA_PASS@$GRAFANA_URL/api/dashboards/db | \
  python3 -c "import sys,json; r=json.load(sys.stdin); print('✅ ' + r.get('status', 'unknown') + ': ' + r.get('url', ''))" 2>/dev/null

echo ""
echo "🎉 Import terminé ! Accédez à Grafana sur http://localhost:3001"
