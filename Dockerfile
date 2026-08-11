# Build stage
FROM node:20-alpine AS builder

# Labels
LABEL maintainer="Promo Brindes <dev@promobrindes.com.br>"
LABEL version="1.0.0"
LABEL description="Match ATS - Applicant Tracking System"

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm ci --only=production=false

# Security audit
RUN npm audit --audit-level=high || true

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Labels
LABEL maintainer="Promo Brindes <dev@promobrindes.com.br>"
LABEL version="1.0.0"
LABEL description="Match ATS - Applicant Tracking System"

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Set ownership
RUN chown -R appuser:appuser /usr/share/nginx/html && \
    chown -R appuser:appuser /var/cache/nginx && \
    chown -R appuser:appuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
