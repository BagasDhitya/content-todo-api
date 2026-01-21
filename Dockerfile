FROM node:20-alpine AS base
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl ca-certificates

# Dependencies stage
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm install

# Build stage
FROM deps AS build
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma Client
RUN npx prisma generate

# Build Typescript
RUN npm run build

# Expose port (sesuaikan dengan app kamu)
EXPOSE 3000
CMD ["node", "dist/app.js"]