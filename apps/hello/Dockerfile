# Use the official Node.js runtime as a base image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port (change this to match your application's port)
EXPOSE 3000

# Build the application: Run the build command defined in your package.json scripts (e.g., npm run build).
RUN npm run build:backend && npm run build:frontend

# Define the command to run: Specify the command to start your application.
CMD ["npm", "start"]
