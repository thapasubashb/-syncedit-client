FROM node:22-alpine

# Install build dependencies (Python, make, g++ and other tools needed for native modules like better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]