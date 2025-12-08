#!/bin/bash

echo "================================================"
echo "  🔍 Diagnostic Grafana - Métriques Manquantes"
echo "================================================"
echo ""

# 1. Vérifier l'API expose les métriques
echo "1️⃣  Vérification endpoint /metrics de l'API..."
METRICS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/metrics)
if [ "$METRICS_RESPONSE" = "200" ]; then
    echo "   ✅ API expose les métriques"
    echo ""
    echo "   📊 Métriques Business:"
    curl -s http://localhost:3000/metrics | grep -E "^(products_count|orders_count|users_count|categories_count)" | sed 's/^/      /'
else
    echo "   ❌ API ne répond pas (Code: $METRICS_RESPONSE)"
    exit 1
fi
echo ""

# 2. Vérifier Prometheus collecte les métriques
echo "2️⃣  Vérification Prometheus collecte les données..."
PROM_PRODUCTS=$(curl -s "http://localhost:9090/api/v1/query?query=products_count" | grep -o '"value":\[[^]]*\]' | head -1)
if [ ! -z "$PROM_PRODUCTS" ]; then
    echo "   ✅ Prometheus collecte products_count: $PROM_PRODUCTS"
else
    echo "   ❌ Prometheus ne collecte pas products_count"
    echo "   💡 Vérifiez prometheus.yml et le scrape_config"
fi

PROM_HTTP=$(curl -s "http://localhost:9090/api/v1/query?query=http_requests_total" | grep -o '"value":\[[^]]*\]' | head -1)
if [ ! -z "$PROM_HTTP" ]; then
    echo "   ✅ Prometheus collecte http_requests_total: $PROM_HTTP"
else
    echo "   ❌ Prometheus ne collecte pas http_requests_total"
fi
echo ""

# 3. Vérifier la configuration du datasource Grafana
echo "3️⃣  Vérification datasource Grafana..."
if docker exec grafana-catalogue sh -c "test -f /etc/grafana/provisioning/datasources/prometheus.yml" 2>&1; then
    echo "   ✅ Fichier prometheus.yml présent"
    echo ""
    echo "   Configuration:"
    docker exec grafana-catalogue cat /etc/grafana/provisioning/datasources/prometheus.yml | grep -E "(name|uid|url):" | sed 's/^/      /'
else
    echo "   ❌ Fichier prometheus.yml manquant!"
fi
echo ""

# 4. Vérifier les dashboards
echo "4️⃣  Vérification dashboards..."
if docker exec grafana-catalogue sh -c "ls /var/lib/grafana/dashboards/*.json" > /dev/null 2>&1; then
    DASHBOARD_COUNT=$(docker exec grafana-catalogue sh -c "ls /var/lib/grafana/dashboards/*.json | wc -l")
    echo "   ✅ $DASHBOARD_COUNT dashboards trouvés"
    docker exec grafana-catalogue sh -c "ls -1 /var/lib/grafana/dashboards/*.json" | sed 's|.*/|      - |'
else
    echo "   ❌ Aucun dashboard trouvé"
fi
echo ""

# 5. Vérifier l'UID du datasource dans les dashboards
echo "5️⃣  Vérification UID datasource dans dashboards..."
DASHBOARD_UID=$(docker exec grafana-catalogue sh -c "grep -o '\"uid\":\"[^\"]*\"' /var/lib/grafana/dashboards/ecommerce-overview.json | grep -o 'PROMETHEUS\|prometheus'" | head -1)
if [ "$DASHBOARD_UID" = "PROMETHEUS" ]; then
    echo "   ✅ Dashboard utilise UID: PROMETHEUS (correct)"
else
    echo "   ⚠️  Dashboard utilise UID: $DASHBOARD_UID"
    echo "   💡 Devrait être 'PROMETHEUS'"
fi
echo ""

# 6. Test de requête Prometheus directement
echo "6️⃣  Test requête Prometheus..."
echo "   Query: products_count"
RESULT=$(curl -s "http://localhost:9090/api/v1/query?query=products_count")
STATUS=$(echo $RESULT | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
if [ "$STATUS" = "success" ]; then
    VALUE=$(echo $RESULT | grep -o '"value":\[[^]]*\]' | grep -o '[0-9]*"[^"]*"' | tail -1 | cut -d'"' -f2)
    echo "   ✅ Requête réussie: $VALUE produits"
else
    echo "   ❌ Requête échouée"
fi
echo ""

# 7. Générer du trafic
echo "7️⃣  Génération de trafic pour créer des données..."
for i in {1..5}; do
    curl -s http://localhost:3000/api/products > /dev/null
    curl -s http://localhost:3000/api/categories > /dev/null
    echo "   📤 Requête $i envoyée"
done
echo ""

# 8. Solution
echo "================================================"
echo "  💡 SOLUTIONS"
echo "================================================"
echo ""
echo "Si les dashboards Grafana affichent toujours 'No data':"
echo ""
echo "1️⃣  Changez la plage de temps dans Grafana:"
echo "   - Cliquez sur l'horloge en haut à droite"
echo "   - Sélectionnez 'Last 5 minutes' ou 'Last 15 minutes'"
echo "   - Cliquez 'Apply'"
echo ""
echo "2️⃣  Attendez 1-2 minutes pour que Prometheus collecte plus de points"
echo ""
echo "3️⃣  Rafraîchissez la page (Ctrl+Shift+R ou Cmd+Shift+R)"
echo ""
echo "4️⃣  Redémarrez Grafana si nécessaire:"
echo "   docker-compose restart grafana"
echo ""
echo "5️⃣  Vérifiez les requêtes dans le dashboard:"
echo "   - Éditez un panneau"
echo "   - Vérifiez que la requête PromQL est correcte"
echo "   - Ex: rate(http_requests_total[5m])"
echo ""
echo "================================================"
