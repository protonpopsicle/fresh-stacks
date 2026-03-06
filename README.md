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

## Deployment & Infrastructure

See [infrastructure/README.md](infrastructure/README.md) for how the app is currently deployed, cloud configuration, costs, and operational details.

## Local Development

Each application under [/apps](apps) has a README with environment setup instructions. The goal is to support the following options for local dev:

1. Run natively
2. Run using Docker
3. Deploy to local k8s

### Tools

- [Docker Desktop](https://docs.docker.com/desktop/) — Easy way to install Docker Engine and other Docker software useful for local development.
- [Minikube](https://minikube.sigs.k8s.io/) — Single-node k8s cluster useful for local development.
- [GCloud CLI](https://cloud.google.com/sdk/docs/install) — Manage GCP resources and push container images.