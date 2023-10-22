# Build stage
FROM node:16-alpine as BUILD_IMAGE
WORKDIR /app/react-app
COPY package.json .
COPY package-lock.json .
COPY vite.config.js .
RUN npm install
RUN npm install -g vite
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine as PRODUCTION_IMAGE
WORKDIR /app/react-app
COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/
COPY package.json .
COPY package-lock.json .
COPY vite.config.js .
RUN npm install
RUN npm install -g vite
COPY . .
EXPOSE 3000

CMD ["npm", "run", "serve"]
