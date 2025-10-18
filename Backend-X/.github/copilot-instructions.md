# Copilot Instructions for Backend-X

## Project Overview
This is a **Vendure e-commerce backend** built with TypeScript. Vendure uses a dual-process architecture with separate server and worker processes for handling API requests and background jobs.

## Architecture & Key Components

### Dual-Process Setup
- **Server process** (`src/index.ts`): Handles GraphQL APIs (admin & shop)
- **Worker process** (`src/index-worker.ts`): Handles background jobs, search indexing, email sending
- Both processes share the same configuration from `src/vendure-config.ts`

### Core Configuration Pattern
All Vendure configuration lives in `src/vendure-config.ts`:
- Environment-based config using `process.env.APP_ENV === 'dev'`
- Plugin registration with initialization options
- Database connection using PostgreSQL by default
- API endpoints: `/admin-api` (admin), `/shop-api` (storefront), `/admin` (UI)

## Development Workflows

### Running the Application
```bash
# Development (both processes with hot reload)
npm run dev

# Individual processes
npm run dev:server  # Main API server
npm run dev:worker  # Background job worker

# Production build
npm run build
npm run start
```

### Database & Migrations
- **Always set `synchronize: false`** in production
- Generate migrations when changing `customFields` or adding entities:
  ```bash
  npx vendure migrate
  ```
- Migration files go in `src/migrations/` and auto-run on server start via `runMigrations()`

### Plugin Development
- Custom functionality goes in `src/plugins/` directory
- Generate new plugins: `npx vendure add` → "Create a new Vendure plugin"
- Plugins must be registered in `vendure-config.ts` plugins array

## Project-Specific Patterns

### Environment Configuration
- Uses `.env` file with specific Vendure variables (DB_HOST, SUPERADMIN_USERNAME, etc.)
- Port configuration: Server on PORT, Admin UI on PORT+2
- Database ports use non-standard values (6543 for PostgreSQL) to avoid conflicts

### Email Templates
- File-based templates in `static/email/templates/`
- Handlebars (.hbs) format with partials support
- Test emails output to `static/email/test-emails/` in dev mode
- Email route available at `/mailbox` in development

### Asset Management
- Static assets served from `static/assets/`
- AssetServerPlugin handles uploads and serving
- URL prefix must be configured for production deployment

### Docker Setup
- `docker-compose.yml` provides development databases (PostgreSQL, MySQL, MariaDB)
- Services use non-standard ports to avoid conflicts
- Use `docker-compose up postgres_db` for local development

## Critical Integration Points

### GraphQL APIs
- Two separate GraphQL endpoints: admin-api (management) and shop-api (storefront)
- GraphiQL playground available in development
- Admin UI runs on separate port with API connection config

### Job Queue System
- Uses `DefaultJobQueuePlugin` with database buffering
- Background jobs run in worker process only
- Search indexing and email sending handled asynchronously

### Authentication
- Supports both bearer token and cookie authentication
- Superadmin credentials from environment variables
- Cookie secret must be set for session management

## Common Gotchas
- Always run both server AND worker processes in development
- Custom fields changes require database migrations
- Admin UI port is calculated as main port + 2
- Asset URLs need production configuration for deployment
- TypeScript decorators enabled for Vendure entities