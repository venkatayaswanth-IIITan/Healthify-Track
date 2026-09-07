# Stage 1: Build Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Copy server dependencies and install
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/ ./server/

# Copy built frontend assets from builder
COPY --from=client-builder /app/client/dist ./client/dist

# Expose Port 80
EXPOSE 80
ENV PORT=80
ENV NODE_ENV=production

# Start Server
CMD ["node", "server/server.js"]
