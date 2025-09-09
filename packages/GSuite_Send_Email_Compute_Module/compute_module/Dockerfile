# syntax=docker/dockerfile:1

FROM --platform=amd64 node:20

# Set production environment variables
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies
COPY ./package.json /app
RUN npm install

# Create non-root user
RUN adduser --uid 5001 user
USER 5001

# Copy application code
COPY ./src/index.js /app

ENTRYPOINT ["node", "index.js"]