# ============================================
# Stage 1: Install Dependencies
# ============================================
FROM node:22-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# ============================================
# Stage 2: Build Application
# ============================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Accept build arguments and set as environment variables
# These are available during the build process
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build Next.js application
# The NEXT_PUBLIC_* env var is now baked into the static bundle
RUN npm run build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built output from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/ || exit 1

# Start Next.js in production mode
CMD ["npm", "start"]