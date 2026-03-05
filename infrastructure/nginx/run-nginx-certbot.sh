#!/usr/bin/env bash
# Run jonasal/nginx-certbot on COS (or any Docker host). One container: nginx + certbot + auto renewal.
# Requires: CERTBOT_EMAIL (e.g. export CERTBOT_EMAIL=you@example.com)
# DNS for fresh-stacks.org and www must point at this host before first run.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CERTBOT_EMAIL="${CERTBOT_EMAIL:?Set CERTBOT_EMAIL (e.g. export CERTBOT_EMAIL=you@example.com)}"
LETSENCRYPT_DIR="${LETSENCRYPT_DIR:-$SCRIPT_DIR/letsencrypt}"
CONTAINER_NAME="${CONTAINER_NAME:-nginx-certbot}"
IMAGE="${IMAGE:-jonasal/nginx-certbot:6}"

mkdir -p "$LETSENCRYPT_DIR"

docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -e CERTBOT_EMAIL="$CERTBOT_EMAIL" \
  -e RENEWAL_INTERVAL=12d \
  -v "$LETSENCRYPT_DIR:/etc/letsencrypt" \
  -v "$SCRIPT_DIR/user_conf.d:/etc/nginx/user_conf.d:ro" \
  --add-host=host.docker.internal:host-gateway \
  "$IMAGE"

echo "Started $CONTAINER_NAME. First run may take a few minutes (DH params)."
echo "HTTPS will proxy to host:3000. Cert renewal is automatic (every 12 days)."
