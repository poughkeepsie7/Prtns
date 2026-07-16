## Asteroid Threat Dashboard

A full-stack real-time monitoring platform that ingests near-Earth asteroid data from NASA's NeoWs API, persists it to PostgreSQL, and visualizes close-approach patterns with a D3.js proximity chart.

## Features


- Live NASA data ingestion — pulls a rolling 7-day window of near-Earth object data from NASA's NeoWs API
- Automated weekly sync — a scheduled cron job keeps the dataset fresh without manual intervention
- Redis-backed caching — avoids redundant calls to NASA's rate-limited API
- Interactive proximity chart — D3.js scatter plot (log-scale y-axis) showing miss distance vs. approach date, with     bubble size mapped to estimated diameter and color mapped to hazard classification
- Sortable data table — full breakdown of every tracked asteroid's velocity, distance, and size
- Fully containerized — five services (client, server, PostgreSQL, Redis, Nginx) orchestrated with Docker Compose     behind a single reverse-proxy entry point


## Architecture

```text
                    ┌─────────────┐
   Browser ───────▶ │    Nginx    │  (single exposed port :80)
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ▼                             ▼
     ┌─────────────┐              ┌──────────────┐
     │ React/Vite  │              │  Express API │
     │   Client    │              │   (Node/TS)  │
     └─────────────┘              └───────┬──────┘
                                           │
                          ┌────────────────┼────────────────┐
                          ▼                                 ▼
                   ┌─────────────┐                  ┌──────────────┐
                   │ PostgreSQL  │                  │    Redis     │
                   │ (asteroid   │                  │ (response    │
                   │    data)    │                  │    cache)    │
                   └─────────────┘                  └──────────────┘
                          ▲
                          │
                  ┌───────┴────────┐
                  │ NASA NeoWs API │
                  │ (via cron job) │
                  └────────────────┘
```
Only Nginx is exposed to the host machine 

## Tech Stack
| Layer | Technology |
|--------|------------|
| Frontend | React, TypeScript, Vite, D3.js |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Caching | Redis |
| Scheduling | node-cron |
| Reverse Proxy | Nginx |
| Orchestration | Docker Compose |

## Getting started
**Prerequisites** 
- Docker Desktop
- A free NASA API key from api.nasa.gov

**Setup**
1. Clone repo
    ```
    git clone https://github.com/poughkeepsie7/Prtns.git
    cd asteroid-dashboard
    ```

2. Copy environment template and fill in your NASA API key
    ```
    cp .env.example .env
    ```

3. Start all services
     ```
    docker compose up --build
    ```
4. Open the dashboard
     ```
    http://localhost
    ```

## API Endpoints
| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/asteroids` | Returns tracked asteroids with close-approach data |