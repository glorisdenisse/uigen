# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language, Claude AI generates them in real-time, and a live preview renders them in an iframe. Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma/SQLite, and the Vercel AI SDK with Anthropic Claude.

## Commands

```bash
npm run setup          # First-time setup: install deps, generate Prisma client, run migrations
npm run dev            # Start dev server with Turbopack on localhost:3000
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Run all Vitest tests (jsdom environment)
npm run db:reset       # Reset SQLite database
```

To run a single test file:
```bash
npx vitest run src/lib/transform/__tests__/jsx-transformer.test.ts
```

## Architecture

### Core Data Flow

1. User types a component description in **ChatInterface**
2. **ChatProvider** (wrapping `@ai-sdk/react` useChat) POSTs to `/api/chat`
3. The API route streams Claude's response, which calls tools (`str_replace_editor`, `file_manager`) to create/edit files in a **VirtualFileSystem**
4. Tool results update **FileSystemContext** on the client in real-time
5. **PreviewFrame** detects changes, transforms JSX via Babel standalone, maps imports to esm.sh CDN, and renders in an iframe
6. **CodeEditor** (Monaco) displays the generated files with syntax highlighting

### Key Abstractions

- **VirtualFileSystem** (`src/lib/file-system.ts`): In-memory hierarchical file tree. Serializable to/from JSON for Prisma persistence. Every project requires a root `/App.jsx` entry point.
- **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`): Client-side Babel transformation + import map generation mapping `@/` aliases and npm packages to esm.sh CDN URLs.
- **AI Tools** (`src/lib/tools/`): `str_replace_editor` (create/view/edit files) and `file_manager` (rename/delete). These are Vercel AI SDK tool definitions called by Claude during generation.
- **Provider** (`src/lib/provider.ts`): Returns Claude Haiku 4.5 model or a MockLanguageModel when `ANTHROPIC_API_KEY` is not set, enabling development without API credentials.

### State Management

- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`): Manages VirtualFileSystem instance, selected file, and file CRUD operations.
- **ChatContext** (`src/lib/contexts/chat-context.tsx`): Wraps Vercel AI SDK's useChat hook, manages messages and streaming state. Processes tool calls by updating FileSystemContext.

### Authentication

JWT-based sessions (7-day expiry) stored in httpOnly cookies. Middleware (`src/middleware.ts`) protects API routes. Anonymous users can work without auth; their progress is tracked in localStorage via `anon-work-tracker.ts`.

### Database

SQLite via Prisma. Two models: `User` and `Project`. Projects store messages and VirtualFileSystem state as JSON strings. Schema at `prisma/schema.prisma`.

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Server actions in `src/actions/` for all DB/auth operations
- Client components use `"use client"` directive
- UI primitives from Shadcn UI (`src/components/ui/`)
- Tests live in `__tests__/` directories alongside their components
- System prompt for AI generation defined in `src/lib/prompts/generation.tsx`
