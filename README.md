# Containerization and Orchestration Demo

## Project Overview

This project demonstrates how to containerize a lightweight Node.js application using Docker and manage multiple application instances using Docker Compose.

The application includes a landing page, a health-check endpoint, and a metadata endpoint that displays container runtime information.

## Technologies

- Node.js 22
- Express
- Docker and Docker Compose
- Nginx reverse proxy
- Alpine Linux-based container images

## Architecture

The application uses Docker Compose to manage three Node.js containers and one Nginx reverse proxy.

Nginx receives requests on port 8080 and distributes them across the application replicas.

Each application container exposes port 3000 internally.

### Application Endpoints

| Endpoint | Description |
|---|---|
| `/` | Displays the application homepage and container hostname |
| `/healthz` | Returns HTTP 200 and a healthy status |
| `/metadata` | Displays the container hostname, uptime, and Node.js version |

## Docker Image Optimization and Security

The Dockerfile implements the following practices:

- Multi-stage build to separate dependency installation from runtime configuration.
- Lightweight `node:22-alpine` base image.
- Dependency files copied before application code to improve Docker layer caching.
- `npm ci --omit=dev` to install production dependencies.
- Non-root execution using the `node` user.
- Health check using the `/healthz` endpoint.
- `.dockerignore` to exclude unnecessary files and sensitive environment files from the build context.

## Docker Compose Orchestration

Docker Compose manages the Node.js application replicas and Nginx reverse proxy.

Each web container has:

- CPU limit: 0.5 CPU
- Memory limit: 256 MiB
- Restart policy: `unless-stopped`
- Health checks every 10 seconds

## Setup Instructions

### Prerequisites

- Docker Desktop
- Docker Compose
- Git

### Build the image

```bash
docker build -t week04-web-app:v1 .
```

### Start the application

```bash
docker compose up -d --build --scale web=3
```

### Access the application

Open:

http://localhost:8080

### Check container health

```bash
docker compose ps
```

### Scale the application

```bash
docker compose up -d --scale web=3
```

### Stop the application

```bash
docker compose down
```

## Quality Assurance Results

| Test | Result |
|---|---|
| Docker image build | Passed |
| Non-root user verification | Passed — UID 1000 |
| Application health check | Passed — HTTP 200 |
| Three-replica scaling | Passed |
| Nginx load balancing | Passed — 12 requests distributed evenly |
| Self-healing | Passed — 2 automatic restarts |
| HTTP homepage response | Passed — HTTP 200 |
| Browser response time | 5.70 ms in one local test |
| Memory limit | Verified — 256 MiB |
| CPU limit | Verified — 0.5 CPU |
| Browser Console | Passed — No uncaught JavaScript errors |

## AI-Assisted Development and Configuration Audit

**AI tool used:** ChatGPT

ChatGPT assisted with generating the Node.js application, Dockerfile, Docker Compose manifest, Nginx configuration, and troubleshooting commands.

### Initial Configuration Issues and Corrections

**Dockerfile audit**

The initial illustrative Dockerfile used `node:latest`, installed dependencies after copying all source files, ran as root, and lacked a multi-stage build.

The revised configuration used a lightweight Node.js Alpine image, improved layer caching, installed only production dependencies, and executed the application as a non-root user.

**Nginx configuration issue**

The deployment initially failed because `nginx.conf` existed as a directory rather than a file. After correcting the file type, Nginx reported a missing `events` section.

These issues were resolved by creating a valid Nginx configuration file and validating its syntax.

**Self-healing test**

Initial termination attempts did not produce a verified automatic restart. A temporary test endpoint was introduced to simulate application failure using process exit code 1.

Docker subsequently recorded two automatic restarts, verifying the configured restart policy.

The temporary crash endpoint was removed from the final application.

## AI Prompt Appendix

The exact prompts and follow-up instructions used during development should be included here before submission, copied from the ChatGPT conversation.

## Key Takeaways

Containerization makes applications more portable and reproducible by packaging their runtime dependencies and configuration.

Docker Compose simplifies running multiple services, scaling application replicas, and configuring health checks and restart policies.

However, containerized deployments also require attention to image security, resource usage, networking, and orchestration configuration.

## AI Prompt Appendix

**AI Tool:** ChatGPT (OpenAI)

### Prompt 1 — Initial Application and Docker Configuration

The initial assignment prompt requested:

> Act as a senior DevOps and cloud infrastructure architect. I need to containerize and orchestrate a lightweight web application (e.g., Node.js, Python FastAPI, or Go).

The requested deliverables included a production-ready multi-stage Dockerfile, non-root execution, a `/healthz` endpoint, Docker Compose orchestration, and application code.

**AI Output:** A Node.js Express application, an initial Dockerfile, and Docker Compose configuration.

### Prompt 2 — Docker Installation and Verification

Assistance was requested to install Docker Desktop, verify Docker CLI functionality, and run the `hello-world` container.

**Result:** Docker Desktop was installed and successfully verified.

### Prompt 3 — Docker Compose Troubleshooting

The following terminal error was shared with ChatGPT:

```text
error mounting nginx.conf to /etc/nginx/nginx.conf:
not a directory
```

**Result:** The `nginx.conf` path was identified as an empty directory and corrected to a configuration file.

### Prompt 4 — Nginx Configuration Debugging

The following error was provided:

```text
nginx: [emerg] no "events" section in configuration
```

**Result:** The configuration was corrected to include the required `events {}` section.

### Prompt 5 — Self-Healing Verification

Docker reported:

```text
Status=exited ExitCode=137
OOMKilled=false RestartCount=0
```

ChatGPT assisted with diagnosing container termination and verifying the restart policy.

A temporary test endpoint was introduced to simulate application failure using `process.exit(1)`.

**Result:** Docker recorded two automatic restarts:

```text
Status=running RestartCount=2
```

The temporary crash-test endpoint was subsequently removed.

### Prompt 6 — QA and GitHub Preparation

ChatGPT assisted with verifying HTTP responses, resource limits, browser DevTools results, `.gitignore`, Git configuration, and README documentation.

**Result:** The application passed the verified container, health-check, load-balancing, and self-healing tests.


