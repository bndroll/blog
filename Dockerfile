FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
RUN npm run build
CMD ["node", "dist/src/main.js"]