FROM nginx:alpine

RUN apk add --no-cache openssl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificate (for development)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/server.key \
    -out /etc/nginx/ssl/server.crt \
    -subj "/C=FR/ST=Paris/L=Paris/O=CVBuilder/CN=localhost"

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]