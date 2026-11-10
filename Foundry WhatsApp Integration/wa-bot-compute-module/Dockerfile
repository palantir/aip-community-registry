# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

# Use the official Node.js image as a parent image, ensure that the image is for the amd64 platform.
FROM --platform=amd64 node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
WORKDIR /usr/src/app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Run the application as a non-root user.
USER 5000

# Specify the command to run the application.
CMD ["node", "index.js"]