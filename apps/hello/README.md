# hello
Node static files server and landing page for fresh-stacks.org

## Install Node

https://nodejs.org/en/download

## Install dependencies

`% npm install`

## Create .env
```
% cp .env.example .env
```

Populate the values in the .env file so code has access to necessary environment variables at run time.

## Run locally

`% node app.js`

## Run with Docker
```
% docker buildx build . -t $USER/hello
% docker run --rm --env-file .env --name hello -p 3000:3000 $USER/hello
```

## Run with Kubernetes (local example with Minikube)
```
% eval $(minikube -p minikube docker-env)
% docker buildx build . -t $USER/hello
% kubectl create configmap hello-config --from-env-file=.env
% kubectl apply -f hello-deployment.yaml
% kubectl logs -l app=hello
```

## Deploy on GKE

https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl

```
% gcloud container clusters get-credentials fresh-cluster-1 \
    --region=us-central1
% gcloud auth configure-docker us-central1-docker.pkg.dev
```

same steps as above but Docker steps slightly different. Example:
```
% docker buildx build --platform linux/amd64 . -t us-central1-docker.pkg.dev/fresh-stacks/fresh-repo/hello:latest
% docker push us-central1-docker.pkg.dev/fresh-stacks/fresh-repo/hello:latest
```

To find public URL
```
% kubectl describe service hello
```
