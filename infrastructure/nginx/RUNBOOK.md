# Runbook: Deploy nginx + TLS on the VM (next steps)

Follow these in order. VM name: **hello-instance** (or **hello-instance-debian**). Zone: **us-central1-a**. VM static IP: **34.69.28.198**.

---

## Step 1: SSH to the VM

From your machine (with gcloud configured):

```bash
gcloud compute ssh hello-instance --zone=us-central1-a
```

If your VM has a different name, use that instead.

---

## Step 2: Ensure the hello app is running on port 3000

The nginx-certbot container will proxy HTTPS to the host at port 3000. Check that the hello container is running:

```bash
docker ps
```

You should see a container that maps port 3000 (e.g. `0.0.0.0:3000->3000/tcp`). If not, start it (from the hello app directory or with your usual command), for example:

```bash
docker run -d --name hello --restart unless-stopped -p 3000:3000 \
  -e ... \
  us-central1-docker.pkg.dev/fresh-stacks/fresh-repo/hello:latest
```

(Use your actual image and env vars.)

---

## Step 3: Get the repo onto the VM

You need the `infrastructure/nginx` directory on the VM (at least `user_conf.d/`, `run-nginx-certbot.sh`, and the script’s working directory).

**Option A — Clone the repo (if the VM has git and access):**

```bash
git clone https://github.com/YOUR_ORG/fresh-stacks.git
cd fresh-stacks/infrastructure/nginx
```

**Option B — Copy from your machine with gcloud scp:**

From your **local machine** (not in the SSH session):

```bash
gcloud compute scp --recurse infrastructure/nginx hello-instance:~/nginx --zone=us-central1-a
```

Then in the SSH session on the VM:

```bash
cd ~/nginx
```

---

## Step 4: Point DNS at the VM (so certbot can validate)

Let’s Encrypt will connect to `fresh-stacks.org` on port 80. That must reach the VM, not the Load Balancer.

In **Cloudflare** (or your DNS provider):

- Edit the **A** record for `fresh-stacks.org` and set it to **34.69.28.198** (instead of 34.120.229.110).
- If you have an A record for **www.fresh-stacks.org**, set it to **34.69.28.198** as well.

Save. Propagation can take a minute or two. You can check with:

```bash
dig +short fresh-stacks.org
```

You should see `34.69.28.198`.

---

## Step 5: Run the nginx-certbot container

Back in the SSH session on the VM, from `infrastructure/nginx` (or `~/nginx`):

```bash
export CERTBOT_EMAIL=your@email.com
bash ./run-nginx-certbot.sh
```

Use a real email address (Let’s Encrypt uses it for expiry and security notices).

The first run can take a few minutes (Diffie-Hellman parameters). The script will start the container and exit. To watch logs:

```bash
docker logs -f nginx-certbot
```

(Ctrl+C to stop following.) Once the container is ready and the cert is issued, HTTPS will work.

---

## Step 6: Verify

From your browser or command line:

- **https://fresh-stacks.org** — should load and show a valid certificate.
- **https://fresh-stacks.org/inkpad** — should load.
- **http://fresh-stacks.org** — should redirect to https.

If anything fails, check `docker logs nginx-certbot` and that the hello container is still running (`docker ps`).
