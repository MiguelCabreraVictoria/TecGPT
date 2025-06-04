FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 5000

CMD ["npx", "serve", "-s", "build", "-l", "5001"]