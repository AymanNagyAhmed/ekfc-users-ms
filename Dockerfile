# Backend Dockerfile for Development
FROM node:22.11.0-alpine

# Add labels for image identification
LABEL name="ekfc-users-ms"
LABEL version="dev"
LABEL description="users Microservice development image"
LABEL maintainer="AymanNagy.Ahmed@gmail.com"

# Install npm
RUN npm install -g npm@10.9.0
RUN npm install yarn -g


# Set working directory
WORKDIR /var/www/users-ms

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    wget \
    build-base \
    g++ \
    libstdc++ \
    python3 \
    openssl

# Create node user and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install dependencies first
COPY package*.json ./
RUN yarn ci

# Copy the rest of the code
COPY . .

# Set proper permissions
RUN chown -R appuser:appgroup /var/www/users-ms

# Switch to non-root user
USER appuser

# Expose development port
EXPOSE 4003

# Set environment to development
ENV NODE_ENV=development

# Development command with hot reload
CMD ["yarn", "start:dev"]