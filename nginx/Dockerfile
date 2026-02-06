FROM nginx:alpine

# Copy the template configuration
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Start using the script
CMD ["/start.sh"]
