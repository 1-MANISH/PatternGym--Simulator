# Pattern Gym - Interview Reality Simulator

## Overview

Pattern Gym is an AI-powered professional learning platform designed to help engineers master interview patterns rather than memorize solutions. Built following the "Babua philosophy" - prioritizing clarity, calm UI, and deliberate practice over feature overload.

The platform has two core modules:
1. **Pattern Gym** - A training ground for practicing engineering patterns (DSA, System Design, LLD) with free access to intuition guides, canonical problems, and mental checklists
2. **Interview Reality Simulator** - A realistic interview environment with webcam, timer, code editor, and whiteboard to simulate real interview pressure

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui (Radix primitives + Tailwind)
- **Build Tool**: Vite with HMR support
- **Key Libraries**:
  - Monaco Editor for code editing
  - react-webcam for interview simulation
  - Framer Motion for animations
  - Recharts for progress visualization

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Build**: esbuild for server bundling, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client/server)
- **Validation**: drizzle-zod for schema-to-Zod conversion
- **Migrations**: Drizzle Kit (`drizzle-kit push`)

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Implementation**: Passport.js with custom Replit OIDC strategy
- **Protected Routes**: Client-side route guards with server middleware

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route components
│   └── lib/             # Utilities
├── server/              # Express backend
│   ├── replit_integrations/  # Auth, chat, image modules
│   └── routes.ts        # API route handlers
├── shared/              # Shared code
│   ├── schema.ts        # Drizzle database schema
│   ├── routes.ts        # API route definitions
│   └── models/          # Auth and chat models
└── migrations/          # Database migrations
```

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` folder for type safety across client/server
- **API Contracts**: Zod schemas define request/response shapes with runtime validation
- **Modular Integrations**: Replit-specific features (auth, chat, image, batch) are isolated in `server/replit_integrations/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Session Table**: `sessions` table required for auth (managed by Replit Auth)
- **Schema Tables**: users, patterns, problems, submissions, interviews, conversations, messages

### Authentication
- **Replit Auth**: OIDC provider at `https://replit.com/oidc`
- **Required Env Vars**: `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET`, `DATABASE_URL`

### AI Services
- **OpenAI API**: Used via Replit AI Integrations for chat and image generation
- **Required Env Vars**: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Third-Party Libraries
- **Monaco Editor**: In-browser code editor for problem solving
- **react-webcam**: Webcam access for interview simulation
- **Recharts**: Dashboard visualizations
- **Framer Motion**: Page transitions and animations