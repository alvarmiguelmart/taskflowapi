FROM node:22

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]

