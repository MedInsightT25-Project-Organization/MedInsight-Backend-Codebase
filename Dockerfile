# Use official Node.js LTS image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of your app's source code
COPY . .

# Expose the app port
EXPOSE 3000

# Run the app using node
CMD ["node", "app.js"]
