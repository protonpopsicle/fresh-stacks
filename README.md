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

```
% dig +noall +answer fresh-stacks.org
fresh-stacks.org.	60	IN	A	34.120.229.110
```

The domain is registered with Cloudflare (DNS only--no proxy). The address `34.120.229.110` is a reserved (static) external IPv4 address in GCP. The SSL certificate is Google-managed. TLS termination is handled by an HTTP(S) Load Balancer created by Google based on our Kubernetes ingress manifest.

```
% kubectl get ingress basic-ingress
NAME            CLASS    HOSTS   ADDRESS         PORTS   AGE
basic-ingress   <none>   *       334.120.229.110 80      2d21h
```

GCP docs describing this setup:
- https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer
- https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs

### Costs

The domain name costs $10.11/year.
Google Kubernetes Engine (GKE) has a high maintanence cost ($75+/mo). Currently we are on GCP free trial which expires June 18, 2025.

## Development Environments

Each app has a README with environment setup instructions. The goal is to support the following options for local dev:
1. Run app locally (native)
2. Deploy app using Docker (Docker Desktop)
3. Deploy app to local k8s (Minikube)
4. Deploy app to cloud (GKE)

### Docker Desktop

Docker Desktop is an easy way to install Docker Engine and other Docker software useful for local developement.

### Minikube

Minikube is a single-node k8s cluster useful for local developement.

### GKE

Cloud is similar to #3 but with `kubectl` pointed to our GKE cluster. All apps run in the same cluster--it is a shared resource.
