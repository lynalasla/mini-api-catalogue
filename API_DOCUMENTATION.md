# API Documentation - Mini API Catalogue

## Base URL

```
http://localhost:3000/api
```

## Authentication

L'API utilise JWT (JSON Web Tokens) avec cookies httpOnly pour l'authentification.

### Headers Requis

```
Content-Type: application/json
```

Les tokens JWT sont automatiquement inclus dans les cookies après connexion.

---

## 📍 Endpoints

### Authentication

#### POST /api/auth/register

Créer un nouveau compte utilisateur.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Errors:**

- `400` - Email already exists
- `400` - Invalid input data

---

#### POST /api/auth/login

Se connecter avec un compte existant.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Errors:**

- `401` - Invalid credentials
- `404` - User not found

---

#### POST /api/auth/logout

Se déconnecter (détruit le token JWT).

**Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

---

#### GET /api/auth/me

Obtenir les informations de l'utilisateur connecté.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "created_at": "2025-12-04T10:00:00.000Z"
}
```

**Errors:**

- `401` - Not authenticated

---

### Products

#### GET /api/products

Obtenir la liste de tous les produits.

**Query Parameters:**

- `category` (optional) - Filtrer par ID de catégorie
- `search` (optional) - Rechercher dans le nom/description
- `minPrice` (optional) - Prix minimum
- `maxPrice` (optional) - Prix maximum

**Example:**

```
GET /api/products?category=1&minPrice=10&maxPrice=100
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Laptop Dell XPS 13",
    "description": "Ultrabook haute performance",
    "price": 1299.99,
    "stock": 15,
    "image_url": "https://example.com/laptop.jpg",
    "category_id": 1,
    "created_at": "2025-12-04T10:00:00.000Z",
    "updated_at": "2025-12-04T10:00:00.000Z"
  }
]
```

---

#### GET /api/products/:id

Obtenir les détails d'un produit spécifique.

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Laptop Dell XPS 13",
  "description": "Ultrabook haute performance avec processeur Intel i7",
  "price": 1299.99,
  "stock": 15,
  "image_url": "https://example.com/laptop.jpg",
  "category_id": 1,
  "created_at": "2025-12-04T10:00:00.000Z",
  "updated_at": "2025-12-04T10:00:00.000Z"
}
```

**Errors:**

- `404` - Product not found

---

#### POST /api/products

Créer un nouveau produit (Admin uniquement).

**Authentication Required:** Admin

**Request Body:**

```json
{
  "name": "Nouveau Produit",
  "description": "Description du produit",
  "price": 99.99,
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg",
  "categoryId": 1
}
```

**Response (201 Created):**

```json
{
  "id": 10,
  "name": "Nouveau Produit",
  "description": "Description du produit",
  "price": 99.99,
  "stock": 50,
  "image_url": "https://example.com/image.jpg",
  "category_id": 1,
  "created_at": "2025-12-04T10:00:00.000Z",
  "updated_at": "2025-12-04T10:00:00.000Z"
}
```

**Errors:**

- `401` - Not authenticated
- `403` - Admin access required
- `400` - Invalid input data

---

#### PUT /api/products/:id

Mettre à jour un produit (Admin uniquement).

**Authentication Required:** Admin

**Request Body:**

```json
{
  "name": "Produit Modifié",
  "price": 89.99,
  "stock": 45
}
```

**Response (200 OK):**

```json
{
  "id": 10,
  "name": "Produit Modifié",
  "description": "Description du produit",
  "price": 89.99,
  "stock": 45,
  "image_url": "https://example.com/image.jpg",
  "category_id": 1,
  "created_at": "2025-12-04T10:00:00.000Z",
  "updated_at": "2025-12-04T11:30:00.000Z"
}
```

**Errors:**

- `401` - Not authenticated
- `403` - Admin access required
- `404` - Product not found

---

#### DELETE /api/products/:id

Supprimer un produit (Admin uniquement).

**Authentication Required:** Admin

**Response (200 OK):**

```json
{
  "message": "Product deleted successfully"
}
```

**Errors:**

- `401` - Not authenticated
- `403` - Admin access required
- `404` - Product not found

---

### Categories

#### GET /api/categories

Obtenir toutes les catégories.

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets"
  },
  {
    "id": 2,
    "name": "Clothing",
    "description": "Fashion and apparel"
  }
]
```

---

#### POST /api/categories

Créer une nouvelle catégorie (Admin uniquement).

**Authentication Required:** Admin

**Request Body:**

```json
{
  "name": "Books",
  "description": "Books and magazines"
}
```

**Response (201 Created):**

```json
{
  "id": 5,
  "name": "Books",
  "description": "Books and magazines"
}
```

---

### Cart

#### GET /api/cart

Obtenir le panier de l'utilisateur connecté.

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "id": 1,
  "user_id": 1,
  "created_at": "2025-12-04T10:00:00.000Z",
  "updated_at": "2025-12-04T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "cart_id": 1,
      "product_id": 5,
      "quantity": 2,
      "product": {
        "id": 5,
        "name": "Wireless Mouse",
        "price": 29.99,
        "image_url": "https://example.com/mouse.jpg"
      }
    }
  ],
  "total": 59.98
}
```

---

#### POST /api/cart/items

Ajouter un produit au panier.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "productId": 5,
  "quantity": 2
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "cart_id": 1,
  "product_id": 5,
  "quantity": 2
}
```

**Errors:**

- `401` - Not authenticated
- `404` - Product not found
- `400` - Insufficient stock

---

#### PUT /api/cart/items/:itemId

Mettre à jour la quantité d'un article dans le panier.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "quantity": 3
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "cart_id": 1,
  "product_id": 5,
  "quantity": 3
}
```

---

#### DELETE /api/cart/items/:itemId

Supprimer un article du panier.

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "message": "Item removed from cart"
}
```

---

#### DELETE /api/cart

Vider complètement le panier.

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "message": "Cart cleared"
}
```

---

### Orders

#### GET /api/orders

Obtenir toutes les commandes (avec filtrage).

**Authentication Required:** Yes

**Query Parameters:**

- `userId` (optional, Admin only) - Filtrer par utilisateur
- `status` (optional) - Filtrer par statut (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": 159.97,
    "status": "DELIVERED",
    "shipping_address": "123 Main St, Paris",
    "created_at": "2025-12-01T10:00:00.000Z",
    "updated_at": "2025-12-03T15:00:00.000Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 5,
        "quantity": 2,
        "price": 29.99,
        "product": {
          "id": 5,
          "name": "Wireless Mouse",
          "image_url": "https://example.com/mouse.jpg"
        }
      }
    ]
  }
]
```

---

#### GET /api/orders/:id

Obtenir les détails d'une commande spécifique.

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "id": 1,
  "user_id": 1,
  "total_amount": 159.97,
  "status": "DELIVERED",
  "shipping_address": "123 Main St, Paris",
  "tracking_number": "TRACK123456",
  "notes": "Livraison rapide demandée",
  "created_at": "2025-12-01T10:00:00.000Z",
  "updated_at": "2025-12-03T15:00:00.000Z",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+33123456789"
  },
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 5,
      "quantity": 2,
      "price": 29.99,
      "product": {
        "id": 5,
        "name": "Wireless Mouse",
        "description": "Ergonomic wireless mouse",
        "image_url": "https://example.com/mouse.jpg"
      }
    }
  ]
}
```

**Errors:**

- `401` - Not authenticated
- `403` - Not authorized to view this order
- `404` - Order not found

---

#### POST /api/orders

Créer une nouvelle commande à partir du panier.

**Authentication Required:** Yes

**Request Body:**

```json
{
  "shippingAddress": "123 Main St, 75001 Paris, France",
  "phone": "+33123456789",
  "notes": "Livraison le matin si possible"
}
```

**Response (201 Created):**

```json
{
  "id": 10,
  "user_id": 1,
  "total_amount": 159.97,
  "status": "PENDING",
  "shipping_address": "123 Main St, 75001 Paris, France",
  "created_at": "2025-12-04T10:00:00.000Z",
  "items": [
    {
      "id": 20,
      "order_id": 10,
      "product_id": 5,
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

**Errors:**

- `401` - Not authenticated
- `400` - Cart is empty
- `400` - Insufficient stock

---

#### PUT /api/orders/:id/status

Mettre à jour le statut d'une commande (Admin uniquement).

**Authentication Required:** Admin

**Request Body:**

```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRACK789456"
}
```

**Response (200 OK):**

```json
{
  "id": 10,
  "status": "SHIPPED",
  "tracking_number": "TRACK789456",
  "updated_at": "2025-12-04T11:00:00.000Z"
}
```

**Valid Status Values:**

- `PENDING` - En attente de traitement
- `PROCESSING` - En cours de préparation
- `SHIPPED` - Expédié
- `DELIVERED` - Livré
- `CANCELLED` - Annulé

---

### Users

#### GET /api/users

Obtenir la liste de tous les utilisateurs (Admin uniquement).

**Authentication Required:** Admin

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER",
    "created_at": "2025-11-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "email": "admin@catalogue.com",
    "name": "Admin User",
    "role": "ADMIN",
    "created_at": "2025-10-15T08:00:00.000Z"
  }
]
```

---

#### GET /api/users/:id

Obtenir les détails d'un utilisateur (Admin ou utilisateur lui-même).

**Authentication Required:** Yes

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER",
  "created_at": "2025-11-01T10:00:00.000Z",
  "updated_at": "2025-12-04T10:00:00.000Z"
}
```

---

#### PUT /api/users/:id

Mettre à jour les informations d'un utilisateur.

**Authentication Required:** Yes (Admin ou utilisateur lui-même)

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "email": "john.smith@example.com",
  "name": "John Smith",
  "role": "USER",
  "updated_at": "2025-12-04T11:00:00.000Z"
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message description",
  "details": "Additional error details if available"
}
```

### HTTP Status Codes

| Code  | Description                            |
| ----- | -------------------------------------- |
| `200` | Success                                |
| `201` | Created                                |
| `400` | Bad Request - Invalid input            |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Insufficient permissions   |
| `404` | Not Found - Resource doesn't exist     |
| `500` | Internal Server Error                  |

---

## Data Models

### User

```typescript
{
  id: number
  email: string
  name: string
  role: "USER" | "ADMIN"
  password: string (hashed, never returned)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Product

```typescript
{
  id: number;
  name: string;
  description: string;
  price: number(decimal);
  stock: number;
  imageUrl: string;
  categoryId: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Category

```typescript
{
  id: number;
  name: string;
  description: string;
}
```

### Order

```typescript
{
  id: number;
  userId: number;
  totalAmount: number(decimal);
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### OrderItem

```typescript
{
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number (decimal at time of order)
}
```

### Cart

```typescript
{
  id: number;
  userId: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### CartItem

```typescript
{
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}
```

---

## Rate Limiting

Aucune limite de taux n'est actuellement implémentée, mais il est recommandé de ne pas dépasser 100 requêtes par minute.

---

## Testing the API

### Using cURL

**Register a new user:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"pass123"}'
```

**Get products (with authentication):**

```bash
curl -X GET http://localhost:3000/api/products \
  -b cookies.txt
```

### Using Postman

1. Import the collection (if available)
2. Set the base URL: `http://localhost:3000/api`
3. Use the `/auth/login` endpoint to get authentication
4. Cookies are automatically managed by Postman

---

## Notes

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 7 jours
- Les cookies sont httpOnly et secure en production
- Les prix sont stockés en décimales avec 2 chiffres après la virgule
- Les timestamps sont en format ISO 8601 (UTC)

---

## Admin Credentials (Development)

```
Email: admin@catalogue.com
Password: admin1234
```

⚠️ **Ne jamais utiliser ces identifiants en production!**
