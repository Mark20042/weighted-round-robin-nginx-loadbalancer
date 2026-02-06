#!/bin/sh

# 1. Create a temporary config that satisfies Render's port check immediately
cat <<EOF > /etc/nginx/nginx.conf
events {}
http {
    server {
        listen ${PORT};
        location / {
            add_header 'Access-Control-Allow-Origin' '*';
            return 200 'Initializing Load Balancer... please wait.';
            add_header Content-Type text/plain;
        }
        location /health {
            return 200 'healthy';
        }
    }
}
EOF

# 2. Start Nginx in the background
nginx -g 'daemon on;'
PID=$!

# 3. Wait for DNS resolution of the first API node
# We strip the "https://" or port if accidental, but currently API_1_ADDR is just the host
HOST_TO_CHECK=$API_1_ADDR
echo "Waiting for upstream $HOST_TO_CHECK to be resolvable..."

until nslookup $HOST_TO_CHECK; do
    echo "...waiting for DNS propagation ($HOST_TO_CHECK)"
    sleep 5
done

echo "DNS Ready! Generating real configuration..."

# 4. Generate the real config using envsubst
envsubst '${API_1_ADDR} ${API_2_ADDR} ${API_3_ADDR} ${API_4_ADDR} ${API_5_ADDR} ${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf.real

# 5. Validation Loop: Wait until Nginx accepts the config (meaning all upstreams resolve)
echo "Validating Nginx URL resolution..."
until nginx -t -c /etc/nginx/nginx.conf.real; do
    echo "Nginx config validation failed (likely DNS not ready). Retrying in 5s..."
    echo "--- Validation Error Output ---"
    nginx -t -c /etc/nginx/nginx.conf.real
    echo "-------------------------------"
    sleep 5
    # Regenerate config just in case env vars changed or transient issues
    envsubst '${API_1_ADDR} ${API_2_ADDR} ${API_3_ADDR} ${API_4_ADDR} ${API_5_ADDR} ${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf.real
done

echo "Config valid! Applying new configuration..."
mv /etc/nginx/nginx.conf.real /etc/nginx/nginx.conf
nginx -s reload

# 6. Keep the container running (tail logs)
# Nginx is running as a daemon, so we tail the access log to keep the process foreground
tail -f /var/log/nginx/access.log
