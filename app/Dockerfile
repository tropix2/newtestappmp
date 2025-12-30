FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# App listens on 3000
EXPOSE 3000

# Start app
CMD ["npm", "start"]
