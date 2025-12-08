#!/bin/bash

echo "🚀 Test de génération de métriques pour Grafana"
echo "================================================"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Tester les métriques de l'API
echo -e "\n${BLUE}1. Vérification des métriques API...${NC}"
curl -s http://localhost:3000/metrics | grep -E "^(products_count|orders_count|users_count|categories_count|http_requests_total)" | head -10

# 2. Générer du trafic varié
echo -e "\n${BLUE}2. Génération de trafic (50 requêtes)...${NC}"
for i in {1..10}; do
  curl -s http://localhost:3000/api/products > /dev/null &
  curl -s http://localhost:3000/api/categories > /dev/null &
  curl -s http://localhost:3000/api/products/1 > /dev/null &
  curl -s http://localhost:3000/api/orders > /dev/null &
  curl -s http://localhost:3000/metrics > /dev/null &
  sleep 0.5
done
wait
echo -e "${GREEN}✅ 50 requêtes générées${NC}"

# 3. Vérifier que Prometheus a reçu les données
echo -e "\n${BLUE}3. Vérification Prometheus...${NC}"
curl -s "http://localhost:9090/api/v1/query?query=rate(http_requests_total[1m])" | python3 -c "import sys,json; data=json.load(sys.stdin); print('✅ ' + str(len(data['data']['result'])) + ' séries de métriques trouvées')" 2>/dev/null || echo "⚠️  Pas encore de données de taux"

# 4. Afficher les valeurs actuelles
echo -e "\n${BLUE}4. Valeurs actuelles des métriques:${NC}"
curl -s "http://localhost:9090/api/v1/query?query=products_count" | python3 -c "import sys,json; data=json.load(sys.stdin); print('📦 Produits: ' + data['data']['result'][0]['value'][1])" 2>/dev/null
curl -s "http://localhost:9090/api/v1/query?query=orders_count" | python3 -c "import sys,json; data=json.load(sys.stdin); print('🛒 Commandes: ' + data['data']['result'][0]['value'][1])" 2>/dev/null
curl -s "http://localhost:9090/api/v1/query?query=users_count" | python3 -c "import sys,json; data=json.load(sys.stdin); print('👥 Utilisateurs: ' + data['data']['result'][0]['value'][1])" 2>/dev/null

# 5. Compter le total de requêtes HTTP
echo -e "\n${BLUE}5. Statistiques HTTP:${NC}"
curl -s "http://localhost:9090/api/v1/query?query=sum(http_requests_total)" | python3 -c "import sys,json; data=json.load(sys.stdin); print('📊 Total requêtes HTTP: ' + data['data']['result'][0]['value'][1])" 2>/dev/null

echo -e "\n${GREEN}✅ Test terminé !${NC}"
echo -e "\n📈 Accédez à Grafana: ${BLUE}http://localhost:3001${NC}"
echo -e "   - Login: admin / admin"
echo -e "   - Dashboard: E-Commerce Overview"
echo ""
