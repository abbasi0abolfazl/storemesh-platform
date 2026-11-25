# StoreMesh Infrastructure

Deployment, observability, backup, recovery, secrets templates, and validated per-site configuration.

Application code is shared. Site differences are configuration, not forks.

Place this repository beside `storemesh-site-server`, `storemesh-cloud`, and `storemesh-web`, then run:

```sh
docker compose up --build
```

Test endpoints:

- Web dashboard: http://localhost:8080
- Receiving terminal: http://localhost:8081
- Industrial PDA: http://localhost:8082
- Iran API: http://localhost:3000/health
- Dubai API: http://localhost:3001/health
- Rome API: http://localhost:3002/health
- Cloud API: http://localhost:4000/health
- Prometheus: http://localhost:9090

Demo users are seeded by each site server. For administrative UI testing use `admin` / `storemesh-demo`; for ordinary operations use `operator` / `operator-demo`.
