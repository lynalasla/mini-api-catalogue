FROM node:20-alpine

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Démarrer Vite en mode dev
CMD ["npm", "run", "dev", "--", "--host"]
