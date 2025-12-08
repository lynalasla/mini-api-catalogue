# Utilisation de l'image Node.js officielle
FROM node:20-alpine

# Installation d'OpenSSL pour Prisma
RUN apk add --no-cache openssl

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances
RUN npm install

# Copie de tous les fichiers de l'application
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposition du port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
