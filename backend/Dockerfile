FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma
RUN npm install

COPY . ./

# RUN npx prisma generate 
# RUN npx prisma migrate deploy 
RUN npm run build

EXPOSE 8000

RUN npm run build
CMD [ "npm", "start" ]

