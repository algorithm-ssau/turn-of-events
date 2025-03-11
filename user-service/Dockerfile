# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source code
COPY . .

# Expose port
EXPOSE 8000

# Start application
CMD ["npm", "start"]