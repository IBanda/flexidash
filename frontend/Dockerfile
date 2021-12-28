#syntax=docker/dockerfile:1

FROM node:16-alpine
WORKDIR /frontend
COPY package-lock.json package.json ./
RUN npm install
COPY . .
CMD ["npm","run","start"]