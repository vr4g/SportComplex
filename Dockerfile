FROM node:latest

# Create a working directory
WORKDIR /assessment_margins/src/

# Install dependencies
COPY package*.json ./
RUN npm install prettier -g
RUN npm install

# Copy application code
COPY . /assessment_margins/src/

# Compile TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8000

# Run the application
CMD ["npm", "run", "dev"]