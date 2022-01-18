FROM node:14-alpine as app-base
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]