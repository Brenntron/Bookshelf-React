# Bookshelf-React

Bookshelf-React is a book finder and journaling app built with React + TypeScript + Next.js + Prisma.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.**

## Current Repository State

**As of creation, this repository contains only:**
- `README.md` - Basic project description
- `.gitignore` - Standard Node.js/Next.js ignore patterns
- `.github/copilot-instructions.md` - This file

**The project needs initial setup before development can begin.** Follow the Prerequisites and Environment Setup section below.

## Working Effectively

### Prerequisites and Environment Setup
- Node.js 18+ is required (currently v20.19.5 is available)
- Verify installation: `node --version && npm --version`
- **FIRST TIME SETUP**: If `package.json` does not exist, the project needs initialization:
  - Create Next.js app: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - This takes 3-8 minutes. NEVER CANCEL. Set timeout to 15+ minutes.
- Install dependencies: `npm install` -- takes 2-5 minutes depending on network. NEVER CANCEL. Set timeout to 10+ minutes.

### Database Setup (Prisma)
- **NOTE**: Database setup only applies after Prisma is added to the project
- Install Prisma: `npm install prisma @prisma/client && npx prisma init` -- takes 1-2 minutes. NEVER CANCEL. Set timeout to 5+ minutes.
- Copy environment file: `cp .env.example .env` (if .env.example exists)
- Set up database connection in `.env` file
- Generate Prisma client: `npx prisma generate` -- takes 30-60 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
- Run database migrations: `npx prisma migrate dev` -- takes 30-60 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
- Seed database (if seeding exists): `npx prisma db seed` -- timing varies. NEVER CANCEL. Set timeout to 10+ minutes.

### Building and Development
- **VERIFY PROJECT SETUP FIRST**: Check if `package.json` exists: `ls package.json`
- Development server: `npm run dev` -- starts in 10-30 seconds. Development server runs on port 3000 by default.
- Build production: `npm run build` -- takes 2-10 minutes. NEVER CANCEL. Set timeout to 15+ minutes.
- Start production server: `npm run start` -- requires successful build first.
- Type checking: `npx tsc --noEmit` -- takes 30-90 seconds. NEVER CANCEL. Set timeout to 5+ minutes.

### Testing
- Run unit tests: `npm run test` OR `npm test` -- takes 1-5 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
- Run tests in watch mode: `npm run test:watch`
- Run tests with coverage: `npm run test:coverage` -- takes 2-8 minutes. NEVER CANCEL. Set timeout to 15+ minutes.
- Run end-to-end tests: `npm run test:e2e` -- takes 5-15 minutes. NEVER CANCEL. Set timeout to 30+ minutes.

### Code Quality and Validation
- **ALWAYS** run these before committing or the CI will fail:
  - `npm run lint` -- takes 15-60 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
  - `npm run type-check` -- takes 30-90 seconds. NEVER CANCEL. Set timeout to 5+ minutes.
  - `npx prettier --check .` -- takes 10-30 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
- Auto-fix formatting: `npm run format` OR `npx prettier --write .`
- Fix linting issues: `npm run lint:fix`

## Validation Scenarios

**IMPORTANT**: These scenarios apply once the project is properly initialized. If starting from an empty repository, complete the Prerequisites and Environment Setup first.

**ALWAYS manually test these complete user scenarios after making changes:**

### Initial Project Setup Validation
1. **Repository State Check**:
   - Verify current files: `ls -la`
   - Check if project is initialized: `ls package.json` (should exist after setup)
   - Verify Node.js compatibility: `node --version` (should be 18+)

2. **First Build Test** (after project initialization):
   - Install dependencies: `npm install`
   - Run development server: `npm run dev`
   - Navigate to http://localhost:3000
   - Verify the Next.js welcome page loads successfully
   - Check terminal for any startup errors

### Core Application Flow
1. **Database Connection Test**:
   - Start the development server: `npm run dev`
   - Navigate to http://localhost:3000
   - Verify the application loads without database connection errors
   - Check browser console for any critical errors

2. **Book Search and Management Flow**:
   - Search for a book using the search functionality
   - View book details
   - Add a book to personal collection (if implemented)
   - Create or edit a journal entry for a book (if implemented)
   - Verify data persists in the database

3. **User Interface Responsiveness**:
   - Test the application on different screen sizes (desktop, tablet, mobile)
   - Verify React components render correctly
   - Check that TypeScript types are working (no type errors in IDE)

### Development Workflow Validation
- **ALWAYS** run the full build after making changes: `npm run build`
- **ALWAYS** check that the production build starts successfully: `npm run start`
- **ALWAYS** run tests to ensure no regressions: `npm test`

## Common Tasks

### Working with Database Schema
- View current database schema: `npx prisma db pull`
- Reset database: `npx prisma migrate reset` -- takes 1-3 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
- View database in browser: `npx prisma studio` -- opens on port 5555

### Working with Next.js
- Clear Next.js cache: `rm -rf .next`
- View build analysis: `npm run analyze` (if configured)
- Check bundle sizes and optimization opportunities in the build output

### Debugging and Development
- View detailed error logs in browser console when running `npm run dev`
- Use React Developer Tools browser extension for component debugging
- Check network tab for API calls and Prisma queries
- TypeScript errors will show in the terminal during development

## Key Project Structure

**NOTE: The following are typical locations for this type of project. Verify actual paths exist:**

```
/
├── pages/          # Next.js pages (or app/ directory if using App Router)
├── components/     # Reusable React components  
├── lib/           # Utility functions and configurations
├── prisma/        # Database schema and migrations
├── public/        # Static assets
├── styles/        # CSS/styling files
├── types/         # TypeScript type definitions
└── __tests__/     # Test files
```

### Frequently Modified Files
- **Always check these locations when making changes:**
  - `pages/api/` - API routes and database interactions
  - `prisma/schema.prisma` - Database schema changes
  - `components/` - UI component changes
  - `lib/` - Shared utilities and helpers

## Build and Deployment

### CI/CD Considerations
- GitHub Actions workflow likely exists in `.github/workflows/`
- Build process includes: type checking, linting, testing, and production build
- Database migrations may run automatically in deployment pipeline

### Performance Notes
- Next.js builds are optimized and include automatic code splitting
- Prisma generates optimized database queries
- Build times increase with project size - expect 2-15 minutes for full builds
- **NEVER CANCEL** long-running builds or tests

## Troubleshooting

### Common Issues
- **Database connection errors**: Check `.env` file and database availability
- **Build failures**: Run `npm run type-check` to identify TypeScript issues
- **Module not found**: Run `npm install` to ensure all dependencies are installed
- **Port already in use**: Kill existing processes or use different port with `npm run dev -- -p 3001`

### When Things Don't Work
1. Clear all caches: `rm -rf node_modules .next && npm install`
2. Reset database if needed: `npx prisma migrate reset`
3. Verify Node.js version compatibility
4. Check for environment variable configuration in `.env`

**Remember: This is a modern React/Next.js/TypeScript stack. Changes should leverage the type system, follow React best practices, and consider database schema impacts when working with Prisma.**