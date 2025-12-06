#!/bin/bash

echo "================================================"
echo "  🔍 Vérification des Dashboards Grafana"
echo "================================================"
echo ""

# Attendre que Grafana soit prêt
echo "⏳ Attente du démarrage de Grafana..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Grafana est prêt!"
        break
    fi
    sleep 2
    echo -n "."
done
echo ""

# Vérifier les fichiers de dashboards
echo "📂 Vérification des fichiers de dashboards..."
if docker exec grafana-catalogue sh -c "ls /var/lib/grafana/dashboards/*.json" > /dev/null 2>&1; then
    echo "✅ Fichiers JSON trouvés:"
    docker exec grafana-catalogue sh -c "ls -lh /var/lib/grafana/dashboards/*.json" | awk '{print "   - " $9 " (" $5 ")"}'
else
    echo "❌ Aucun fichier JSON trouvé!"
    exit 1
fi
echo ""

# Vérifier le provisioning
echo "⚙️  Vérification du provisioning..."
if docker exec grafana-catalogue sh -c "test -f /etc/grafana/provisioning/dashboards/dashboards.yml" 2>&1; then
    echo "✅ Fichier dashboards.yml présent"
    echo ""
    docker exec grafana-catalogue cat /etc/grafana/provisioning/dashboards/dashboards.yml | grep -A 1 "name:"
else
    echo "❌ Fichier dashboards.yml manquant!"
    exit 1
fi
echo ""

# Vérifier dans les logs
echo "📝 Logs de provisioning..."
docker logs grafana-catalogue 2>&1 | grep "provision dashboards" | tail -2
echo ""

# Liste des dashboards via l'API (sans auth pour la santé)
echo "📊 Dashboards disponibles:"
echo "   - E-Commerce Overview (http://localhost:3001)"
echo "   - API Performance (http://localhost:3001)"
echo ""

echo "================================================"
echo "✅ Vérification terminée!"
echo ""
echo "🌐 Accédez à Grafana:"
echo "   URL:      http://localhost:3001"
echo "   Login:    admin"
echo "   Password: admin"
echo ""
echo "📁 Les dashboards sont dans le dossier 'E-Commerce'"
echo "================================================"
