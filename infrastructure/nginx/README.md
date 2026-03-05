# Nginx reverse proxy (VM direct TLS)

Setup for the [VM direct traffic + TLS migration](../../docs/vm-direct-tls-migration.md). Two options:

- **Container-Optimized OS (COS) or any Docker host** — use the **jonasal/nginx-certbot** container (recommended): one image, automatic cert renewal, no host packages.
- **Debian/Ubuntu VM** — use **host nginx + certbot** (see bottom of this file).

---

## COS / containerized: jonasal/nginx-certbot (recommended)

Single container that runs nginx and certbot and **renews certificates automatically** (default every 8 days; we use 12 days). No cron, no second container, no Docker socket. See [docker-nginx-certbot](https://github.com/JonasAlfredsson/docker-nginx-certbot).

### Files

| File | Purpose |
|------|--------|
| `user_conf.d/fresh-stacks.conf` | Nginx config: HTTP→HTTPS, ACME challenge, proxy to `host.docker.internal:3000` |
| `run-nginx-certbot.sh` | Starts the container with the right volumes and env |

### One-time setup on the VM

1. Ensure **ports 80 and 443** are open in GCP firewall. **DNS** for `fresh-stacks.org` (and `www`) must point at this VM’s IP so Let’s Encrypt can issue the cert on first run.
2. Get this repo onto the VM (clone or copy the `infrastructure/nginx/` directory).
3. Ensure the **hello app** is running on the host on port 3000 (e.g. your existing container with `-p 3000:3000`).
4. From `infrastructure/nginx/` run:
   ```bash
   export CERTBOT_EMAIL=you@example.com
   ./run-nginx-certbot.sh
   ```
   The first start can take a few minutes (Diffie-Hellman parameters). After that, the site is served over HTTPS and **certificate renewal is automatic** (every 12 days); no further action needed.

### Optional env vars

- `LETSENCRYPT_DIR` — where to store certs (default: `./letsencrypt`).
- `CONTAINER_NAME` — container name (default: `nginx-certbot`).
- `IMAGE` — image to use (default: `jonasal/nginx-certbot:6`).

### Reload config without restart

If you change `user_conf.d/fresh-stacks.conf`, reload nginx inside the container:

```bash
docker kill --signal=HUP nginx-certbot
```

### Adding more apps later

Edit `user_conf.d/fresh-stacks.conf`: add a `location` or `server` block proxying to `http://host.docker.internal:3001` (or the app’s port). Then send SIGHUP to the container (or restart it).

---

## Host nginx (Debian/Ubuntu only)

Use this when the VM has **apt** (Debian/Ubuntu). Not applicable on **Container-Optimized OS**.

### Files

- **`fresh-stacks.conf`** — Nginx config for host (proxies to `127.0.0.1:3000`).

### One-time setup

1. Ports 80/443 open; DNS pointing at VM.
2. Install and configure:
   ```bash
   sudo apt-get update
   sudo apt-get install -y nginx certbot python3-certbot-nginx
   sudo cp fresh-stacks.conf /etc/nginx/sites-available/fresh-stacks.conf
   sudo ln -s /etc/nginx/sites-available/fresh-stacks.conf /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo mkdir -p /var/www/certbot
   sudo certbot --nginx -d fresh-stacks.org -d www.fresh-stacks.org
   sudo nginx -t && sudo systemctl reload nginx
   ```

### Renewal

```bash
sudo certbot renew
sudo systemctl reload nginx
```

(Certbot’s system timer often handles this automatically.)
