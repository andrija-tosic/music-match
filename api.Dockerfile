FROM node:lts-alpine

WORKDIR /app

ENV PORT=3000

EXPOSE ${PORT}

COPY package*.json ./

RUN npm install --omit=dev --loglevel verbose

COPY dist/apps/api .

CMD node ./main.js

