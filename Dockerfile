# Build Stage
FROM node:18.20.4 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Runtime Stage
FROM node:18.20.4-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/package*.json ./

RUN npm install

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "dist/src/main.js"]