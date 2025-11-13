# Bin Collection Calendar API

This is a simple, self-hosted Node.js Express application that uses an SQLite flat-file database to track the next scheduled bin collection based on a static JSON file.

## Getting Started (Without Docker)

Prerequisites: Node.js (v22+) and npm installed.

Install Dependencies:
`npm install`

It reads the provided JSON file in the data/ folder and creates or updates collections.db.
`npm run setup`

We must first compile the TypeScript source code into production JavaScript.
`npm run build`

`npm start`

For local development with file watching and automatic restarts, use:
`npm run start:dev`

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

* Unit testing
* Improved logging with Winston or Pino
* Optional sheet validation step before running setup_db.js