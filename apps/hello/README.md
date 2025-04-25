# hello
Node static files server. Serves landing page for [fresh-stacks.org](https://fresh-stacks.org/).

## Install Dependencies

[Install Node.js](https://nodejs.org/en/download). Then:

```console
% npm install
```

## Create .env
```console
% cp .env.example .env
```

Populate the values in the .env file so code can access necessary environment vars at run time.

## Run locally
```console
% node app.js
Server listening on port 3000
Pinged your deployment. You successfully connected to MongoDB!
```

## Run with Docker
```console
% docker build . -t $USER/hello
% docker run --rm --env-file .env --name hello -p 3000:3000 $USER/hello
```

## Deploy to local k8s
```console
% eval $(minikube -p minikube docker-env)
% docker build . -t $USER/hello
...
% kubectl config use-context minikube
% kubectl create configmap hello-config --from-env-file=.env
% kubectl apply -f hello-deployment.yaml
% kubectl rollout restart deployment/hello
```

## Deploy on GKE
```console
% docker build --platform linux/amd64 . -t us-central1-docker.pkg.dev/fresh-stacks/fresh-repo/hello:latest
% docker push us-central1-docker.pkg.dev/fresh-stacks/fresh-repo/hello:latest
...
% kubectl config use-context gke_fresh-stacks_us-central1_fresh-cluster-1 
% kubectl create configmap hello-config --from-env-file=.env
% kubectl apply -f hello-deployment.yaml
% kubectl rollout restart deployment/hello
```
