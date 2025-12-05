#!/bin/bash

echo "🔄 Mise à jour du dashboard E-Commerce Overview"
echo "================================================"

# Lire le fichier JSON
DASHBOARD_JSON=$(cat grafana/dashboards/ecommerce-overview.json)

# Mettre à jour via API (overwrite=true)
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -u "admin:admin" \
  -d "{\"dashboard\": $DASHBOARD_JSON, \"overwrite\": true}" \
  http://localhost:3001/api/dashboards/db)

# Afficher le résultat
echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('status') == 'success':
        print('✅ Dashboard mis à jour avec succès!')
        print(f'   URL: http://localhost:3001{data.get(\"url\", \"\")}')
    else:
        print('❌ Erreur:', data.get('message', 'Inconnue'))
except:
    print('❌ Erreur de communication avec Grafana')
" 2>/dev/null || echo "❌ Python non disponible"

echo ""
echo "📊 Accédez au dashboard: http://localhost:3001/d/ecommerce-overview"
