FROM nginx:alpine

# Copy the template configuration
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install gettext for envsubst and bind-tools for DNS check
RUN apk add --no-cache gettext bind-tools

# Wait for DNS to be ready before starting Nginx
# API_1_ADDR contains host:port, we strip the port to check DNS
CMD ["/bin/sh", "-c", "host=$(echo $API_1_ADDR | cut -d: -f1); echo \"Waiting for $host to be resolvable...\"; until nslookup $host; do echo \"...waiting for $host\"; sleep 5; done; echo \"DNS Ready!\"; envsubst '${API_1_ADDR} ${API_2_ADDR} ${API_3_ADDR} ${API_4_ADDR} ${API_5_ADDR} ${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
