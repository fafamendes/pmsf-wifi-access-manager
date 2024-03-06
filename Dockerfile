FROM node:20-alpine

WORKDIR /app


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir -p /app/dist/temp/

EXPOSE 3000

CMD ["npm", "start"]