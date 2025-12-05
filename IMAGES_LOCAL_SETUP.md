# 📥 Migration des Images vers Hébergement Local

## 🎯 Objectif

Télécharger toutes les images depuis les sources externes (Unsplash, Pixabay, Bing) et les héberger localement dans le projet pour éviter les problèmes de firewall.

## 📋 Prérequis

- Docker en cours d'exécution
- `jq` installé (pour parser JSON)
- `curl` disponible

### Installation de jq (si nécessaire)

```bash
# Windows (Git Bash)
# jq est inclus dans Git Bash

# Linux
sudo apt install jq

# Mac
brew install jq
```

## 🚀 Utilisation

### Étape 1 : Télécharger les images

```bash
./download-images.sh
```

**Ce script va :**
1. Créer le dossier `client/public/images/products/`
2. Récupérer tous les produits depuis l'API
3. Télécharger chaque image avec le nom `product-{id}.jpg`
4. Générer un fichier SQL `update-image-urls.sql`

**Durée estimée :** 1-2 minutes (dépend du nombre de produits)

### Étape 2 : Mettre à jour la base de données

**Option A : Via le script Node.js (Recommandé)**

```bash
node update-image-urls.cjs
```

**Option B : Via MySQL directement**

```bash
docker exec -i mysql-catalogue mysql -u root -proot_password mini_catalogue < update-image-urls.sql
```

**Option C : Via phpMyAdmin**

1. Ouvrir http://localhost:8080
2. Connexion : `catalogue_user` / `catalogue_password`
3. Sélectionner la base `mini_catalogue`
4. Aller dans l'onglet **SQL**
5. Copier le contenu de `update-image-urls.sql`
6. Exécuter

### Étape 3 : Redémarrer le frontend

```bash
docker-compose restart react-dev
```

### Étape 4 : Vérifier

```bash
# Tester l'API
curl http://localhost:3000/api/products | grep image_url

# Vous devriez voir des URLs comme :
# "image_url":"/images/products/product-2.jpg"

# Ouvrir le navigateur
# http://localhost:5173
# Les images devraient maintenant s'afficher !
```

## 📁 Structure créée

```
client/
└── public/
    └── images/
        └── products/
            ├── product-2.jpg
            ├── product-3.jpg
            ├── product-4.jpg
            └── ...
```

## 🔄 Processus Complet (One-liner)

```bash
./download-images.sh && node update-image-urls.cjs && docker-compose restart react-dev
```

## ✅ Vérification Post-Migration

### 1. Vérifier les fichiers téléchargés

```bash
ls -lh client/public/images/products/
```

Vous devriez voir tous les fichiers `product-*.jpg`

### 2. Vérifier les URLs dans la base

```bash
curl -s http://localhost:3000/api/products | jq '.[].image_url' | head -10
```

Devrait afficher :
```
"/images/products/product-2.jpg"
"/images/products/product-3.jpg"
...
```

### 3. Tester dans le navigateur

1. Ouvrir http://localhost:5173
2. Vérifier que toutes les images s'affichent
3. Ouvrir DevTools (F12) → Console
4. Aucune erreur de chargement d'image ne devrait apparaître

## 🎨 Ajouter de Nouvelles Images

Pour ajouter une image pour un nouveau produit :

```bash
# 1. Placer l'image dans le dossier
cp mon-image.jpg client/public/images/products/product-25.jpg

# 2. Mettre à jour le produit dans la base
# Via Prisma Studio (http://localhost:5555)
# Ou via API/Admin panel

# 3. Utiliser le chemin : /images/products/product-25.jpg
```

## 🔧 Dépannage

### Erreur "jq: command not found"

```bash
# Installer jq
# Windows: Inclus dans Git Bash
# Linux: sudo apt install jq
# Mac: brew install jq
```

### Erreur "Cannot connect to API"

```bash
# Vérifier que Docker tourne
docker-compose ps

# Vérifier que l'API répond
curl http://localhost:3000/api/products
```

### Images ne se téléchargent pas

```bash
# Vérifier la connexion internet
ping images.unsplash.com

# Tester manuellement
curl -I https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400
```

### Images téléchargées mais ne s'affichent pas

```bash
# Vérifier les permissions
ls -la client/public/images/products/

# Redémarrer le frontend
docker-compose restart react-dev

# Vider le cache du navigateur (Ctrl+Shift+R)
```

## 📦 Inclure dans le Backup

Les images locales seront automatiquement incluses dans le repository Git.

**Ajouter au .gitignore si trop volumineux :**

```bash
# Dans .gitignore
# client/public/images/products/*.jpg
```

Mais **recommandé** de les commiter pour que les collaborateurs les aient directement.

## 🚀 Pour les Collaborateurs

Après avoir pull les dernières modifications :

```bash
git pull origin frontend

# Les images sont déjà dans client/public/images/products/
# Restaurer la base de données comme d'habitude
npx prisma db push
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx

# Le script de restauration devrait maintenant utiliser les URLs locales
# Si ce n'est pas le cas, lancer :
node update-image-urls.cjs
```

## ✨ Avantages

- ✅ Aucune dépendance externe (Unsplash, Pixabay)
- ✅ Fonctionne derrière firewall d'entreprise
- ✅ Chargement plus rapide
- ✅ Contrôle total sur les images
- ✅ Backup complet avec les images

---

**Questions ? Consultez :**
- IMAGES_TROUBLESHOOTING.md
- GUIDE_COLLABORATEURS.md
