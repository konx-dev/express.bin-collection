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

## WIKI

For full API documentation and available routes check the[wiki](https://github.com/konx-dev/express.bin-collection/wiki).

## Data source creation

* Google sheets or similar, 2 columns: date (YYYY-MM-DD), collection (array, i.e black,silver)
* Export as csv
* Convert from csv -> json
* (placeholder) Validate via dedicated npm command

## Roadmap

* Caching via node-cache
* Unit testing
* Add TypeScript support
* Improved logging with Winston or Pino
* Optional sheet validation step before running setup_db.js