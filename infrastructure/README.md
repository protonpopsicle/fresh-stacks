# Infrastructure

## Current Deployment

The app runs in a **Docker container on a GCP VM** with an **nginx reverse proxy** that handles TLS with automatic cert renewal.

- **Reverse proxy & TLS:** [nginx/](nginx/)
- **VM & networking setup:** See [nginx/RUNBOOK.md](nginx/RUNBOOK.md)
- **Kubernetes (reference):** [kubernetes/](kubernetes/) — Local testing only; not used in production

---

## Configuration and Cloud

`fresh-stacks.org` resolves to a GCP VM with a static external IP.

**Current VM:**

```console
% dig +short fresh-stacks.org
34.69.28.198
```

### Domain & DNS:

- Domain registered with Cloudflare (DNS only—no proxy)
- A records for `fresh-stacks.org` and `www.fresh-stacks.org` point to VM static IP: 34.69.28.198

### TLS Certificate:

- Issued by Let's Encrypt
- Managed automatically by the nginx-certbot container
- Renewal every 12 days (no manual action needed)

To verify:

```console
% openssl s_client -connect fresh-stacks.org:443 -servername fresh-stacks.org
```

## Costs

- Domain name: ~$10/year
- GCP VM (e2-micro): ~$2-3/month
- **Total:** ~$34-46/year

---

## GCP Project Access

Team members need access to the `fresh-stacks` GCP project to manage VM instances and other resources.

```console
% gcloud auth configure-docker us-central1-docker.pkg.dev
```

See individual app READMEs for detailed deployment steps.

---

## Adding a New App

1. Create your app in `apps/<name>/` with its own README
Include Docker setup
2. To serve from the VM, add a new `location` or `server` block to `infrastructure/nginx/user_conf.d/fresh-stacks.conf`
3. Reload nginx: `docker kill --signal=HUP nginx-certbot`
4. See [infrastructure/nginx/README.md](nginx/README.md) for proxy configuration details.