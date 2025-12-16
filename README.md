# Nova Wallet Backend

A NestJS backend project for managing wallets and transactions.

---

## Prerequisites

- Node.js >= 18  
- pnpm  
- Docker (for PostgreSQL)  
- PostgreSQL client (optional, for direct DB access)

---

## 1. Install Dependencies

```bash
pnpm install

2. Start PostgreSQL (Docker or your preferred DB)

Set up Postgres using Docker (or your preferred option):

docker compose up -d postgres

3. Run the Application
# development
pnpm run start

# watch mode (auto-reload)
pnpm run start:dev

# production mode
pnpm run start:prod

# start Postgres + app together (if configured)
pnpm run start:dev:db