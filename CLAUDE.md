# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Shardus Enterprise monitor server, a Node.js/Express application that monitors the health and status of nodes in a Shardeum blockchain network. It provides REST APIs for node reporting and a web interface for real-time network visualization.

## Essential Commands

### Development
```bash
npm install          # Install dependencies
npm run compile      # Compile TypeScript to JavaScript
npm start           # Start the server (runs build/src/server.js)
```

### Testing
```bash
npm test            # Run Jest tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint        # Run ESLint
npm run format-check # Check Prettier formatting
npm run fix         # Auto-fix code style issues
npm run format-fix  # Auto-fix formatting issues
```

### Building and Releasing
```bash
npm run compile     # Build TypeScript
npm run clean       # Clean build artifacts
npm run release:patch/minor/major # Production releases
npm run release:prerelease       # Pre-release versions
```

## Architecture

### Server Structure
The application runs two Express servers:
- **API Server (Port 3000)**: Handles node reporting and data retrieval endpoints
- **GUI Server (Port 3001)**: Serves web interface with Socket.io for real-time updates

### Key Components
- `src/server.ts` - Main entry point, initializes both servers
- `src/app.ts` - API server configuration
- `src/appGUI.ts` - GUI server configuration  
- `src/class/node.ts` - Core data management for all network nodes
- `src/api/` - API route definitions
- `src/controller/` - Endpoint logic for heartbeat, joining, reports, etc.

### Data Flow
1. Nodes report status via POST endpoints (`/joining`, `/joined`, `/active`, `/heartbeat`)
2. Monitor validates reports against archiver data
3. Node states are tracked: Joining → Syncing → Active → Removed/Crashed
4. Data is aggregated and served via GET endpoints for visualization

### Important Endpoints
- Health checks: `/is-alive`, `/is-healthy`
- Node reporting: `/api/heartbeat`, `/api/joining`, `/api/active`
- Data retrieval: `/api/report`, `/api/sync-report`, `/api/scale-report`
- See `docs/endpoint.md` for complete API documentation

## Development Notes

### TypeScript Configuration
- Output directory: `build/`
- Source directory: `src/`
- Extends Google TypeScript style configuration
- Strict mode is disabled

### Testing
- Uses Jest with ts-jest for TypeScript support
- Test files: `**/__tests__/**/*.ts` and `**/?(*.)+(spec|test).ts`
- Low coverage thresholds currently set (~2-3%)

### Logging
- Uses log4js with multiple log files in `logs/` directory
- Main logs: `appData.log`, `api.log`, `apiSimpleReport.log`

### Node Version
- Requires Node.js 18.19.1 (specified in engines)

### Key Dependencies
- Express for HTTP server
- Socket.io for WebSocket connections
- TypeScript for type safety
- Jest for testing
- ESLint and Prettier for code quality