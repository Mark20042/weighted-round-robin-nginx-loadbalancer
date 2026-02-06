#!/bin/sh

# Generate the Nginx configuration from template
echo "Generating Nginx configuration..."
echo "API_1_ADDR: $API_1_ADDR"
echo "API_2_ADDR: $API_2_ADDR"
echo "API_3_ADDR: $API_3_ADDR"
echo "API_4_ADDR: $API_4_ADDR"
echo "API_5_ADDR: $API_5_ADDR"
echo "PORT: $PORT"

envsubst '${API_1_ADDR} ${API_2_ADDR} ${API_3_ADDR} ${API_4_ADDR} ${API_5_ADDR} ${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "--- Generated nginx.conf ---"
cat /etc/nginx/nginx.conf
echo "-----------------------------"

# Test configuration
echo "Testing Nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi

echo "Configuration OK! Starting Nginx..."
exec nginx -g 'daemon off;'
