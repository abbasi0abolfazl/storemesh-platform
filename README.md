# StoreMesh Platform (Monorepo)

StoreMesh is a multi-site warehouse, cold-chain, and production traceability platform for food processing operations (**Iran**, **Dubai**, **Rome**).

## Monorepo Structure

- `apps/site-server/`: Transactional site server (domain rules, auth, audit, outbox, PostgreSQL & JSON repositories)
- `apps/cloud/`: Cross-site event aggregator and reporting service
- `apps/web/`: Management and operational web console (RTL)
- `apps/terminal/`: Factory floor terminal UI + TCP scale/printer drivers
- `apps/pda/`: Installable offline-capable PWA for Android industrial PDAs
- `apps/figma-make-ui/`: Interactive 13-station UI/UX prototype (React + Tailwind + Vite)
- `packages/contracts/`: OpenAPI 3.1 contracts (`storemesh.yaml`, `storemesh-cloud.yaml`) and route parity tests
- `infrastructure/`: Docker Compose topology, Prometheus monitoring, and automated backup scripts
- `e2e/`: End-to-end operational acceptance tests
- `docs/`: Architecture specs, Fix Requests, audit reports, and operational guides

## Documentation

- [Architecture & Storage Overview](./docs/architecture.md)
- [Domain Rules & Hardware Gates](./docs/domain-rules.md)
- [Deployment & Local Run Guide](./docs/deployment-guide.md)
- [Technical Audit Report (2026-11-26)](./docs/technical-audit-2026-11-26.md)
- [Prioritized Roadmap & Go/No-Go Checklist](./docs/roadmap.md)
- [Engineering & Agent Rules](./AGENTS.md)
- [UI/Backend Change Control](./docs/ui-backend-change-control.md)

## Quick Start (Local Without Docker)

```bash
./scripts/seed-data.sh
./scripts/start-all.sh
./scripts/verify-stack.sh
```

- **Web Console:** `http://localhost:8080`
- **Terminal UI:** `http://localhost:8081`
- **PDA PWA:** `http://localhost:8082`
- **Figma Make Prototype:** `http://localhost:8443`
- **Site API Health:** `http://localhost:3000/health`
- **Cloud API Health:** `http://localhost:4000/health`
