.# BeliBeli.com - Application React + Express
Application e-commerce complète avec React (frontend) et Express (backend API).

## 🚀 Architecture

- **Frontend**: React 18 + Vite
- **Backend**: Express.js + Prisma ORM
- **Database**: MySQL 8.0
- **Authentication**: JWT avec cookies httpOnly

## 📁 Structure du Projet

```
mini-api-catalogue/
├── client/                  # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── context/        # Context API (Auth, Cart)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── routes/                  # Routes Express API
├── middleware/              # Middleware d'authentification
├── prisma/                  # Schema et migrations Prisma
├── server.js               # Serveur Express
└── docker-compose.yml      # Configuration Docker
```

## 🎯 Fonctionnalités

### Frontend React

- ✅ Interface utilisateur moderne (style BeliBeli.com)
- ✅ Hero Banner avec offres spéciales
- ✅ Catégories rapides
- ✅ Section Flash Sale avec compte à rebours animé
- ✅ Grille de produits avec images
- ✅ Panier d'achat (slide panel)
- ✅ Authentication (Login/Signup avec modales)
- ✅ Gestion des commandes
- ✅ Responsive design

### Backend API

- ✅ API RESTful avec Express
- ✅ Authentication JWT stateless
- ✅ Gestion des utilisateurs (USER/ADMIN)
- ✅ Gestion des produits
- ✅ Gestion du panier
- ✅ Gestion des commandes avec transactions
- ✅ CORS configuré pour React

## 🛠️ Installation & Démarrage

### 1. Démarrer les services Docker (Backend + MySQL)

```bash
docker-compose up -d
```

Cela démarre :

- MySQL sur le port 3306
- phpMyAdmin sur le port 8080
- API Express sur le port 3000

### 2. Démarrer le client React

```bash
cd client
npm install  # Première fois seulement
npm run dev
```

Le client React sera accessible sur **http://localhost:5173**

## 🌐 URLs

- **Application React**: http://localhost:5173
- **API Express**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **Ancien site HTML**: http://localhost:3000/shop.html

## 🔑 Comptes de Test

### Utilisateur

- Email: `user@catalogue.com`
- Password: `user123`

### Administrateur

- Email: `admin@catalogue.com`
- Password: `admin123`

## 📡 API Endpoints

Tous les endpoints sont préfixés par `/api`

### Authentication

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter
- `GET /api/auth/me` - Obtenir l'utilisateur courant

### Products

- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (Admin)
- `PUT /api/products/:id` - Modifier un produit (Admin)
- `DELETE /api/products/:id` - Supprimer un produit (Admin)

### Cart

- `GET /api/cart` - Voir son panier
- `POST /api/cart/items` - Ajouter au panier
- `PUT /api/cart/items/:id` - Modifier quantité
- `DELETE /api/cart/items/:id` - Retirer du panier

### Orders

- `GET /api/orders` - Voir ses commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Passer une commande
- `GET /api/orders/admin/all` - Toutes les commandes (Admin)
- `PATCH /api/orders/:id/status` - Changer statut (Admin)

## 🎨 Composants React

### Context Providers

- **AuthContext**: Gestion de l'authentification
- **CartContext**: Gestion du panier

### Composants Principaux

- **MainLayout**: Layout principal
- **TopBar**: Barre supérieure avec liens
- **Header**: En-tête avec logo, recherche, panier
- **HeroBanner**: Banner avec offre spéciale
- **QuickCategories**: Catégories rapides
- **FlashSale**: Section Flash Sale avec timer
- **ProductsSection**: Grille de produits
- **CartPanel**: Panneau panier (slide)
- **AuthModal**: Modal Login/Signup
- **OrdersSection**: Page des commandes
- **Notification**: Notifications toast

## 🔧 Configuration

### Vite Proxy

Le fichier `vite.config.js` configure un proxy pour rediriger `/api` vers `http://localhost:3000`

### CORS

Le serveur Express autorise les requêtes depuis `http://localhost:5173` avec credentials

## 📦 Base de Données

La base de données contient :

- **20 produits** avec images (Unsplash)
- **2 catégories**: Electronics, Fashion
- **2 utilisateurs de test**: admin et user

## 🚧 Développement

### Ajouter un composant

```bash
cd client/src/components
# Créer YourComponent.jsx et YourComponent.css
```

### Modifier les styles

Chaque composant a son propre fichier CSS pour une meilleure organisation.

### Hot Reload

Vite offre le Hot Module Replacement (HMR) - les modifications sont visibles instantanément.

## 📝 Notes

- Les cookies JWT sont httpOnly et sécurisés
- Les images des produits sont hébergées sur Unsplash
- Le panier est synchronisé avec le backend
- Les commandes déduisent automatiquement le stock

## 🐳 Docker

Pour reconstruire l'image :

```bash
docker-compose build
docker-compose up -d
```

Pour voir les logs :

```bash
docker-compose logs -f mini-api-catalogue
```

---

Développé avec ❤️ en React + Express
