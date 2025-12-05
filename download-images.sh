#!/bin/bash

# Script pour télécharger toutes les images Unsplash/externes localement
# et mettre à jour les URLs dans la base de données

echo "================================================"
echo "  📥 Téléchargement des Images Localement"
echo "================================================"
echo ""

# Créer le dossier pour les images
echo "📁 Création du dossier d'images..."
mkdir -p client/public/images/products

# Récupérer les produits depuis l'API
echo "📊 Récupération des produits depuis l'API..."
PRODUCTS=$(curl -s http://localhost:3000/api/products)

# Compteur
COUNTER=1
TOTAL=$(echo "$PRODUCTS" | jq '. | length')

echo "✅ $TOTAL produits trouvés"
echo ""

# Fonction pour télécharger une image
download_image() {
    local url=$1
    local product_id=$2
    local product_name=$3
    
    echo "[$COUNTER/$TOTAL] Téléchargement: $product_name (ID: $product_id)"
    
    # Déterminer l'extension
    local ext="jpg"
    if [[ $url == *".png"* ]]; then
        ext="png"
    elif [[ $url == *".webp"* ]]; then
        ext="webp"
    fi
    
    # Nom du fichier local
    local filename="product-${product_id}.${ext}"
    local filepath="client/public/images/products/${filename}"
    
    # Télécharger l'image
    if curl -s -o "$filepath" "$url"; then
        echo "  ✅ Téléchargé: $filename"
        
        # Retourner le nouveau chemin
        echo "/images/products/${filename}"
    else
        echo "  ❌ Échec: $url"
        echo ""
    fi
    
    ((COUNTER++))
}

# Générer le script SQL pour mettre à jour les URLs
echo "📝 Génération du script SQL..."
SQL_FILE="update-image-urls.sql"
echo "-- Script SQL pour mettre à jour les URLs d'images" > $SQL_FILE
echo "-- Généré le $(date)" >> $SQL_FILE
echo "" >> $SQL_FILE

# Parcourir chaque produit et télécharger l'image
echo "$PRODUCTS" | jq -c '.[]' | while read -r product; do
    ID=$(echo "$product" | jq -r '.id')
    NAME=$(echo "$product" | jq -r '.name')
    IMAGE_URL=$(echo "$product" | jq -r '.image_url')
    
    if [ "$IMAGE_URL" != "null" ] && [ ! -z "$IMAGE_URL" ]; then
        # Télécharger l'image
        NEW_PATH=$(download_image "$IMAGE_URL" "$ID" "$NAME")
        
        if [ ! -z "$NEW_PATH" ]; then
            # Ajouter la commande SQL
            echo "UPDATE products SET image_url = '$NEW_PATH' WHERE id = $ID;" >> $SQL_FILE
        fi
    else
        echo "[$COUNTER/$TOTAL] ⚠️  Pas d'image pour: $NAME (ID: $ID)"
        ((COUNTER++))
    fi
    
    echo ""
done

echo ""
echo "================================================"
echo "✅ Téléchargement terminé!"
echo ""
echo "📊 Statistiques:"
echo "   - Images téléchargées: $(ls -1 client/public/images/products/*.{jpg,png,webp} 2>/dev/null | wc -l)"
echo "   - Dossier: client/public/images/products/"
echo ""
echo "🔄 Prochaine étape: Mettre à jour la base de données"
echo ""
echo "Option 1: Via MySQL directement"
echo "   docker exec -i mysql-catalogue mysql -u root -proot_password mini_catalogue < $SQL_FILE"
echo ""
echo "Option 2: Via phpMyAdmin"
echo "   1. Ouvrir http://localhost:8080"
echo "   2. Aller dans SQL"
echo "   3. Copier le contenu de $SQL_FILE"
echo "   4. Exécuter"
echo ""
echo "Option 3: Via script Node.js"
echo "   node update-image-urls.cjs"
echo "================================================"
