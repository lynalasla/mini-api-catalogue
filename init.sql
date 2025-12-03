-- Script d'initialisation de la base de données MySQL
-- Crée les tables et insère des données de test

-- Création de la table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des produits
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Insertion de données de test pour les catégories
INSERT INTO categories (name) VALUES 
  ('Électronique'),
  ('Vêtements'),
  ('Alimentation');

-- Insertion de données de test pour les produits
INSERT INTO products (name, price, category_id) VALUES 
  ('Ordinateur portable', 999.99, 1),
  ('Smartphone', 599.99, 1),
  ('T-shirt', 19.99, 2),
  ('Jean', 49.99, 2),
  ('Pain', 2.50, 3),
  ('Fromage', 8.99, 3);
