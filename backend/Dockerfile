FROM node:18-alpine

WORKDIR /app

# Copy package.json from the backend folder (relative to repo root)
COPY backend/package.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY backend/ ./

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start the server
CMD ["node", "index.js"]