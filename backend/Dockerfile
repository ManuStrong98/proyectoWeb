FROM node:20.18

WORKDIR /app

# Copia package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala dependencias (incluye dev para compilar TS)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto TS a JS en dist/
RUN npm run build

# Expone el puerto del servidor
EXPOSE 4000

# Ejecuta la app compilada
CMD ["node", "dist/app.js"]

