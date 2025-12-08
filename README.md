# 🛍️ Mini API Catalogue - E-Commerce Full-Stack Application

[![CI/CD Pipeline](https://github.com/lynalasla/mini-api-catalogue/actions/workflows/ci.yml/badge.svg)](https://github.com/lynalasla/mini-api-catalogue/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-20.x-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Plateforme e-commerce moderne** avec API REST, interface React interactive, base de données MySQL, système de backup Excel, et module A/B Testing intégré.

---

## 🚀 Démarrage Rapide pour Collaborateurs

**📌 Vous êtes nouveau sur le projet ? Consultez [GUIDE_COLLABORATEURS.md](GUIDE_COLLABORATEURS.md) pour une mise en route rapide !**

**Commandes essentielles :**

```bash
# 1. Cloner et installer
git clone https://github.com/lynalasla/mini-api-catalogue.git
cd mini-api-catalogue
npm install

# 2. Démarrer l'application
docker-compose up -d

# 3. Restaurer les données (SI vous avez un backup)
npx prisma db push
node restore-database.cjs backups/database_backup_2025-12-08T22-21-33.xlsx

# si image ne s'affiche pas
node update-image-urls.cjs


```

**📊 Services accessibles :**

- Frontend: http://localhost:5173
- <img width="1908" height="923" alt="image" src="https://github.com/user-attachments/assets/4fbf1f12-60fa-4a33-8682-005afff8e4c0" />

- API: http://localhost:3000
- phpMyAdmin: http://localhost:8080
- Grafana (Business Intelligence): http://localhost:3001 (admin/admin)
- <img width="1893" height="904" alt="image" src="https://github.com/user-attachments/assets/9329e258-da5a-4e53-a621-1deb58a3271c" />

- Prometheus (Métriques): http://localhost:9090

---

## 📖 Description complète de l'application

**Mini API Catalogue** est une application e-commerce full-stack complète, conçue pour la gestion de catalogues de produits avec une interface utilisateur moderne et des fonctionnalités avancées de tests A/B.

### 🎯 Vue d'ensemble

Cette application propose une solution complète pour :

- **Gestion de catalogue** : Produits, catégories, inventaire en temps réel
- **Espace client** : Authentification, panier, commandes, profil utilisateur
- **Administration** : Dashboard admin, gestion des produits et commandes
- **Analytics** : Module A/B Testing avec analyse statistique avancée
- **Sécurité** : JWT, hashing bcrypt, validation des entrées, 0 vulnérabilités
- **Backup** : Sauvegarde/restauration automatique des données en Excel
- **Business Intelligence** : Dashboards Grafana temps réel avec métriques avancées

### 🏗️ Architecture technique

```
┌─────────────────────────────────────────────────────────────────────┐
│                       NGINX (Port 80)                               │
│                 Reverse Proxy & Load Balancer                       │
└────────────┬──────────────────────────────────┬─────────────────────┘
             │                                  │
    ┌────────▼────────┐               ┌────────▼────────┐
    │  React Frontend │               │   API Backend   │
    │   (Port 5173)   │               │   (Port 3000)   │
    │  Vite + React   │               │  Express + JWT  │
    └────────┬────────┘               └────────┬────────┘
             │                                  │
             │         ┌────────────────────────┼──────────────┐
             │         │                        │              │
    ┌────────▼─────────▼──────┐     ┌──────────▼────┐    ┌───▼─────────┐
    │   MySQL Database        │     │ Prisma ORM    │    │  Prometheus  │
    │     (Port 3306)         │     │   Client      │    │  (Port 9090) │
    │  + phpMyAdmin (8080)    │     └───────────────┘    └───┬─────────┘
    └─────────────────────────┘                              │
                                                   ┌──────────▼──────────┐
                                                   │      Grafana        │
                                                   │    (Port 3001)      │
                                    ┌──────────────┤  Dashboards & Charts│
                                    │              └─────────────────────┘
                          ┌─────────▼────────┐
                          │  A/B Testing API  │
                          │   Python Flask    │
                          │   (Port 5001)     │
                          └───────────────────┘
```

### ✨ Fonctionnalités principales

#### 🛒 **Côté client (E-Commerce)**

- **Catalogue produits**

  - Navigation par catégories avec filtres avancés
  - Recherche en temps réel avec suggestions
  - Affichage grille/liste avec images optimisées
  - Détails produits avec galerie photos
  - Stock en temps réel et indicateurs de disponibilité

- **Système de panier**

  - Ajout/retrait de produits avec animations
  - Calcul automatique des totaux et taxes
  - Persistance du panier (authentifié/local storage)
  - Validation du stock avant commande

- **Gestion des commandes**

  - Historique des commandes avec statuts
  - Suivi en temps réel des livraisons
  - Détails de facturation et livraison
  - Notifications par email (à venir)

- **Authentification & Profil**

  - Inscription/connexion sécurisée (JWT)
  - Profil utilisateur modifiable
  - Gestion des adresses de livraison
  - Réinitialisation de mot de passe

- **Interface moderne**
  - Design responsive (mobile-first)
  - Animations fluides et micro-interactions
  - Dark mode (optionnel)
  - Notifications toast pour les actions

#### 👨‍💼 **Côté administrateur**

- **Dashboard Business Intelligence**

  - 📊 **3 Dashboards Grafana professionnels** préconfigurés
  - 💰 **Métriques financières** : CA total, panier moyen, revenus du jour
  - 📦 **Suivi opérationnel** : Commandes, stock, alertes rupture
  - 👥 **Analytics clients** : Utilisateurs actifs, taux de conversion
  - ⚡ **Performance système** : Latence API, CPU, mémoire
  - 📈 **Graphiques historiques** : Évolution des ventes en temps réel

- **Gestion des produits**

  - CRUD complet (Create, Read, Update, Delete)
  - Upload d'images multiples
  - Gestion du stock et prix
  - Import/export Excel

- **Gestion des commandes**

  - Tableau de bord des commandes
  - Mise à jour des statuts
  - Impression des bons de commande
  - Export des rapports

- **Gestion des utilisateurs**
  - Liste des clients
  - Historique d'achats par client
  - Gestion des rôles (admin/user)

#### 🔬 **Module A/B Testing**

- **Expérimentation produits**

  - Tests A/B/n multivariés
  - Segmentation des utilisateurs
  - Attribution automatique des variants

- **Analyse statistique**

  - Tests Z (taux de conversion)
  - Tests Chi-carré (distribution)
  - Analyse Bayésienne (probabilités)
  - Calcul de la taille d'échantillon
  - Intervalles de confiance

- **API REST**
  - Création/gestion des tests
  - Tracking des conversions
  - Endpoints pour analytics
  - Export des résultats

#### 💾 **Système de backup**

- **Sauvegarde automatique**

  - Export Excel de toutes les tables
  - Formatage professionnel (en-têtes, largeurs)
  - Noms de fichiers horodatés
  - Compression et archivage

- **Restauration**

  - Import depuis fichiers Excel
  - Validation des données
  - Gestion des conflits (upsert)
  - Sécurité : mots de passe exclus

- **Commandes simples**
  ```bash
  npm run backup   # Créer une sauvegarde
  npm run restore  # Restaurer depuis Excel
  ```

#### 📊 **Business Intelligence & Monitoring (Grafana)**

- **📈 Dashboard Business Intelligence**

  - **💰 Chiffre d'Affaires Total** : Revenus cumulés en temps réel
  - **📦 Commandes Totales** : Nombre de commandes passées
  - **👥 Clients Inscrits** : Base utilisateurs active
  - **💵 Panier Moyen** : Valeur moyenne des commandes
  - **📊 Évolution du CA** : Graphique historique des revenus
  - **🎯 Taux de Conversion** : Performance des ventes
  - **📉 Stock Faible** : Alertes produits en rupture
  - **👤 Utilisateurs Actifs** : Clients ayant passé commande

- **⚡ Dashboard API Performance**

  - **CPU & Mémoire** : Utilisation ressources système
  - **Latence HTTP** : Temps de réponse (p50, p95, p99)
  - **Taux de Requêtes** : Requêtes/seconde par endpoint
  - **Statuts HTTP** : Répartition 2xx, 4xx, 5xx
  - **Event Loop Lag** : Performance Node.js
  - **Connexions Actives** : Nombre de connexions simultanées

- **🛍️ Dashboard E-Commerce Overview**

  - **Catalogue** : Nombre de produits et catégories
  - **Commandes** : Volume et tendances
  - **Utilisateurs** : Croissance de la base client
  - **Performance** : Métriques globales du système

- **🔧 Prometheus + Grafana**
  - Scraping automatique toutes les 15 secondes
  - Métriques business calculées dynamiquement depuis MySQL
  - Rétention des données sur 15 jours
  - Dashboards pré-configurés et provisionnés
  - Accès : http://localhost:3001 (admin/admin)

### 🛠️ Stack technologique détaillée

#### **Backend (API Node.js)**

- **Framework** : Express.js 4.19
- **ORM** : Prisma 5.19.1 (MySQL)
- **Authentification** : JWT (jsonwebtoken 9.0.2)
- **Sécurité** : bcryptjs, helmet, express-rate-limit
- **Validation** : express-validator
- **CORS** : cors middleware
- **Logs** : morgan
- **Dev** : nodemon 3.1.7

#### **Frontend (React)**

- **Framework** : React 18.3
- **Build** : Vite 5.4
- **Routing** : React Router v6
- **State** : Context API + Hooks
- **HTTP** : Axios
- **Styling** : CSS3 moderne + Variables
- **Icons** : React Icons
- **Notifications** : React Toastify

#### **Base de données**

- **SGBD** : MySQL 8.0
- **ORM** : Prisma (type-safe)
- **Admin** : phpMyAdmin 5.2
- **Migrations** : Prisma Migrate
- **Seeding** : Scripts automatiques

#### **A/B Testing (Python)**

- **Framework** : Flask 3.0
- **Stats** : NumPy 1.26+, SciPy 1.11+
- **API** : Flask-CORS
- **Tests** : pytest, unittest
- **Code quality** : flake8, pylint (10/10)

#### **DevOps & Infrastructure**

- **Conteneurisation** : Docker 24+, Docker Compose (7 services)
- **Reverse Proxy** : Nginx 1.27-alpine
- **Monitoring & Observability** :
  - Prometheus : Collecte de métriques (scraping 15s)
  - Grafana : Dashboards & visualisations
  - prom-client : Exposition métriques Node.js
- **CI/CD** : GitHub Actions (6 jobs)
  - Tests backend (Jest)
  - Tests frontend (Vitest)
  - Build Docker (multi-stage)
  - Security scan (npm audit, CodeQL)
  - Code quality (ESLint, flake8, pylint)
  - A/B Testing tests (pytest)
- **Logs** : Docker logs centralisés

#### **Sécurité**

- **Vulnérabilités** : 0 (npm audit clean ✅)
- **JWT** : Tokens sécurisés avec expiration
- **Passwords** : Hashing bcrypt (10 rounds)
- **SQL Injection** : Protection Prisma
- **XSS** : Sanitization des entrées
- **CORS** : Configuration stricte
- **Rate Limiting** : Protection API

### 📊 Base de données - Schéma

```prisma
// Utilisateurs
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  password   String
  firstName  String
  lastName   String
  role       String   @default("user")
  createdAt  DateTime @default(now())
  orders     Order[]
  cartItems  CartItem[]
}

// Catégories
model Category {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  description String?
  products    Product[]
}

// Produits
model Product {
  id          Int         @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int         @default(0)
  imageUrl    String?
  categoryId  Int
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  cartItems   CartItem[]
}

// Commandes
model Order {
  id          Int         @id @default(autoincrement())
  userId      Int
  total       Float
  status      String      @default("pending")
  createdAt   DateTime    @default(now())
  user        User        @relation(fields: [userId], references: [id])
  orderItems  OrderItem[]
}

// Articles de commande
model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

// Panier
model CartItem {
  id        Int     @id @default(autoincrement())
  userId    Int
  productId Int
  quantity  Int
  user      User    @relation(fields: [userId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

### 🎨 Captures d'écran

#### Page d'accueil

- Hero banner avec appel à l'action
- Catégories rapides avec icônes
- Ventes flash avec compte à rebours
- Produits du jour personnalisés
- Boutiques best-sellers

#### Page produit

- Galerie d'images zoomable
- Informations détaillées
- Boutons d'action (panier, favori)
- Produits similaires
- Avis clients (à venir)

#### Dashboard admin

- Graphiques interactifs
- Tableaux de données
- Actions rapides
- Statistiques temps réel

### 📦 Structure du projet

````
mini-api-catalogue/
├── 📁 Backend (Node.js + Express)
│   ├── server.js              # Point d'entrée principal
│   ├── config/                # Configuration (DB, Prisma)
│   ├── middleware/            # JWT, auth, validation
│   ├── routes/                # API endpoints
│   │   ├── auth.js           # Authentification
│   │   ├── products.js       # CRUD produits
│   │   ├── categories.js     # CRUD catégories
│   │   ├── orders.js         # Gestion commandes
│   │   ├── cart.js           # Panier
│   │   └── users.js          # Utilisateurs
│   ├── prisma/
│   │   ├── schema.prisma     # Schéma DB
│   │   └── seed.js           # Données initiales
│   ├── backup-database.cjs   # Export Excel
│   └── restore-database.cjs  # Import Excel
│
├── 📁 Frontend (React + Vite)
│   └── client/
│       ├── src/
│       │   ├── components/   # Composants réutilisables
│       │   │   ├── Header.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── CartPanel.jsx
│       │   │   ├── AuthModal.jsx
│       │   │   └── ...
│       │   ├── pages/        # Pages principales
│       │   │   ├── Home.jsx
│       │   │   ├── ProductDetail.jsx
│       │   │   ├── SearchResults.jsx
│       │   │   ├── Orders.jsx
│       │   │   └── AdminDashboard.jsx
│       │   ├── context/      # State management
│       │   │   ├── AuthContext.jsx
│       │   │   └── CartContext.jsx
│       │   ├── layouts/
│       │   ├── assets/
│       │   └── App.jsx
│       ├── public/
│       └── vite.config.js
│
├── 📁 A/B Testing (Python + Flask)
│   └── ab_testing/
│       ├── ab_test.py        # Classe ABTest principale
│       ├── api.py            # API Flask
│       ├── statistical_analysis.py  # Tests statistiques
│       ├── cli.py            # Interface CLI
│       └── examples.py       # Exemples d'usage
│
├── 📁 Business Intelligence
│   ├── config/metrics/       # Configuration métriques
│   │   ├── prometheus.js     # Définition métriques custom
│   │   └── middleware.js     # Middleware HTTP metrics
│   ├── grafana/
│   │   ├── dashboards/       # 3 dashboards JSON
│   │   │   ├── business-intelligence.json
│   │   │   ├── api-performance.json
│   │   │   └── ecommerce-overview.json
│   │   └── provisioning/     # Configuration auto
│   │       ├── datasources/  # Prometheus datasource
│   │       └── dashboards/   # Provider config
│   └── prometheus.yml        # Config Prometheus
│
├── 📁 DevOps
│   ├── docker-compose.yml    # Orchestration 7 services
│   ├── Dockerfile            # Backend image
│   ├── Dockerfile.client     # Frontend image
│   ├── nginx.conf            # Configuration reverse proxy
│   ├── init.sql              # Initialisation DB
│   └── .github/
│       └── workflows/
│           └── ci.yml        # Pipeline CI/CD (6 jobs)
│
├── 📁 Documentation
│   ├── README.md             # Ce fichier
│   ├── API_DOCUMENTATION.md  # Doc API complète
│   ├── BACKUP_README.md      # Guide backup/restore
│   ├── RECOVERY.md           # Guide de récupération
│   ├── REACT_README.md       # Doc frontend
│   ├── GRAFANA_SETUP.md      # Setup Grafana & Prometheus
│   ├── GRAFANA_BUSINESS_INTELLIGENCE.md  # Guide BI
│   └── GRAFANA_VERIFICATION.md  # Dépannage Grafana
│
└── 📁 Configuration
    ├── package.json          # Dépendances Node.js
    ├── .env                  # Variables d'environnement
    ├── .gitignore
    └── sonar-project.properties  # SonarQube

---

## ��� Installation rapide sur un nouveau PC

### Prérequis système

Assurez-vous d'avoir installé :
- ✅ **Git** : [Download Git](https://git-scm.com/downloads)
- ✅ **Node.js 20+** : [Download Node.js](https://nodejs.org/)
- ✅ **Docker Desktop** : [Download Docker](https://www.docker.com/products/docker-desktop/)
- ✅ **Python 3.12+** (optionnel pour A/B Testing) : [Download Python](https://www.python.org/downloads/)

### Étape 1 : Cloner le repository

```bash
# Cloner depuis GitHub
git clone https://github.com/lynalasla/mini-api-catalogue.git

# Entrer dans le dossier
cd mini-api-catalogue

# Basculer sur la branche frontend (version complète)
git checkout frontend
````

### Étape 2 : Configuration de l'environnement

```bash
# Créer le fichier .env à la racine du projet
cat > .env << 'ENVEOF'
# Configuration Base de données
DATABASE_URL="mysql://catalogue_user:catalogue_password@localhost:3306/catalogue"

# JWT Secret (CHANGEZ cette valeur en production)
JWT_SECRET="votre_secret_jwt_super_securise_changez_moi_en_production"

# Environnement
NODE_ENV="production"

# Ports
PORT=3000
CLIENT_PORT=5173
ENVEOF
```

**��� Sur Windows, créez manuellement le fichier `.env` avec le contenu ci-dessus**

### Étape 3 : Installer les dépendances

```bash
# Dépendances backend
npm install

# Dépendances frontend
cd client
npm install
cd ..

# Dépendances Python A/B Testing (optionnel)
cd ab_testing
pip install -r requirements.txt
cd ..
```

### Étape 4 : Démarrer Docker

```bash
# Lancer tous les conteneurs (MySQL, API, Frontend, Nginx, phpMyAdmin)
docker-compose up -d

# Attendre que MySQL soit complètement démarré
echo "⏳ Attente du démarrage de MySQL (30 secondes)..."
sleep 30

# Vérifier que tous les conteneurs sont UP
docker-compose ps
```

**Résultat attendu** :

```
NAME                    STATUS
mysql-catalogue         Up (healthy)
mini-api-catalogue      Up
react-dev              Up
belibeli-nginx         Up
phpmyadmin             Up
prometheus-catalogue    Up
grafana-catalogue       Up
```

### Étape 5 : Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations (créer les tables)
npx prisma migrate deploy

# Insérer les données de démonstration (seed)
npm run prisma:seed
```

**✅ Résultat** : Base de données créée avec 2 catégories, 21 produits, 1 utilisateur admin

### Étape 6 : Restaurer les données depuis un backup (optionnel)

Si vous avez un fichier de backup Excel provenant d'un ancien PC :

```bash
# 1. Vérifier les backups disponibles
ls -lh backups/

# Exemple de sortie :
# -rw-r--r-- 1 user user 30K Dec  5 00:26 database_backup_2025-12-04T23-26-27.xlsx
# -rw-r--r-- 1 user user 13K Dec  5 00:34 database_backup_2025-12-04T23-34-09.xlsx

# 2. Restaurer depuis le backup le plus récent
node restore-database.cjs backups/database_backup_2025-12-04T23-26-27.xlsx

# ✅ La restauration va :
#    - Restaurer toutes les catégories
#    - Restaurer tous les produits
#    - Restaurer tous les utilisateurs avec mots de passe temporaires
#    - Restaurer toutes les commandes et articles
```

**Exemple de sortie après restauration réussie :**

```
✅ Restauration terminée avec succès!

📋 INFORMATIONS DE CONNEXION:
════════════════════════════════════════════════════════════

👤 🔐 ADMIN
   Email:    admin@catalogue.com
   Password: Templ1cpdyb9!

👤 USER
   Email:    user@catalogue.com
   Password: Tempq5n1ocrj!

════════════════════════════════════════════════════════════
⚠️  IMPORTANT: Conservez ces mots de passe temporaires!
💡  Les utilisateurs peuvent les changer après connexion.
```

**📝 Notes importantes :**

- ✅ **Mots de passe temporaires** générés automatiquement et affichés
- 🔐 **Connexion immédiate** possible avec ces identifiants
- 🔄 Les utilisateurs peuvent **changer leur mot de passe** après connexion
- 📊 Vérifiez les données restaurées avec `npx prisma studio` (http://localhost:5555)

### Étape 7 : Vérifier l'installation

```bash
# Tester l'API Backend
curl http://localhost:3000/api/products

# Tester le Frontend (ouvrir dans le navigateur)
# ��� http://localhost:5173

# Tester Nginx (reverse proxy)
# ��� http://localhost:80

# Tester phpMyAdmin (gestion base de données)
# ��� http://localhost:8080
# Utilisateur: catalogue_user
# Mot de passe: catalogue_password

# Tester Grafana (Business Intelligence)
# 🌐 http://localhost:3001
# Utilisateur: admin
# Mot de passe: admin

# Tester Prometheus (Métriques)
# 🌐 http://localhost:9090

# Voir les logs en temps réel
docker-compose logs -f
```

### Étape 8 : Créer votre premier backup

```bash
# Créer une sauvegarde de votre base de données
npm run backup

# Le fichier sera créé dans backups/ avec un horodatage
# Exemple : backups/database_backup_2025-12-05T10-30-45.xlsx
```

---

## ��� Checklist d'installation complète

Cochez chaque étape pour vous assurer que tout fonctionne :

- [ ] Git, Node.js, Docker installés
- [ ] Repository cloné depuis GitHub
- [ ] Fichier `.env` créé avec les bonnes variables
- [ ] Dépendances installées (`npm install` dans root et client/)
- [ ] Docker containers démarrés (`docker-compose up -d`)
- [ ] Base de données migrée (`npx prisma migrate deploy`)
- [ ] Données seed insérées (`npm run prisma:seed`)
- [ ] **(Optionnel)** Backup restauré (`npm run restore`)
- [ ] API testée (http://localhost:3000/api/products)
- [ ] Frontend accessible (http://localhost:5173)
- [ ] Grafana accessible (http://localhost:3001) avec login admin/admin
- [ ] Dashboards BI fonctionnels (3 dashboards affichent des données)
- [ ] Prometheus accessible (http://localhost:9090)
- [ ] Premier backup créé (`npm run backup`)

**✅ Installation terminée ! Votre application est prête à être utilisée.**

---

## ��� Commandes utiles quotidiennes

### Démarrage / Arrêt

```bash
# Démarrer l'application
docker-compose up -d

# Arrêter l'application
docker-compose down

# Redémarrer un service spécifique
docker-compose restart mini-api-catalogue

# Voir les logs en temps réel
docker-compose logs -f

# Voir le statut des conteneurs
docker-compose ps
```

### Backup / Restore

```bash
# Créer un backup
npm run backup

# Restaurer depuis un backup
npm run restore backups/fichier_backup.xlsx

# Lister les backups disponibles
ls -la backups/
```

### Base de données

```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Réinitialiser la base de données
npx prisma migrate reset --force

# Insérer les données de démonstration
npm run prisma:seed
```

### Développement

```bash
# Mode développement backend (avec hot-reload)
npm run dev

# Mode développement frontend
cd client
npm run dev

# Lancer les tests
npm test

# Vérifier les vulnérabilités
npm audit

# Mettre à jour les dépendances
npm update
```

---

## ��� Accès aux services

| Service             | URL                   | Description                         |
| ------------------- | --------------------- | ----------------------------------- |
| **Frontend**        | http://localhost:5173 | Interface utilisateur React         |
| **API Backend**     | http://localhost:3000 | API REST Express                    |
| **Nginx**           | http://localhost:80   | Reverse proxy (production)          |
| **phpMyAdmin**      | http://localhost:8080 | Interface MySQL                     |
| **Prisma Studio**   | http://localhost:5555 | ORM GUI (après `npx prisma studio`) |
| **A/B Testing API** | http://localhost:5001 | API Flask Python                    |
| **Grafana** 📊      | http://localhost:3001 | Dashboards & Monitoring             |
| **Prometheus**      | http://localhost:9090 | Métriques & Time-series DB          |

### Comptes par défaut

**Utilisateur Admin** (après seed)

- Email : `admin@example.com`
- Mot de passe : `admin123`

**Utilisateur Normal** (après seed)

- Email : `user@example.com`
- Mot de passe : `user123`

**phpMyAdmin**

- Utilisateur : `catalogue_user`
- Mot de passe : `catalogue_password`
- Base de données : `catalogue`

**Grafana** 📊

- Utilisateur : `admin`
- Mot de passe : `admin`
- Dashboards : E-Commerce Overview, API Performance (chargés automatiquement)

---

## 📊 Utilisation de Grafana

### ✨ Dashboards Automatiquement Provisionnés ET Pré-remplis

**Les dashboards sont automatiquement chargés ET pré-remplis avec des données au démarrage !**

1. **Ouvrir Grafana** : http://localhost:3001
2. **Se connecter** : admin / admin
3. **Accéder aux dashboards** :
   - Menu latéral → **Dashboards** → Dossier **E-Commerce**
   - Les 2 dashboards sont déjà disponibles **avec des données** !

**✨ Nouveauté** : Au premier `docker-compose up`, un service d'initialisation :

- Attend que l'API soit prête (max 60s)
- Génère automatiquement 30 requêtes
- Les dashboards sont **pré-remplis** dès le démarrage !

**Vérification rapide** :

```bash
# Vérifier que les dashboards sont chargés
bash verify-grafana-dashboards.sh

# Voir les logs d'initialisation
docker logs metrics-init-catalogue
```

### Dashboards disponibles

#### 📈 E-Commerce Overview

**Vue d'ensemble business en temps réel**

Métriques affichées :

- **Compteurs** : Total produits, commandes, utilisateurs, catégories
- **Taux de requêtes** : Graphique des requêtes/seconde par endpoint
- **Temps de réponse** : p95 des temps de réponse par route
- **Tableau d'endpoints** : Statistiques détaillées par route (Method, Status, Req/s)

**Utilisation** :

- Surveillance des KPIs business
- Détection des pics de trafic
- Analyse des endpoints les plus utilisés

#### ⚡ API Performance

**Métriques techniques et performance système**

Métriques affichées :

- **Gauges** : CPU Usage, Memory Usage, Active Connections, Event Loop Lag
- **Percentiles** : Temps de réponse (p50, p95, p99) par route
- **Status HTTP** : Répartition 2xx (succès), 4xx (erreur client), 5xx (erreur serveur)
- **Mémoire détaillée** : Resident Memory, Heap Used, External Memory
- **Garbage Collection** : Fréquence et type de GC

**Utilisation** :

- Détection des goulots d'étranglement
- Optimisation des performances
- Surveillance de la santé système

### Personnaliser les dashboards

```bash
# Les dashboards sont en JSON dans :
grafana/dashboards/ecommerce-overview.json
grafana/dashboards/api-performance.json

# Modifier un dashboard :
1. Ouvrir Grafana → Dashboard → Edit
2. Faire vos modifications
3. Save → Export to JSON
4. Remplacer le fichier dans grafana/dashboards/
5. Redémarrer : docker-compose restart grafana
```

### Créer des alertes (optionnel)

```yaml
# Exemple d'alerte dans prometheus.yml
groups:
  - name: api_alerts
    rules:
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
        for: 5m
        annotations:
          summary: "API response time too high"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 2m
        annotations:
          summary: "High rate of 5xx errors"
```

### Exporter les dashboards

```bash
# Depuis Grafana UI
Dashboard → Share → Export → Save to file

# Ou via API
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/dashboards/uid/ecommerce-overview
```

---

## ��� Dépannage rapide

### Problème : "Port already in use"

```bash
# Windows - Trouver et tuer le processus
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Ou changer le port dans docker-compose.yml
```

### Problème : "Cannot connect to MySQL"

```bash
# Attendre que MySQL soit prêt
sleep 30

# Vérifier les logs MySQL
docker logs mysql-catalogue

# Redémarrer MySQL
docker-compose restart mysql
```

### Problème : "Prisma Client not generated"

```bash
# Régénérer Prisma Client
npx prisma generate

# Si échec, nettoyer et réinstaller
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

### Problème : Docker containers en Exit

```bash
# Voir les erreurs
docker-compose logs

# Reconstruire les images
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**��� Pour plus de solutions** : Consultez `RECOVERY.md`

---

## 📚 Documentation complémentaire

### 🆕 Guides pour Collaborateurs

- **[GUIDE_COLLABORATEURS.md](GUIDE_COLLABORATEURS.md)** - 🚀 **Guide de démarrage rapide** (à lire en premier !)
- **[RESTAURATION_GUIDE.md](RESTAURATION_GUIDE.md)** - 📦 **Guide complet de restauration** (problèmes & solutions)
- **[backups/README.md](backups/README.md)** - 📋 Guide du dossier backups

### 📖 Documentation Technique

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentation complète de l'API REST
- **[BACKUP_README.md](BACKUP_README.md)** - Guide détaillé backup/restore
- **[RECOVERY.md](RECOVERY.md)** - Procédures de récupération d'urgence
- **[REACT_README.md](client/REACT_README.md)** - Documentation frontend React
- **[GRAFANA_SETUP.md](GRAFANA_SETUP.md)** - Configuration Grafana & Prometheus
- **[GRAFANA_BUSINESS_INTELLIGENCE.md](GRAFANA_BUSINESS_INTELLIGENCE.md)** - Guide Business Intelligence
- **[GRAFANA_VERIFICATION.md](GRAFANA_VERIFICATION.md)** - Vérification et dépannage Grafana

---

## ��� Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## ��� Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## ���‍��� Auteur

**Lyna Lasla**

- GitHub : [@lynalasla](https://github.com/lynalasla)
- Repository : [mini-api-catalogue](https://github.com/lynalasla/mini-api-catalogue)

---

**��� Bon développement avec Mini API Catalogue !**
