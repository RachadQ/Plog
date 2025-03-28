# Step 1: Use official Node.js image as the base image for the build stage
FROM node:18-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for caching purposes
COPY package.json package-lock.json ./

# Step 4: Install dependencies using npm ci (faster and more reliable than npm install)
RUN npm ci --only=production

# Step 5: Copy the rest of the app code (only necessary files for production)
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use Nginx to serve the built React app
FROM nginx:alpine

# Step 8: Copy the built React app into the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Minimal Nginx config
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

# Step 9: Expose port 80 (default HTTP port for Nginx)
EXPOSE 80
