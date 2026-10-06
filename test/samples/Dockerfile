# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
ARG VERSION=0.5.0
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force
COPY . .
EXPOSE 8080
HEALTHCHECK CMD wget -q -O - http://localhost:8080/health || exit 1
CMD ["node", "server.js", "--port", "8080"]
