# Dework Frontend

This is the frontend application for Dework, built with Next.js and TypeScript.

## Project Structure

The project uses both Next.js routing systems:

- **Pages Router** (`/src/pages`): Traditional Next.js routing
- **App Router** (`/src/app`): Modern Next.js routing with more features

### Key Directories

- `/src/components`: Reusable React components
  - `/src/components/pages`: Page-level components used by Pages Router
- `/src/app`: App Router pages and layouts
- `/src/pages`: Pages Router
- `/src/contexts`: React Context providers
- `/src/hooks`: Custom React hooks
- `/src/utils`: Utility functions
- `/src/types`: TypeScript type definitions
- `/src/config`: Configuration files

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## TypeScript Configuration

The project is fully configured for TypeScript, with:

- Path aliases for easy imports (e.g., `@/components/...`)
- Type definitions for third-party libraries
- Strict type checking

## Deployment

The application can be deployed to any platform that supports Next.js applications.

## Technology Stack

- **Next.js**: React framework for both server-side and client-side rendering
- **TypeScript**: Type-safe JavaScript
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Ethers.js**: Ethereum library for blockchain integration
- **WAGMI**: React hooks for Ethereum
- **Rainbow Kit**: Wallet connection UI 