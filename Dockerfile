FROM nginx:alpine-slim

COPY ["./html/", "/usr/share/nginx/html/"]
