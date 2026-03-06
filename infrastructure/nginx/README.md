# Nginx Reverse Proxy with TLS (certbot)

This directory contains the configuration to deploy a Docker-based Nginx server with automatic certificate renewal (every 12 days) using [`jonasal/docker-nginx-certbot`](https://github.com/JonasAlfredsson/docker-nginx-certbot).

## Infrastructure Details

| Property | Value |
|----------|-------|
| VM Name | `hello-instance` (Zone: `us-central1-a`) |
| Static IP | `34.69.28.198` |
| Domain | `fresh-stacks.org` |

## Files

| File | Purpose |
|------|---------|
| `user_conf.d/fresh-stacks.conf` | Nginx config: HTTP→HTTPS, ACME challenge, proxy to `host.docker.internal:3000` |
| `run-nginx-certbot.sh` | Wrapper script to start the container with correct volumes/env |

## Deployment Steps

### 1. Prepare DNS & Firewall

Ensure ports `80` and `443` are open in the GCP firewall. In your DNS provider (e.g., Cloudflare), point the A records for `fresh-stacks.org` and `www` to `34.69.28.198`. Verify with:

```bash
dig +short fresh-stacks.org
```

### 2. SSH to the VM

```bash
gcloud compute ssh hello-instance --zone=us-central1-a
```

### 3. Ensure App is Running

The proxy expects the app on port `3000`. Verify with `docker ps`. If not running, start your app container with `-p 3000:3000`.

### 4. Sync Files to VM

If the repo isn't already there, copy the nginx directory from your local machine:

```bash
gcloud compute scp --recurse infrastructure/nginx hello-instance:~/nginx --zone=us-central1-a
```

### 5. Launch Nginx & Certbot

On the VM, navigate to the directory and run:

```bash
export CERTBOT_EMAIL=your@email.com
bash ./run-nginx-certbot.sh
```

> **Note:** First-time setup takes a few minutes to generate DH parameters. Monitor progress with `docker logs -f nginx-certbot`.

---

## Maintenance & Scaling

### Reload Configuration

If you modify `user_conf.d/fresh-stacks.conf`, reload Nginx without a restart:

```bash
docker kill --signal=HUP nginx-certbot
```

### Adding New Apps

1. Edit `user_conf.d/fresh-stacks.conf` to add a new `location` or `server` block.
2. Proxy to the new port (e.g., `http://host.docker.internal:3001`).
3. Send the `SIGHUP` signal as shown above.

---

## Environment Variables (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `LETSENCRYPT_DIR` | `./letsencrypt` | Cert storage path |
| `CONTAINER_NAME` | `nginx-certbot` | Container name |