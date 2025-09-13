# Conduit Development Guidelines

This document provides consistent behavior guidelines for developing the Conduit application.

## Project Structure

Conduit is a Turbo monorepo with the following structure:

- `apps/web` - Main web application (Next.js)
- `apps/docs` - Documentation site (Next.js)
- `apps/api` - REST API server (Express.js with service layer architecture)
- `packages/ui` - Shared UI components
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

## Package Manager

- Use `pnpm` as the package manager
- Version is locked to `pnpm@9.0.0` in `package.json`
- Use `pnpm install` to add new dependencies

## API Application Architecture

### Service Layer Pattern

The `apps/api` application follows a service layer architecture with dependency injection:

#### Directory Structure

```
apps/api/src/
├── controllers/     # HTTP request/response handling
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── routes/          # Route definitions
└── container.ts     # Dependency injection setup
```

#### Dependency Injection

- Uses `tsyringe` for dependency injection container
- All layers are registered and injected via interfaces
- Controllers inject services, services inject repositories
- Enables clean separation of concerns and testability

#### Example Usage

The API includes a hello endpoint at `/api/hello` that demonstrates:

- `HelloController` handles HTTP requests
- `HelloService` contains business logic
- `HelloRepository` handles data access
- Full dependency injection chain working together

### API Development Commands

- `cd apps/api && pnpm dev` - Start API server in development mode (port 3001)
- `cd apps/api && pnpm build` - Build the API application
- `cd apps/api && pnpm start` - Start built API server
