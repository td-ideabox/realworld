# Conduit Development Guidelines

This document provides consistent behavior guidelines for developing the Conduit application.

## Project Structure

Conduit is a Turbo monorepo with the following structure:
- `apps/web` - Main web application (Next.js with TanStack Router, TanStack Query, Zustand)
- `apps/docs` - Documentation site (Next.js)
- `apps/infra` - AWS CDK infrastructure application
- `packages/ui` - Shared UI components with organized structure:
  - `components/` - Reusable UI components (Button, Card, Code, etc.)
  - `pages/` - Page-level components and layouts
  - `hooks/` - Custom React hooks
  - `stores/` - Zustand store definitions
  - `routing/` - TanStack Router utilities and route definitions
- `packages/eslint-config` - ESLint configuration
- `packages/typescript-config` - TypeScript configurations

## Development Commands

### Root Level Commands
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all apps and packages
- `pnpm format` - Format code using Prettier
- `pnpm test` - Run tests across all packages
- `pnpm check-types` - Type check all packages

### Creating New Apps
To create a new app in the monorepo:
1. Create a new directory in `apps/`
2. Initialize with appropriate framework (Next.js, etc.)
3. Add the app to `pnpm-workspace.yaml` (should be automatic with `apps/*`)
4. Configure the app's `package.json` with necessary scripts
5. Add build configuration to `turbo.json` if needed

### Creating New Packages
To create a new shared package:
1. Create a new directory in `packages/`
2. Initialize with `package.json` including `name` field with `@conduit/` prefix
3. Add appropriate build scripts and dependencies
4. Update dependent apps to use the new package

## Code Quality & Standards

### Linting
- Run `pnpm lint` before committing
- ESLint configuration is shared across all packages
- Fix all linting issues before submitting PRs

### Type Checking
- Run `pnpm check-types` to verify TypeScript compilation
- All code must pass type checking
- Use strict TypeScript configuration

### Testing
- Run `pnpm test` to execute all tests
- Write tests for new features and bug fixes
- Maintain good test coverage

### Formatting
- Use Prettier for code formatting
- Run `pnpm format` to format all files
- Configuration is consistent across the monorepo

## Build Process

### Development
- Use `pnpm dev` for local development
- Hot reloading is enabled for all apps
- Turborepo handles dependency caching

### Production Build
- Run `pnpm build` to create production builds
- Ensure all apps build successfully before deployment
- Turbo handles build optimization and caching

## Validation Checklist

Before considering any change complete:
1. ✅ Run `pnpm lint` - All linting issues resolved
2. ✅ Run `pnpm check-types` - All type errors resolved  
3. ✅ Run `pnpm test` - All tests passing
4. ✅ Run `pnpm build` - All packages build successfully
5. ✅ Run `pnpm format` - Code properly formatted

## CSS and Styling

- Both web and docs apps use the Conduit CSS from `//demo.productionready.io/main.css`
- Follow the existing design patterns and components
- Ensure consistent styling across all applications

## Frontend Libraries

### Main Web Application Stack
The `apps/web` application uses the following modern frontend libraries:
- **TanStack Query (@tanstack/react-query)** - Server state management and data fetching
- **TanStack Router (@tanstack/react-router)** - Type-safe client-side routing
- **Zustand** - Lightweight state management for client state

### UI Package Structure
The `packages/ui` package follows a structured approach:
- **Components**: Use for reusable UI components that can be shared across applications
- **Pages**: Place page-level components and complex layouts here
- **Hooks**: Custom React hooks for shared logic and state management
- **Stores**: Zustand store definitions for shared application state
- **Routing**: TanStack Router utilities, route definitions, and routing helpers

## Package Manager

- Use `pnpm` as the package manager
- Version is locked to `pnpm@9.0.0` in `package.json`
- Use `pnpm install` to add new dependencies

## Infrastructure (apps/infra)

The infrastructure app uses AWS CDK to manage cloud resources:

### Infrastructure Commands
- `pnpm infra:build` - Build the CDK application
- `pnpm infra:synth` - Synthesize CloudFormation templates
- `pnpm infra:diff` - Show differences between deployed stack and current state
- `pnpm infra:deploy` - Deploy infrastructure to AWS (uses devswarm-trevor profile)
- `pnpm infra:destroy` - Destroy infrastructure from AWS (uses devswarm-trevor profile)

### Infrastructure Structure
- `apps/infra/src/constructs/` - Reusable CDK constructs
- `apps/infra/src/stacks/` - CDK stack definitions
- `apps/infra/src/types/` - TypeScript type definitions
- `apps/infra/src/app.ts` - CDK app entry point

### AWS Profile
- Infrastructure deployment uses the `devswarm-trevor` AWS profile
- Ensure this profile is configured in your AWS CLI before deploying