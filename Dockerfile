# Build stage for Client
FROM node:18-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./

# แก้ไข environment variables สำหรับ production
ENV REACT_APP_API_URL=/api 

RUN npm run build

# Build stage for Server
FROM node:18-alpine as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built client files and server files
COPY --from=client-builder /app/client/build ./server/public
COPY --from=server-builder /app/server ./server
WORKDIR /app/server
RUN npm install --production

# Environment variables
ENV PORT=10000
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb+srv://s6604062630536:XM2XyaFi6qgTVmNw@numerdb.qkmjg.mongodb.net/?retryWrites=true&w=majority&appName=numerdb

# Expose port
EXPOSE 10000

# Start the server
CMD ["node", "index.js"]