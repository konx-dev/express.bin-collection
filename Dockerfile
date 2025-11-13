FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the application source code and data
COPY tsconfig.json ./
COPY src ./src
COPY data ./data

RUN npm run build
RUN npm run setup

FROM node:22-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/collections.db ./
COPY --from=builder /app/package.json ./

RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000

CMD ["npm", "start"]