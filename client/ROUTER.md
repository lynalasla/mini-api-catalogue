# React Router Implementation

## Routes disponibles

### Routes publiques

- **`/`** - Page d'accueil avec tous les produits
- **`/404`** - Page d'erreur 404

### Routes protégées (nécessitent une connexion)

- **`/orders`** - Mes commandes

## Structure

```
src/
├── layouts/
│   └── Layout.jsx          # Layout principal avec Header, TopBar, Modals
├── pages/
│   ├── Home.jsx            # Page d'accueil
│   ├── Orders.jsx          # Page des commandes
│   └── NotFound.jsx        # Page 404
├── components/
│   ├── Header.jsx          # Header avec logo (Link vers /)
│   ├── TopBar.jsx          # TopBar avec lien "My Orders"
│   └── ...
└── App.jsx                 # Configuration des routes
```

## Fonctionnalités

### Navigation

- **Logo "BeliBeli"** → Retour à l'accueil (/)
- **"My Orders"** (TopBar) → Page des commandes (/orders)
- Routes protégées redirigent vers "/" si non connecté

### Protection des routes

- `<ProtectedRoute>` vérifie l'authentification
- Redirection automatique si non connecté

### Context partagé

- `useOutletContext()` dans les pages pour accéder à:
  - `showNotification(message)`
  - `onLoginRequired()`

## Utilisation

```jsx
// Navigation programmatique
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/orders");

// Liens
import { Link } from "react-router-dom";

<Link to="/orders">My Orders</Link>;
```

## URLs

- Dev: http://localhost:5173
- Production: http://localhost
