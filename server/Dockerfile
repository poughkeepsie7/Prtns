FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json .
RUN npm install

COPY tsconfig.json .
COPY src ./src
COPY migrations ./migrations
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
COPY package*.json .
RUN npm install --omit=dev

USER app
EXPOSE 3000
CMD ["node", "dist/index.js"]