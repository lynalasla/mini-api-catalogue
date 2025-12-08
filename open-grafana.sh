#!/bin/bash

# Script pour ouvrir Grafana avec la bonne configuration
# et afficher les instructions visuelles

echo "================================================"
echo "  📊 Ouverture de Grafana avec Time Range Correct"
echo "================================================"
echo ""

# Vérifier que Grafana tourne
if ! docker ps | grep -q grafana-catalogue; then
    echo "❌ Grafana n'est pas démarré"
    echo "   Lancez: docker-compose up -d grafana"
    exit 1
fi

echo "✅ Grafana est en cours d'exécution"
echo ""

# Générer un peu de trafic avant d'ouvrir
echo "📤 Génération de quelques requêtes..."
for i in {1..5}; do
    curl -s http://localhost:3000/api/products > /dev/null &
    curl -s http://localhost:3000/api/categories > /dev/null &
done
wait
echo "✅ 10 requêtes envoyées"
echo ""

# Attendre un peu pour que Prometheus collecte
echo "⏳ Attente de 10 secondes (collecte Prometheus)..."
sleep 10
echo ""

# Instructions visuelles
echo "================================================"
echo "  🎯 INSTRUCTIONS IMPORTANTES"
echo "================================================"
echo ""
echo "Grafana va s'ouvrir dans votre navigateur."
echo ""
echo "⚠️  VOUS DEVEZ CHANGER LA PLAGE DE TEMPS !"
echo ""
echo "1️⃣  Cherchez l'HORLOGE ⏰ en HAUT À DROITE"
echo "   (à côté du bouton Refresh)"
echo ""
echo "2️⃣  Cliquez dessus"
echo ""
echo "3️⃣  Sélectionnez 'Last 5 minutes'"
echo "   OU entrez manuellement:"
echo "   - From: now-5m"
echo "   - To: now"
echo ""
echo "4️⃣  Cliquez 'Apply'"
echo ""
echo "5️⃣  Cliquez 'Refresh' 🔄"
echo ""
echo "================================================"
echo ""
echo "Appuyez sur ENTRÉE pour ouvrir Grafana..."
read

# Ouvrir Grafana
URL="http://localhost:3001"

# Détection de l'OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$URL" 2>/dev/null || firefox "$URL" 2>/dev/null || google-chrome "$URL" 2>/dev/null
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "$URL"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    start "$URL"
else
    echo "Ouvrez manuellement: $URL"
fi

echo ""
echo "✅ Grafana ouvert !"
echo ""
echo "📋 Rappel des identifiants:"
echo "   Login: admin"
echo "   Password: admin"
echo ""
echo "💡 N'oubliez pas: Time Range → 'Last 5 minutes'"
echo ""
echo "================================================"
