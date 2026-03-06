# Nginx reverse proxy with jonasal/nginx-certbot

Docker-based nginx and certbot container with **automatic certificate renewal** (every 12 days). No cron, no second container, no Docker socket.

See [jonasal/docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot).

## Files

| File | Purpose |
|------|--------|
| `user_conf.d/fresh-stacks.conf` | Nginx config: HTTP→HTTPS, ACME challenge, proxy to `host.docker.internal:3000` |
| `run-nginx-certbot.sh` | Starts the container with the right volumes and env |

## One-time setup on the VM

1. Ensure **ports 80 and 443** are open in GCP firewall. **DNS** for `fresh-stacks.org` (and `www`) must point at this VM's IP so Let's Encrypt can issue the cert on first run.
2. Get this repo onto the VM (clone or copy the `infrastructure/nginx/` directory).
3. Ensure the **app** is running on the host on port 3000 (e.g. your existing container with `-p 3000:3000`).
4. From `infrastructure/nginx/` run:
   ```bash
   export CERTBOT_EMAIL=you@example.com
   ./run-nginx-certbot.sh
   ```
   The first start can take a few minutes (Diffie-Hellman parameters). After that, the site is served over HTTPS and **certificate renewal is automatic** (every 12 days); no further action needed.

## Optional env vars

- `LETSENCRYPT_DIR` — where to store certs (default: `./letsencrypt`).
- `CONTAINER_NAME` — container name (default: `nginx-certbot`).
- `IMAGE` — image to use (default: `jonasal/nginx-certbot:6`).

## Reload config without restart

If you change `user_conf.d/fresh-stacks.conf`, reload nginx inside the container:

```bash
docker kill --signal=HUP nginx-certbot
```

## Adding more apps later

Edit `user_conf.d/fresh-stacks.conf`: add a `location` or `server` block proxying to `http://host.docker.internal:3001` (or the app's port). Then send SIGHUP to the container (or restart it).