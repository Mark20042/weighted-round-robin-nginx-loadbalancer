FROM nginx:alpine

# Copy the template configuration
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Use envsubst to replace variables in the template with environment values
# We explicitly list the variables to replace to avoid replacing system vars like $host
CMD ["/bin/sh", "-c", "sleep 30 && envsubst '${API_1_ADDR} ${API_2_ADDR} ${API_3_ADDR} ${API_4_ADDR} ${API_5_ADDR} ${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
