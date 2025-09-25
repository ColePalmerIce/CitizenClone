# replit.md

## Overview

This is a modern banking website built with React and Express, featuring a responsive design and comprehensive financial services interface. The application serves as a digital banking platform for "First Citizens Bank" with sections for personal banking, business banking, wealth management, and customer service tools. It includes interactive features like search functionality, credit card recommendation tools, account opening workflows, and login capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Routing**: Lightweight client-side routing library for navigation
- **Tailwind CSS + shadcn/ui**: Utility-first CSS framework with pre-built accessible components
- **TanStack Query**: Server state management for API calls and caching
- **React Hook Form**: Form validation and state management with Zod schema validation

### Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging and error handling
- **Memory Storage**: In-memory data storage implementation with interface for future database integration
- **Modular Route Structure**: Organized API endpoints for search, applications, and contact inquiries
- **Development/Production Modes**: Different configurations for development (with Vite middleware) and production (static file serving)

### Data Storage Solutions
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Cloud PostgreSQL database service integration
- **Schema Definition**: Centralized database schema with tables for users, search queries, credit card applications, account applications, and contact inquiries
- **In-Memory Fallback**: Memory storage implementation for development and testing

### Authentication and Authorization
- **Session-based Authentication**: Express session management with PostgreSQL session store
- **Modal-based Login**: Frontend login interface with support for multiple banking service types
- **User Management**: Complete user schema with username, email, and profile information

### External Dependencies
- **Neon Database**: PostgreSQL cloud database service
- **Radix UI**: Headless component library for accessible UI primitives
- **Lucide Icons**: Icon library for consistent visual elements
- **Unsplash Images**: External image service for stock photography
- **Google Fonts**: Web font service for typography (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)

The architecture follows a monorepo structure with shared TypeScript types and schemas between frontend and backend, enabling type safety across the full stack. The modular design allows for easy extension of banking services and integration with external financial systems.

## Recent Changes

### September 25, 2025 - Enhanced Banking Features Complete
- **Fixed Transaction History Display Bug**: Resolved frontend API query issue that was preventing transaction histories from displaying despite data existing in database
- **Comprehensive Account Details**: All accounts now clickable with full transaction history showing exact calculations for each balance
- **Realistic Routing Numbers**: Different routing numbers per account type (Checking: 053100300, Savings: 067092022, Business: 113024588)
- **Complete Transaction Histories**: 20 realistic transactions across all accounts totaling exactly $150,000
- **Advanced Transfer System**: Both domestic (ACH) and international (SWIFT) transfer capabilities with proper processing times
- **Perfect Balance Calculations**: 
  - Checking: $50,000 (8 transactions from $75K initial minus expenses)
  - Savings: $25,000 (5 transactions from $20K plus interest/transfers)  
  - Business: $75,000 (7 transactions from $50K plus client payments minus business expenses)
- **Professional Banking UI**: Account detail modals, tabbed transfer interface, and realistic banking references