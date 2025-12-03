# Utilisation de l'image Node.js officielle
FROM node:18-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie de tous les fichiers de l'application
COPY . .

# Exposition du port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
