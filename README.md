# Bin Collection Calendar API

This is a simple, self-hosted Node.js Express application that uses an SQLite flat-file database to track the next scheduled bin collection based on a static JSON file.

## Getting Started (Without Docker)

Prerequisites: Node.js (v22+) and npm installed.

Install Dependencies:

`npm install`

Initialize Database: This reads provided json file in data and creates collections.db.

`node src/setup_db.js`

Start Server:

`node src/server.js`

The API will be available at http://localhost:3000.

## Getting Started (With Docker, Recommended)

Build the Image: Run this command from the root directory:

`docker build -t bin-collection-app .`

Run the Container:

`docker run -d --name bin-collection -p 3000:3000 bin-collection-app`

## API Endpoints

`/api/next`

Finds the next scheduled collection starting from today.

Example Response: `{ "status": "success", "collection": { "date": "2025-10-22", "collection": "black" } }`

## Roadmap

* Caching via node-cache
* Unit testing
* Add TypeScript support
* Security, rate limiting
* Improved logging with Winston or Pino