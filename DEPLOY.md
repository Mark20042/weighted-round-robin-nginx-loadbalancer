# Deployment Guide: Weighted Round Robin on Render

This guide explains how to deploy your **5-node Load Balancer Visualizer** to Render using the created Blueprint.

## Prerequisites
1. A [Render](https://render.com) account.
2. This project code pushed to a GitHub or GitLab repository.

## Step 1: Create Blueprint Instance
1. Go to your **Render Dashboard**.
2. Click **New +** and select **Blueprint**.
3. Connect your repository.
4. Render will detect the `render.yaml` file.
5. Give your blueprint instance a name (e.g., `load-balancer-demo`).
6. Click **Apply**.
   - Render will start creating **7 services** (5 APIs, 1 Nginx, 1 Frontend).
   - This might take a few minutes.

## Step 2: Configure Frontend Connection
Since the Frontend is a static site, it needs to know the Nginx Load Balancer's URL *at build time*. The initial deploy will use a placeholder and won't connect.

1. Once the **nginx-lb** service is live, copy its URL (e.g., `https://nginx-lb-xyz.onrender.com`).
2. Go to your **Render Dashboard** and find the **client-ui** static site service.
3. Go to **Environment**.
4. Edit the `VITE_API_ORIGIN` variable.
5. Paste the Nginx URL (ensure no trailing slash, e.g., `https://nginx-lb-xyz.onrender.com`).
6. Save changes.
7. Go to **Deploy** and select **Trigger Deploy** (Clear build cache if needed) to rebuild the frontend with the correct API URL.

## Architecture Notes
- **Services**: You are running 5 separate Node.js instances on Render's free tier (if applicable).
- **Communication**: Nginx talks to the APIs using Render's internal private network (mesh), ensuring low latency and security.
- **Frontend**: The React app connects to Nginx publicly, which then routes internally to one of the 5 APIs.

## Troubleshooting
- **502 Bad Gateway from Nginx**: This means Nginx cannot reach the API nodes. Check the `nginx-lb` logs to see if `envsubst` worked correctly and if the API services are healthy.
- **Visualizer stuck**: Ensure the Client's `VITE_API_ORIGIN` is correct and does NOT have a trailing `/api`.
