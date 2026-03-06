# hello

Node static files server + simple React app. Serves landing page for [fresh-stacks.org](https://fresh-stacks.org/) and "InkPad" application.

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

## Build the frontend and backend

```console
% npm run build:backend && npm run build:frontend
```

## Run Locally

```console
% npm start

> hello@1.0.0 start
> node build/app.js

serving files from:  /path/to/fresh-stacks/apps/hello/build
Server listening on port 3000
```

Visit [http://localhost:3000](http://localhost:3000).

## Run with Docker

```console
% docker build -t $USER/hello .
% docker run --rm --env-file .env --name hello -p 3000:3000 $USER/hello
```

Visit [http://localhost:3000](http://localhost:3000).

## Local Kubernetes Reference

To test with Minikube locally:

```console
% minikube start
% eval $(minikube -p minikube docker-env)
% docker build -t $USER/hello .
% kubectl create configmap hello-config --from-env-file=.env
% IMAGE=docker.io/$USER/hello:latest yq eval '.spec.template.spec.containers[].image = env(IMAGE), .spec.template.spec.containers[].imagePullPolicy = "Never"' hello-deployment.yaml | kubectl apply -f - -f hello-service.yaml
% kubectl rollout restart deployment/hello
% minikube service hello-service --url
http://127.0.0.1:62900
```

Visit `http://127.0.0.1:62900` (actual URL obtained from above command). Note: [yq](https://github.com/mikefarah/yq) is used above to substitute the `image` value in the deployment manifest to point to your local image.

See [infrastructure/kubernetes/](../../infrastructure/kubernetes/) for k8s manifests.