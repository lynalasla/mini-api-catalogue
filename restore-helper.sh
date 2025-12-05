#!/bin/bash

# Script d'aide pour les collaborateurs
# Ce script guide l'utilisateur dans le processus de restauration

echo "================================================"
echo "  📦 Aide Restauration Base de Données"
echo "================================================"
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "restore-database.cjs" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    echo "   Exécutez: cd mini-api-catalogue"
    exit 1
fi

# Vérifier que le dossier backups existe
if [ ! -d "backups" ]; then
    echo "❌ Erreur: Le dossier 'backups/' n'existe pas"
    exit 1
fi

# Lister les backups disponibles
echo "📋 Backups disponibles:"
echo ""
ls -lh backups/*.xlsx 2>/dev/null || {
    echo "❌ Aucun fichier de backup trouvé dans backups/"
    exit 1
}

echo ""
echo "================================================"
echo ""

# Trouver le fichier le plus récent
LATEST_BACKUP=$(ls -t backups/*.xlsx 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ Aucun backup trouvé"
    exit 1
fi

echo "✨ Backup le plus récent: $(basename $LATEST_BACKUP)"
echo ""

# Demander confirmation
read -p "Voulez-vous restaurer ce backup ? (o/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
    echo "❌ Restauration annulée"
    exit 0
fi

echo ""
echo "🔄 Démarrage de la restauration..."
echo "================================================"
echo ""

# Lancer la restauration
node restore-database.cjs "$LATEST_BACKUP"

RESULT=$?

echo ""
echo "================================================"

if [ $RESULT -eq 0 ]; then
    echo "✅ Restauration terminée avec succès!"
    echo ""
    echo "📌 Prochaines étapes:"
    echo "   1. Conservez les mots de passe temporaires affichés ci-dessus"
    echo "   2. Connectez-vous sur http://localhost:5173"
    echo "   3. Changez votre mot de passe après connexion"
    echo ""
    echo "🔍 Vérifier les données:"
    echo "   npx prisma studio"
    echo "   Puis ouvrir http://localhost:5555"
else
    echo "❌ Erreur lors de la restauration"
    echo ""
    echo "💡 Conseils de dépannage:"
    echo "   1. Vérifiez que Docker est démarré: docker-compose ps"
    echo "   2. Vérifiez les dépendances: npm install"
    echo "   3. Consultez GUIDE_COLLABORATEURS.md"
fi

echo "================================================"
