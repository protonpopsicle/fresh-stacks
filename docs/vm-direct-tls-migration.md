# VM direct traffic + TLS migration plan

This document describes the plan to reduce GCP networking costs by removing the External Application Load Balancer and Cloud Armor, and instead directing traffic directly to the Compute Engine VM with TLS terminated on the VM (e.g. nginx + Let's Encrypt). Work will be done in multiple stages; this file is the high-level master description.

## Current state

- **Domain:** `fresh-stacks.org` on Cloudflare (DNS only) → GCP reserved static IP `34.120.229.110` (attached to the Load Balancer).
- **TLS:** Google-managed certificate; termination at the External Application Load Balancer.
- **Backend:** One Compute Engine VM (e.g. `hello-instance`) in `us-central1-a` running the hello app (or other apps) in a container. A custom firewall rule allows ingress from the Load Balancer to the VM.

**Cost breakdown (actual):**

| Item | Monthly cost |
|------|----------------|
| Compute Engine (VM) | ~$2.66 |
| Cloud Load Balancer forwarding rule (global) | ~$16.80 |
| Networking Cloud Armor policy | ~$5.00 |
| Networking Cloud Armor rule | ~$2.00 |
| **Total** | **~$26** |

The VM cost is acceptable; the Load Balancer and Cloud Armor make up the bulk of the bill.

## Target state

- **Domain:** `fresh-stacks.org` on Cloudflare (DNS only) → **VM’s external IP** (no Load Balancer).
- **TLS:** Terminated **on the VM** (e.g. nginx or Caddy + Let’s Encrypt). No GCP-managed cert for this site.
- **Traffic path:** Internet → VM:443 (HTTPS) / VM:80 (redirect to HTTPS) → reverse proxy → app(s) on localhost (e.g. Node on 3000).
- **GCP resources removed:** External Application Load Balancer, Cloud Armor policy/rule, reserved static IP used by the LB (optional: promote VM to use a reserved IP if desired for stability).

**Expected cost:** ~$2.66/month (VM only), plus domain (~$10.11/year).

**Benefits:**

- Large reduction in monthly GCP cost.
- Single VM can host multiple apps (reverse proxy routes by host/path); supports future apps with databases, other backends, or stateful protocols.
- No dependency on LB or Armor for this toy/low-traffic setup.

## High-level changes (stages)

### 1. VM and reverse proxy

- Ensure the VM has a **stable external IP** (reserve a static IP and assign it to the VM, or note the current ephemeral IP and accept that it can change on stop/start).
- Install and configure a **reverse proxy** on the VM (nginx or Caddy):
  - Listen on **80** (HTTP) and **443** (HTTPS).
  - HTTP → redirect to HTTPS.
  - HTTPS: serve TLS using a certificate from **Let’s Encrypt** (e.g. Certbot for nginx, or Caddy’s built-in ACME).
  - Proxy requests to the app(s) on localhost (e.g. `http://127.0.0.1:3000` for the hello app).
- Open **ports 80 and 443** in the VM’s firewall (and in GCP firewall for the VM’s network tag or target).
- **Reverse proxy:** See [infrastructure/nginx/](../infrastructure/nginx/). On **Container-Optimized OS (COS)** use the **jonasal/nginx-certbot** container: run `./run-nginx-certbot.sh` (set `CERTBOT_EMAIL`); one container handles nginx, cert issuance, and **automatic cert renewal** (every 12 days) with no cron or extra containers. On Debian/Ubuntu you can instead install nginx and certbot on the host and use `fresh-stacks.conf` + `certbot --nginx`. The README in that directory covers both.

No application code changes are required; the existing Node/container app(s) keep listening on 3000 (or chosen ports) on localhost.

### 2. DNS and TLS verification

- **DNS:** In Cloudflare, change the A record for `fresh-stacks.org` (and `www` if used) from the current LB IP (`34.120.229.110`) to the **VM’s external IP**.
- **TLS:** Ensure the reverse proxy’s TLS is valid for `fresh-stacks.org` (and `www` if applicable). Let’s Encrypt verification (HTTP-01 or DNS-01) must succeed; with DNS already on Cloudflare, either method is viable.

Do not remove the Load Balancer or Cloud Armor until the new path is verified (see below).

### 3. Verification

- Confirm `https://fresh-stacks.org` and `https://fresh-stacks.org/inkpad` (and any other routes) work correctly when DNS points to the VM.
- Confirm TLS certificate is valid and trusted (browser, or e.g. `openssl s_client`).
- Confirm HTTP redirects to HTTPS.

### 4. GCP cleanup (after cutover)

- Remove the **Cloud Armor** policy (and rules) from the Load Balancer backend (or delete the backend/service so Armor is no longer attached).
- Delete the **External Application Load Balancer** (forwarding rule, target proxy, backend service, URL map, etc.).
- **Release the reserved static IP** `34.120.229.110` (or repurpose it for the VM if desired; then attach it to the VM and update DNS if not already using the VM’s current IP).

After this, the only remaining charges for this setup should be the VM (~$2.66/mo) and domain.

### 5. Documentation and repo

- Update **root README.md** and **apps/hello/README.md** (and any other app READMEs) to describe:
  - New architecture: traffic → VM → reverse proxy (nginx/Caddy) → app(s).
  - How to obtain/renew TLS (Let’s Encrypt) on the VM.
  - How to add or reconfigure apps behind the reverse proxy as the repo grows (e.g. multiple hostnames or paths, databases, other backends).
- Optionally add **runbooks or config examples** (e.g. sample nginx or Caddy config) to the repo or to this doc for future reference.

## Out of scope for this plan

- **Firebase Hosting / Cloud Run:** This plan keeps a single VM as the host for current and future apps; it does not cover migration to Firebase or Cloud Run.
- **Kubernetes / GKE:** Local k8s (e.g. Minikube) and any GKE configs in the repo remain as-is for development/reference; production is the single VM with reverse proxy.
- **Cloud Armor re-enablement:** If DDoS or WAF protection is needed later, that can be revisited; for now the goal is to remove it to save cost.

## Reference: alternatives considered

| Approach | Approx. cost | TLS |
|----------|----------------|-----|
| Current (LB + Armor + VM) | ~$26/mo | GCP Load Balancer |
| Remove only Cloud Armor (keep LB) | ~$19/mo | GCP Load Balancer |
| **Direct to VM, TLS on VM** *(this plan)* | **~$2.66/mo** | VM (nginx/Caddy + Let’s Encrypt) |
| Firebase Hosting (no VM) | ~$0 | Google (Firebase) |

## Future state: multiple containers on one VM

Today there is only one app (hello); the stages above assume a single container on the VM. The desired future state is **multiple containers on a single VM**, one container per app, with the reverse proxy routing by hostname or path. This section outlines that pattern so it can be adopted when a second (and subsequent) app is added.

**Pattern:**

- **One app per container.** Each app has its own image and runs in its own container on the same VM, bound to a distinct port (e.g. hello → 3000, app2 → 3001, api → 4000).
- **Reverse proxy on the VM.** nginx (or Caddy) runs on the host—listening on 80/443, doing TLS—and proxies to `localhost:<port>` by hostname (e.g. `fresh-stacks.org` → 3000, `app2.fresh-stacks.org` → 3001) or by path (e.g. `/api` → 4000). The proxy config is updated when new apps are added.
- **Container runtime.** Docker (or similar) is installed on the VM. Containers can be started manually, via systemd units, or with a single `docker-compose.yml` that defines all app services and their port mappings.

**Why multiple containers (not one container with multiple processes):**

- Each app can be built, updated, and scaled independently; clear boundaries and simpler rollbacks.
- Aligns with common practice (one process per container). Avoids a single large image that runs many processes (e.g. under supervisor), which is harder to maintain and update.

**When adding a new app (future):**

1. Build and push the new app’s image (e.g. to Artifact Registry); or run it from the repo on the VM.
2. Run the new container on the VM, mapping a dedicated host port (e.g. `-p 3001:3000`).
3. Update the reverse proxy config: add a server block (nginx) or site block (Caddy) for the new hostname or path, proxying to the new port.
4. Reload the reverse proxy. No change to existing containers or their ports.

**Optional:** Run the reverse proxy itself in a container (e.g. nginx container listening on 80/443 and proxying to other containers’ ports). The same routing idea applies; the proxy container would need access to the host network or to the same Docker network as the app containers so it can reach their ports.

No changes to this plan are required for the current migration (single app). Adopt the multi-container layout when the second app is introduced.

---

*Last updated to reflect the chosen approach: direct traffic to VM with TLS on the VM, implemented in stages. Future-state section added for multiple containers on one VM.*
