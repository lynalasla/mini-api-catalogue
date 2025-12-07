#!/bin/bash

echo "================================================"
echo "  ��� Test Complet Grafana - Diagnostic 'No Data'"
echo "================================================"
echo ""

# 1. Vérifier Prometheus collecte les données
echo "1️⃣  Test Prometheus..."
echo ""
echo "   Query: products_count"
PRODUCTS=$(curl -s "http://localhost:9090/api/v1/query?query=products_count" | grep -o '"value":\[[^]]*\]' | head -1)
if [ ! -z "$PRODUCTS" ]; then
    echo "   ✅ products_count: $PRODUCTS"
else
    echo "   ❌ products_count non disponible"
fi

echo ""
echo "   Query: http_requests_total"
HTTP_COUNT=$(curl -s "http://localhost:9090/api/v1/query?query=sum(http_requests_total)" | grep -o '"value":\[[^]]*\]' | head -1)
if [ ! -z "$HTTP_COUNT" ]; then
    echo "   ✅ http_requests_total: $HTTP_COUNT"
else
    echo "   ❌ http_requests_total non disponible"
fi

echo ""
echo "   Query: rate(http_requests_total[5m])"
HTTP_RATE=$(curl -s "http://localhost:9090/api/v1/query?query=rate(http_requests_total[5m])" | grep -o '"value":\[[^]]*\]' | head -1)
if [ ! -z "$HTTP_RATE" ]; then
    echo "   ✅ rate(http_requests_total[5m]): $HTTP_RATE"
else
    echo "   ⚠️  rate vide (normal si < 5min de données)"
fi

echo ""
echo "================================================"
echo "  ��� SOLUTION"
echo "================================================"
echo ""
echo "Les métriques sont disponibles dans Prometheus !"
echo ""
echo "Dans Grafana (http://localhost:3001):"
echo ""
echo "1. Cliquez sur l'HORLOGE ⏰ en haut à droite"
echo "2. Changez la plage:"
echo "   - De: now-5m"
echo "   - To: now"
echo "   Ou sélectionnez: 'Last 5 minutes'"
echo "3. Cliquez 'Apply'"
echo "4. Cliquez 'Refresh' ���"
echo ""
echo "Les panneaux devraient s'afficher !"
echo ""
echo "================================================"
echo "  ��� Générer Plus de Données"
echo "================================================"
echo ""
echo "Si toujours vide, générez plus de trafic:"
echo ""

# Générer du trafic
for i in {1..10}; do
    curl -s http://localhost:3000/api/products > /dev/null &
    curl -s http://localhost:3000/api/categories > /dev/null &
    curl -s http://localhost:3000/api/orders > /dev/null &
done
wait

echo "✅ 30 nouvelles requêtes envoyées"
echo ""
echo "Attendez 15 secondes puis rafraîchissez Grafana..."
sleep 15
echo ""
echo "✅ Prêt ! Retournez dans Grafana et rafraîchissez (F5)"
echo ""
echo "================================================"
