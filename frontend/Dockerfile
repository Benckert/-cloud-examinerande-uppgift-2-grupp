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

# ⚠️ CRITICAL: Accept build argument BEFORE npm run build
# This makes NEXT_PUBLIC_* variables available during the build process
# Next.js will bake these values into the static JavaScript bundle
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Debug: Print environment variable (visible in build logs)
# Remove this line after confirming it works
RUN echo "🔍 Building with NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL"

# Build Next.js application
# With output: "standalone" in next.config.ts, this creates:
# - .next/standalone/ (optimized server with only required deps)
# - .next/static/ (static assets)
RUN npm run build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Create non-root user for security best practices
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy public assets (images, fonts, etc.)
COPY --from=builder /app/public ./public

# Copy Next.js standalone output (self-contained server)
# This includes only the necessary dependencies (~50-100 MB instead of ~300-500 MB)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets (JS, CSS bundles)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user for security
USER nextjs

# Expose port
EXPOSE 3001

# Health check - ensures container is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/ || exit 1

# Start the standalone Next.js server
# Note: Not using "npm start" because standalone mode provides optimized server.js
CMD ["node", "server.js"]