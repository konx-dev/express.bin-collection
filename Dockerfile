# --- Stage 1: Builder ---
# This stage installs dependencies, copies source code, and builds the database.
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies, leverages docker layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application source code and data
COPY src ./src
COPY data ./data

# Run the setup script to generate the collections.db file
RUN node src/setup_db.js

# --- Stage 2: Release ---
# This is the final, lightweight production image. It copies only the necessary artifacts from the builder stage.
FROM node:22-alpine

WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy installed dependencies, source code and database
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/collections.db ./

# Set correct ownership for the app files
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port the application runs on
EXPOSE 3000

# The command to run the application
CMD ["node", "src/server.js"]
