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

The domain is registered with Cloudflare (DNS only--no proxy). The address `34.120.229.110` is a reserved (static) external IPv4 address in GCP. The SSL certificate is Google-managed. TLS termination is handled by an HTTP(S) Load Balancer created by Google based on our Kubernetes [ingress manifest](kubernetes/basic-ingress.yaml).

```console
$ kubectl config use-context gke_fresh-stacks_us-central1_fresh-cluster-1
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

Each application under [/apps](apps) has a README with environment setup instructions. The goal is to support the following options for local dev:
1. Run natively
2. Run using Docker
3. Deploy to local k8s

For cloud hosting we operate a shared GKE cluster `fresh-cluster-1`.

### Docker Desktop

[Docker Desktop](https://docs.docker.com/desktop/) is an easy way to install Docker Engine and other Docker software useful for local developement.

### Minikube

[Minikube](https://minikube.sigs.k8s.io/) is a single-node k8s cluster useful for local developement.

### Google Cloud

Install the [GCloud CLI](https://cloud.google.com/sdk/docs/install). Contact @protonpopsicle to request access for the `fresh-stacks` GCP project.

```
% gcloud components install gke-gcloud-auth-plugin
% gcloud container clusters get-credentials fresh-cluster-1 --region=us-central1
% gcloud auth configure-docker us-central1-docker.pkg.dev
```

To switch kubectl contexts between Minikube and fresh-cluster-1:
```console
% kubectl config get-contexts                                            
CURRENT   NAME                                           CLUSTER                                        AUTHINFO                                       NAMESPACE
          gke_fresh-stacks_us-central1_fresh-cluster-1   gke_fresh-stacks_us-central1_fresh-cluster-1   gke_fresh-stacks_us-central1_fresh-cluster-1             
*         minikube                                       minikube                                       minikube                                       default
% kubectl config use-context NAME
```

Relevent docs: 
https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl

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
