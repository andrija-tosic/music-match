FROM node:lts-alpine AS build

WORKDIR /app

COPY dist/apps/music-match .

COPY package.json package-lock.json ./

RUN npm install --omit=dev --loglevel verbose


FROM nginx

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY apps/music-match/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app .

#RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
