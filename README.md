# 🛍️ Mini API Catalogue - E-Commerce Full-Stack Application

[![CI/CD Pipeline](https://github.com/lynalasla/mini-api-catalogue/actions/workflows/ci.yml/badge.svg)](https://github.com/lynalasla/mini-api-catalogue/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/node-20.x-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Plateforme e-commerce moderne** avec API REST, interface React interactive, base de données MySQL, système de backup Excel, et module A/B Testing intégré.

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

### 🏗️ Architecture technique

```
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Port 80)                          │
│              Reverse Proxy & Load Balancer                  │
└────────────┬─────────────────────────────────┬──────────────┘
             │                                 │
    ┌────────▼────────┐              ┌────────▼────────┐
    │  React Frontend │              │   API Backend   │
    │   (Port 5173)   │              │   (Port 3000)   │
    │  Vite + React   │              │  Express + JWT  │
    └────────┬────────┘              └────────┬────────┘
             │                                 │
             │         ┌───────────────────────┼─────────┐
             │         │                       │         │
    ┌────────▼─────────▼──────┐    ┌──────────▼────┐   │
    │   MySQL Database        │    │ Prisma ORM    │   │
    │     (Port 3306)         │    │   Client      │   │
    │  + phpMyAdmin (8080)    │    └───────────────┘   │
    └─────────────────────────┘                        │
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
- **Dashboard analytique**
  - Statistiques des ventes en temps réel
  - Graphiques de performance
  - Top produits et catégories
  - Indicateurs KPI (CA, commandes, clients)

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
- **Conteneurisation** : Docker 24+, Docker Compose
- **Reverse Proxy** : Nginx 1.27-alpine
- **CI/CD** : GitHub Actions (6 jobs)
  - Tests backend (Jest)
  - Tests frontend (Vitest)
  - Build Docker (multi-stage)
  - Security scan (npm audit, CodeQL)
  - Code quality (ESLint, flake8, pylint)
  - A/B Testing tests (pytest)
- **Monitoring** : Docker healthchecks
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

```
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
├── 📁 DevOps
│   ├── docker-compose.yml    # Orchestration 5 services
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
│   └── REACT_README.md       # Doc frontend
│
└── 📁 Configuration
    ├── package.json          # Dépendances Node.js
    ├── .env                  # Variables d'environnement
    ├── .gitignore
    └── sonar-project.properties  # SonarQube
