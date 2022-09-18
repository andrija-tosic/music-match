FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY dist/apps/music-match .

#COPY package.json package-lock.json ./

#RUN npm install

#COPY apps/music-match .


FROM nginx

COPY apps/music-match/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app /usr/share/nginx/html

EXPOSE 80
