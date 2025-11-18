# Family Chores Adventure

## Overview

Family Chores Adventure is a gamified family chore tracking application designed to make household tasks fun and engaging for all family members, ages 5-50. The app features a playful, game-like interface inspired by apps like Duolingo and Habitica, with points, rewards, leaderboards, and weekly competitions. Family members can claim chores, earn points, compete for the weekly champion crown, and redeem rewards. Parents have special administrative capabilities to manage chores, approve completed tasks, and adjust points.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: Shadcn UI components built on Radix UI primitives, providing accessible and customizable UI components. The design system uses a "New York" style variant with custom Tailwind CSS configuration.

**Styling Approach**: Tailwind CSS with a custom design system featuring:
- Fredoka font for playful, kid-friendly headings
- Inter font for readable body text
- Mobile-first responsive design
- Custom color schemes that adapt based on user's selected avatar
- Gamified visual language with emoji-heavy interface

**State Management**: React Query (@tanstack/react-query) for server state management, with local component state using React hooks. Mock data is currently used throughout the application with TODO comments indicating where real API integration should occur.

**Routing**: Wouter for lightweight client-side routing between pages (Chores, Leaderboard, Rewards, Profile, Parent Dashboard).

**Key Design Patterns**:
- Component composition with reusable UI building blocks
- Avatar theming system that dynamically adjusts color schemes based on selected emoji avatar
- Separation of concerns with dedicated page components and smaller, focused UI components
- Progressive Web App (PWA) support with service worker registration and manifest

### Backend Architecture

**Server Framework**: Express.js with TypeScript, running on Node.js.

**Database ORM**: Drizzle ORM configured for PostgreSQL (via Neon serverless).

**Current Implementation**: The backend is minimally implemented with a basic storage interface. The `server/storage.ts` file defines an in-memory storage implementation (`MemStorage`) with CRUD operations for users. The actual routes and business logic need to be implemented.

**API Design**: RESTful API architecture intended with `/api` prefix for all application endpoints. Currently, route handlers are stubbed in `server/routes.ts`.

**Session Management**: Infrastructure includes connect-pg-simple for PostgreSQL session storage, though authentication is not yet implemented.

### Data Storage Solutions

**Primary Database**: PostgreSQL accessed via Neon serverless driver (`@neondatabase/serverless`). Connection pooling is configured in `server/db.ts`.

**Schema Management**: Drizzle Kit for database migrations. Schema definitions in `shared/schema.ts` currently contain only a basic users table with username and password fields.

**Local Storage**: Browser localStorage used for:
- Weekly reset tracking (last reset timestamp)
- Weekly champion data
- Notification permission preferences
- Install prompt dismissal state

**Future Schema Needs** (based on frontend implementation):
- Family/household table
- Family members with avatar, points, roles
- Chores table with emoji, title, point values, assignment status
- Completed chores/approval workflow
- Rewards catalog
- Point transaction history

### Authentication and Authorization

**Current State**: Authentication is not implemented. The frontend uses mock login functionality with a simple check for "boss" suffix in family code to determine parent status.

**Intended Design**: 
- Family-based multi-user authentication
- Parent/child role differentiation
- Family codes for joining existing households

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible components (dialogs, dropdowns, tabs, etc.)
- Lucide React for icons
- Canvas Confetti for celebration animations
- React Hook Form with Zod for form validation

**Notification System**: Browser Push Notifications API for chore assignments and weekly champion announcements. Permission handling implemented in `client/src/lib/notifications.ts`.

**PWA Features**:
- Service worker for offline capability and caching
- Web app manifest for installability
- Install prompts for iOS (share sheet) and Android (beforeinstallprompt)
- Dynamic icon generation using Canvas API

**Development Tools**:
- Replit-specific plugins for development experience (runtime error overlay, cartographer, dev banner)
- ESBuild for production bundling
- TypeScript for type safety across the stack

**Weekly Reset System**: Client-side logic (in `client/src/lib/weeklyReset.ts`) that tracks Sunday midnight resets to crown weekly champions and reset weekly point totals. This should eventually be server-side for consistency.

**Key Architectural Decisions**:

1. **Shared Schema**: TypeScript schema definitions in `shared/` directory accessible to both client and server for type safety.

2. **Monorepo Structure**: Single repository with client and server code, shared types, and unified build process.

3. **Mock-First Development**: Frontend built with comprehensive mock data to establish UX before backend implementation, marked with TODO comments for future API integration.

4. **Gamification Core**: Points, weekly competitions, and rewards system as primary engagement mechanisms rather than traditional task management.

5. **Family-Centric Design**: Multi-user household context rather than individual user accounts, with parent administrative controls separate from child member experience.