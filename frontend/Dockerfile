FROM node:20
WORKDIR /app
# Csak a függőségeket másoljuk először a gyorsabb build érdekében
COPY package*.json ./
RUN npm install
# Utána jöhet a többi fájl
COPY . .
EXPOSE 5173
# Vite-nek kell a --host, hogy a gépedről elérd a konténert
CMD ["npm", "run", "dev", "--", "--host"]