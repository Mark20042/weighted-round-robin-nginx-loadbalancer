FROM nginx:alpine

# Copy the template configuration
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install gettext for envsubst and bind-tools for DNS check
RUN apk add --no-cache gettext bind-tools

# Wait for DNS to be ready before starting Nginx
# API_1_ADDR contains host:port, we strip the port to check DNS
# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Start using the script
CMD ["/start.sh"]
