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

# Set production defaults
# These can be overridden by Render environment variables at runtime
ENV NODE_ENV=production
ENV PORT=3000

# Note: Backend env vars (JWT_SECRET, MONGODB_URI, etc.) 
# are used at RUNTIME, not build time, so ARG is not needed

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Healthcheck to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the compiled app
CMD ["node", "dist/index.js"]
