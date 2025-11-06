# Install dependencies (including dev deps needed for the build)
FROM node:22-alpine AS deps
WORKDIR /app
# Install build tools for native modules
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci

# Build the TypeScript project
FROM node:22-alpine AS builder
WORKDIR /app
# copy installed deps from deps stage to speed up build
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json package*.json ./
COPY src ./src
RUN npm run build

# Production runtime image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Ensure the app uses port 3000 inside the container
ENV PORT=3000

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the compiled app
CMD ["node", "dist/index.js"]
