
FROM node:20-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start:prod"]
EXPOSE 3000
