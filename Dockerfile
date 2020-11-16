FROM nginx:stable-alpine
EXPOSE 80
COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /app
CMD ["nginx", "-g", "daemon off;"]
WORKDIR /app