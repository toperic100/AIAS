
# backend/api-gateway/Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

# 开发环境
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# 构建阶段
FROM base AS builder
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产环境
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3001

USER node

CMD ["node", "dist/main.js"]