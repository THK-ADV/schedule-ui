FROM nginx:stable-alpine

COPY dist/schedule-ui /usr/share/nginx/html

MAINTAINER Alex
