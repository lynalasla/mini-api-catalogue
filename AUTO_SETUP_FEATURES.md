# ✨ Fonctionnalités Automatiques pour Collaborateurs

Ce document liste toutes les configurations qui sont **automatiquement** chargées quand vous clonez le projet. **Aucune configuration manuelle requise !**

## 🎯 Ce qui fonctionne "Out of the Box"

### 1. 📊 Dashboards Grafana

**✅ Automatiquement provisionnés au démarrage**

Quand vous lancez `docker-compose up -d`, Grafana charge automatiquement :

- **Dashboard "E-Commerce Overview"** : Métriques business
  - Total produits, commandes, utilisateurs, catégories
  - Taux de requêtes par seconde
  - Temps de réponse p95
  - Statistiques par endpoint

- **Dashboard "API Performance"** : Métriques techniques
  - CPU, Memory, Active Connections
  - Response Time Percentiles (p50, p95, p99)
  - HTTP Status Codes (2xx, 4xx, 5xx)
  - Memory details, Garbage Collection

**Accès** :
1. http://localhost:3001
2. Login : `admin` / `admin`
3. Menu **Dashboards** → Dossier **E-Commerce**

**Vérification** :
```bash
bash verify-grafana-dashboards.sh
```

### 2. 🖼️ Images Produits

**✅ Images locales incluses dans le dépôt**

Toutes les images des 22 produits sont **incluses localement** :

- Stockées dans : `client/public/images/products/`
- Base de données configurée avec chemins locaux : `/images/products/product-X.jpg`
- **Fonctionne même derrière un firewall** (pas de dépendance externe)

**Migration** :
Si vous avez des URLs externes (Unsplash, Pixabay) :
```bash
node download-images.cjs      # Télécharge toutes les images
node update-image-urls.cjs    # Met à jour la base de données
```

### 3. 🔄 Source de Données Prometheus

**✅ Datasource Prometheus pré-configuré dans Grafana**

- URL : `http://prometheus-catalogue:9090`
- UID : `PROMETHEUS`
- Défini comme datasource par défaut
- Fichier : `grafana/provisioning/datasources/prometheus.yml`

### 4. 📦 Conteneurs Docker

**✅ 8 services configurés et prêts**

```bash
docker-compose up -d
```

Lance automatiquement :
- MySQL + phpMyAdmin
- API Node.js
- Frontend React (Vite dev server)
- Nginx (production)
- Prometheus (collecte métriques)
- Grafana (visualisation)
- Superset (BI)

### 5. 🗄️ Schéma Base de Données

**⚠️ Une seule commande requise**

```bash
npx prisma db push
```

Puis au choix :
```bash
# Option A : Seed (données test)
npx prisma db seed

# Option B : Restauration (données réelles)
node restore-database.cjs backups/database_backup_YYYY-MM-DD.xlsx
```

### 6. 🔐 Mots de Passe Temporaires

**✅ Générés automatiquement lors de la restauration**

Quand vous restaurez un backup :
```bash
node restore-database.cjs backups/fichier.xlsx
```

Le script génère et affiche automatiquement :
```
📋 INFORMATIONS DE CONNEXION:
👤 🔐 ADMIN
   Email:    admin@catalogue.com
   Password: Templ1cpdyb9!

👤 USER
   Email:    user@catalogue.com
   Password: Tempq5n1ocrj!
```

### 7. 📈 Métriques Prometheus

**✅ Collecte automatique des métriques**

L'API expose automatiquement :
- **Business metrics** : `products_count`, `orders_count`, `users_count`, `categories_count`
- **HTTP metrics** : `http_requests_total`, `http_request_duration_seconds`
- **Node.js metrics** : CPU, memory, event loop, GC

Endpoint : http://localhost:3000/metrics

## 📝 Ce qui Nécessite une Action

### 1. Installation initiale

```bash
npm install           # Dépendances backend
cd client && npm install  # Dépendances frontend
```

### 2. Appliquer le schéma Prisma

```bash
npx prisma db push
```

### 3. Insérer les données (une seule fois)

```bash
# Soit seed
npx prisma db seed

# Soit restauration
node restore-database.cjs backups/fichier.xlsx
```

## 🎯 Workflow Typique pour un Nouveau Collaborateur

```bash
# 1. Cloner
git clone https://github.com/lynalasla/mini-api-catalogue.git
cd mini-api-catalogue

# 2. Installer
npm install
cd client && npm install && cd ..

# 3. Démarrer Docker
docker-compose up -d

# 4. Attendre 30 secondes, puis appliquer schéma
npx prisma db push

# 5. Restaurer les données
node restore-database.cjs backups/database_backup_2025-12-06T11-22-30.xlsx

# 6. Vérifier
curl http://localhost:3000/api/products
curl http://localhost:5173

# 7. Accéder Grafana (dashboards déjà là !)
# http://localhost:3001 → admin/admin → Dashboards → E-Commerce
```

**Temps total : 5-10 minutes** ⏱️

## 📊 Vérifications Automatiques

### Script de vérification Grafana

```bash
bash verify-grafana-dashboards.sh
```

Vérifie :
- ✅ Grafana démarré
- ✅ Fichiers JSON présents
- ✅ Provisioning configuré
- ✅ Logs de provisioning OK

### Test des métriques

```bash
bash test-metrics.sh
```

Génère du trafic et vérifie les métriques.

## 🆘 Troubleshooting

### Les dashboards n'apparaissent pas

```bash
# Redémarrer Grafana
docker-compose restart grafana

# Vérifier les logs
docker logs grafana-catalogue | grep -i dashboard
```

### Les images ne s'affichent pas

```bash
# Vérifier les images locales
ls -lh client/public/images/products/

# Si vide, re-télécharger
node download-images.cjs
node update-image-urls.cjs
```

### Prometheus ne collecte pas

```bash
# Vérifier l'endpoint métriques
curl http://localhost:3000/metrics

# Redémarrer Prometheus
docker-compose restart prometheus
```

## 📚 Documentation Complète

- **[GUIDE_COLLABORATEURS.md](GUIDE_COLLABORATEURS.md)** - Guide de démarrage rapide
- **[README.md](README.md)** - Documentation principale
- **[GRAFANA_VERIFICATION.md](GRAFANA_VERIFICATION.md)** - Guide de vérification Grafana
- **[IMAGES_LOCAL_SETUP.md](IMAGES_LOCAL_SETUP.md)** - Migration images locales
- **[RESTAURATION_GUIDE.md](RESTAURATION_GUIDE.md)** - Troubleshooting restauration

---

**✨ Tout est configuré pour vous ! Profitez du développement sans perdre de temps en configuration.**
