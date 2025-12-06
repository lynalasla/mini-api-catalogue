# 🎯 Checklist Rapide pour Collaborateurs

## ✅ Configuration Automatique (Aucune Action Requise)

Ces éléments sont **déjà configurés** dans le dépôt :

- [x] 📊 **Dashboards Grafana** provisionnés automatiquement
  - Dashboard "E-Commerce Overview" 
  - Dashboard "API Performance"
  - Dossier "E-Commerce" créé automatiquement
  
- [x] 🖼️ **Images produits** incluses localement
  - 22 images dans `client/public/images/products/`
  - Base de données configurée avec chemins locaux
  - Fonctionne derrière firewall
  
- [x] 📈 **Prometheus datasource** pré-configuré dans Grafana
  - URL : http://prometheus-catalogue:9090
  - Défini comme datasource par défaut
  
- [x] 🐳 **Docker Compose** avec 8 services
  - MySQL, phpMyAdmin, API, React, Nginx, Prometheus, Grafana, Superset

## 📋 Actions Nécessaires (Une Seule Fois)

Après avoir cloné le projet :

### 1. Installer les dépendances

```bash
npm install
cd client && npm install && cd ..
```

### 2. Démarrer Docker

```bash
docker-compose up -d
```

Attendre 30 secondes ⏱️

### 3. Appliquer le schéma Prisma

```bash
npx prisma db push
```

### 4. Insérer les données

**Option A - Seed (données test)** :
```bash
npx prisma db seed
```

**Option B - Restauration (données réelles)** :
```bash
node restore-database.cjs backups/database_backup_2025-12-06T11-22-30.xlsx
```

## 🌐 Accès aux Services

| Service | URL | Login |
|---------|-----|-------|
| Frontend | http://localhost:5173 | - |
| API | http://localhost:3000 | - |
| **Grafana** 📊 | http://localhost:3001 | admin / admin |
| phpMyAdmin | http://localhost:8080 | catalogue_user / catalogue_password |
| Prometheus | http://localhost:9090 | - |
| Superset | http://localhost:8088 | admin / admin |

## 🎯 Vérifications Rapides

```bash
# API fonctionne
curl http://localhost:3000/api/products

# Frontend accessible
curl http://localhost:5173

# Dashboards Grafana chargés
bash verify-grafana-dashboards.sh

# Images présentes
ls -lh client/public/images/products/
```

## ✨ Points Clés

1. **Les dashboards Grafana sont DÉJÀ LÀ** - Connectez-vous et ils sont visibles !
2. **Les images sont INCLUSES** - Pas besoin de télécharger quoi que ce soit
3. **Les mots de passe temporaires sont GÉNÉRÉS** - Affichés après la restauration
4. **Tout est DOCUMENTÉ** - Voir [AUTO_SETUP_FEATURES.md](AUTO_SETUP_FEATURES.md)

## 📚 Documentation

- **[AUTO_SETUP_FEATURES.md](AUTO_SETUP_FEATURES.md)** - Tout ce qui est automatique
- **[GUIDE_COLLABORATEURS.md](GUIDE_COLLABORATEURS.md)** - Guide complet
- **[README.md](README.md)** - Documentation principale

---

**Temps d'installation : 5-10 minutes** ⏱️  
**Tout le reste fonctionne automatiquement** ✨
