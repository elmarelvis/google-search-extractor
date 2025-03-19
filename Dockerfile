# Použijeme oficiální Node.js image jako základ
FROM node:16-alpine

# Nastavení pracovního adresáře v kontejneru
WORKDIR /app

# Kopírování souborů package.json a package-lock.json
# (pro využití cache při instalaci závislostí)
COPY package*.json ./

# Instalace závislostí
RUN npm install

# Kopírování všech ostatních souborů aplikace
COPY . .

# Otevření portu 3000 pro přístup k aplikaci
EXPOSE 3000

# Příkaz pro spuštění aplikace
CMD ["node", "server.js"]