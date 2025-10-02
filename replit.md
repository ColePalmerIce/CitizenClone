# First Citizens Bank

## Overview

"First Citizens Bank" is a modern, responsive banking website built with React and Express, offering a comprehensive digital platform. It provides personal and business banking, wealth management, and customer service with features like interactive search, credit card recommendations, account opening workflows, and secure login. The project aims to deliver a realistic and feature-rich banking experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React 18 with TypeScript.
- **Build & Routing**: Vite for development and optimized builds, Wouter for client-side routing.
- **Styling**: Tailwind CSS and shadcn/ui for accessible components.
- **State Management**: TanStack Query for server state management, React Hook Form with Zod for validation.

### Backend
- **Server**: Express.js for RESTful API services with logging and error handling.
- **Data Storage**: Drizzle ORM for type-safe PostgreSQL interactions (Neon Database), with an in-memory fallback for development.
- **API Structure**: Modular routes for banking services.
- **Security**: Session-based authentication using Express session with a PostgreSQL store, AES-256-CBC encryption for sensitive data (SSN, PII) with scrypt-derived keys and per-record salting.

### Core Features
- **Authentication**: Modal-based login, user management, two-factor authentication.
- **Financial Services**: Account creation (checking, savings, business), transaction history, domestic (ACH) and international (SWIFT) wire transfers.
- **Admin Panel**: Tools for customer onboarding, account provisioning, user data editing, and access code management.
- **UI/UX**: Professional currency formatting, enhanced display of customer/account details, improved form experiences with flexible input formatting.

### System Design
- **Monorepo Structure**: Shared TypeScript types and schemas for full-stack type safety.
- **Modular Design**: Facilitates extension of banking services and integration with external systems.
- **Development/Production Modes**: Configured for different environments, including static file serving for production.

## External Dependencies

- **Neon Database**: Cloud PostgreSQL service.
- **Radix UI**: Headless component library.
- **Lucide Icons**: Icon library.
- **Unsplash Images**: Stock photography service.
- **Google Fonts**: Typography (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter).