-------------------------------------------------------------------------

Dockerfile for Bin Calendar API

Builds a lightweight Node.js container that includes the pre-populated DB.

-------------------------------------------------------------------------

Use a slim Node.js base image for a small footprint

FROM node:20-slim AS builder

Set the working directory inside the container

WORKDIR /app

Copy package.json and package-lock.json (if it exists)

COPY package*.json ./

Install project dependencies

RUN npm install --omit=dev

Copy the source code and data files into the container

COPY src ./src
COPY data ./data

=== Initial DB Setup Phase ===

Run the setup script to create the collections.db file based on the JSON data.

The collections.db file is created right in the /app directory.

RUN node src/setup_db.js

Expose the port the application runs on

EXPOSE 3000

=== Command to Run the Application ===

CMD ["node", "src/server.js"]