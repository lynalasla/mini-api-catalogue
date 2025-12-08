#!/bin/bash

echo "🚀 Initialisation des métriques Grafana..."
echo ""

# Attendre que l'API soit prête
echo "⏳ Attente du démarrage de l'API..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ API prête!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "   Tentative $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Timeout: L'API n'a pas démarré après 60 secondes"
    exit 1
fi

# Attendre encore 5 secondes pour la stabilisation
sleep 5

# Générer du trafic initial
echo ""
echo "📊 Génération de données initiales pour Grafana..."
for i in {1..30}; do
    curl -s http://localhost:3000/api/products > /dev/null 2>&1 &
    curl -s http://localhost:3000/api/categories > /dev/null 2>&1 &
    curl -s http://localhost:3000/api/orders > /dev/null 2>&1 &
    
    if [ $((i % 10)) -eq 0 ]; then
        echo "   📤 $i/30 requêtes envoyées..."
    fi
    sleep 0.5
done

# Attendre que toutes les requêtes se terminent
wait

echo ""
echo "✅ Initialisation terminée!"
echo ""
echo "📊 Métriques disponibles:"
curl -s http://localhost:3000/metrics | grep -E "^(products_count|orders_count|users_count|categories_count)" | sed 's/^/   /'
echo ""
echo "🌐 Services disponibles:"
echo "   - Grafana: http://localhost:3001 (admin/admin)"
echo "   - API: http://localhost:3000"
echo "   - Frontend: http://localhost:5173"
echo ""
echo "💡 Conseil: Dans Grafana, utilisez 'Last 5 minutes' comme plage de temps"
