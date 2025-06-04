FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
COPY prisma ./prisma

# RUN npx prisma generate 
# RUN npx prisma migrate deploy 
RUN npm run build

RUN npm run build

EXPOSE 3000

CMD [ "npm","start" ]

