# fresh-stacks
Fresh Stacks is an informal, self-directed group focused on learning new (to us) software technologies.
This repo is for hosting code, documentation, and shared infrastructure config.

https://fresh-stacks.org

## Current Objectives
- Kubernetes
- gRPC
- TypeScript
- React
- Gen AI
- Google Cloud
- MongoDB
- Kafka

## Configuration and Cloud
`fresh-stacks.org` resolves to a public endpoint hosted on Google Cloud Platform (GCP).

```console
% dig +noall +answer fresh-stacks.org
fresh-stacks.org.	60	IN	A	34.120.229.110
```

The domain is registered with Cloudflare (DNS only--no proxy). The address `34.120.229.110` is a reserved (static) external IPv4 address in GCP. The SSL certificate is Google-managed.

```console
% gcloud compute ssl-certificates describe mcrt-13d5023e-571a-46c9-a6e5-d093386e0ef6
certificate: |
  -----BEGIN CERTIFICATE-----
  ...
```

### Google Cloud

Resources are configured using Google Cloud Console or CLI (🤦 ideally we'd migrate our project to use Terraform). TLS termination is handled by an External Application Load Balancer. Behind which are `n` "backends". The idea is these map to the [/apps](apps) in this repo. Currently there is only one: a Compute Engine VM instance in zone: us-central1-a. A custom firewall rule allows ingress from the load balancer to the VM.

> [!NOTE]
> Initially, k8s was used to deploy to a shared GKE (Google Kubernetes Engine) cluster but the base cost was very high ($75+/mo) even with no services running. k8s configs are still included for reference and can be used for Minikube local deployment.

### Costs

The domain name costs $10.11/year.
GCP cost is minimal today. Waiting for post-free-trial monthly bill.

## Development Environments

Each application under [/apps](apps) has a README with environment setup instructions. The goal is to support the following options for local dev:
1. Run natively
2. Run using Docker
3. Deploy to local k8s

For cloud hosting we operate a shared GCP project `fresh-stacks` in which VM instances can be created and endpoints exposed via load balancer.

### Docker Desktop

[Docker Desktop](https://docs.docker.com/desktop/) is an easy way to install Docker Engine and other Docker software useful for local developement.

### Minikube

[Minikube](https://minikube.sigs.k8s.io/) is a single-node k8s cluster useful for local developement.

### Google Cloud

Install the [GCloud CLI](https://cloud.google.com/sdk/docs/install). Contact @protonpopsicle to request access for the `fresh-stacks` GCP project.

```
% gcloud auth configure-docker us-central1-docker.pkg.dev
```

For example of detailed steps see [apps/hello/README.md](apps/hello/README.md).

### Kubernetes Configuration

Some manifest files are app-specific. These reside in the app's directory and are symlinked into the root [kubernetes](kubernetes) folder for convenience.

```console
% ls -go kubernetes
total 16
-rw-r--r--  1   366 Apr 21 14:52 basic-ingress.yaml
lrwxr-xr-x  1    35 Apr 24 18:27 hello-deployment.yaml -> ../apps/hello/hello-deployment.yaml
lrwxr-xr-x  1    32 Apr 24 18:27 hello-service.yaml -> ../apps/hello/hello-service.yaml
-rw-r--r--  1   128 Apr 21 12:38 managed-cert.yaml
```
