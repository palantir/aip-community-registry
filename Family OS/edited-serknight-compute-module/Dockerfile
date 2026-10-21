# syntax=docker/dockerfile:1

# Use an official lightweight Node.js image
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production
WORKDIR /app

# Copy only package manifest (no lockfile) and install prod deps
COPY package.json ./
RUN npm install --omit=dev

# Copy source files
COPY . .

# Create a non-root user and switch
RUN addgroup -S app && adduser -S -G app user
USER 5000

# Launch the compute module
ENTRYPOINT ["node", "src/index.js"]
