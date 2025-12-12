# Use Node.js 20 on Alpine Linux (lightweight)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (to cache dependencies)
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code (uses your "npm run build" script)
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
