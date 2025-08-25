# ====== Build ======
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm run build

# ====== Runtime ======
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# TTL padrão de 60s; ajuste via compose/env
ENV IDEMPOTENCY_TTL_MS=60000

# Copia apenas o necessário para executar
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=2s --retries=6 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
