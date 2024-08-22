FROM node:slim

WORKDIR /app

COPY package*.json ./
COPY server.js ./

RUN npm install

EXPOSE 6000

CMD ["node", "server.js"]