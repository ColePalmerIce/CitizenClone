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

### September 28, 2025 - Professional UI Enhancements & Currency Formatting Complete
- **Professional Currency Formatting**: Implemented comprehensive USD currency formatting across all admin dashboard monetary displays using Intl.NumberFormat with proper dollar signs, commas, and cents (e.g., $75,000.00)
- **Enhanced Customer Details Display**: Added complete employment information section to customer details modal showing employer, job title, employment type, and formatted annual income
- **Improved Account Applications View**: Enhanced account applications display to show comprehensive employment information including employer, job title, annual income, and employment type with proper formatting
- **Consistent Monetary Display**: Fixed all monetary amounts throughout admin interface including initial deposits, annual income displays, and fund/withdraw button labels to use standardized USD formatting
- **Professional Form Enhancement**: Improved annual income input field in customer creation form with visual dollar sign prefix and comma-formatted placeholder for better user experience
- **Admin Welcome Message**: Enhanced admin dashboard welcome message with bold, clear white text and shadow effects for better visibility against the gradient background

### September 28, 2025 - Banking-Compliant Security & Comprehensive Admin Panel Complete
- **Production-Grade Encryption System**: Implemented AES-256-CBC encryption with proper IV handling for sensitive customer data (SSN, PII) using crypto.createCipheriv with 32-byte scrypt-derived keys
- **Banking Compliance Security**: Per-record salting with 32-byte random salts and PBKDF2 (100k iterations) for secure hashing, production safeguards prevent fallback to development keys
- **Comprehensive Customer Creation**: Enhanced admin panel with complete banking onboarding form collecting personal details, address, employment information, SSN, and account preferences
- **Auto-Generation Workflow**: Complete account provisioning system automatically generating checking, savings, and business accounts with unique routing numbers (053100300, 067092022, 113024588) and initial funding transactions
- **Enhanced Schema Validation**: Comprehensive Zod schema validation with field-level validation for SSN format, age verification, phone format, employment type, and financial data
- **Professional Admin Interface**: Streamlined customer creation with encrypted data storage, auto-generated login credentials, and comprehensive account summary for administrators
- **Security Infrastructure**: Added decryption capabilities, sensitive data verification functions, and proper error handling for banking-grade data protection

### September 27, 2025 - Professional External Transfer Modal Complete
- **Comprehensive Banking Details Collection**: Enhanced main Transfer Money modal to collect complete banking information for external transfers including bank name, routing number, account type, recipient details, phone number, and complete address
- **Professional Form Validation**: Implemented robust Zod schema validation with react-hook-form integration ensuring all banking fields are required and properly validated with field-level error messages
- **Industry-Standard Interface**: Updated UI labels to reflect required fields and created professional banking transfer experience matching real-world banking applications
- **Enhanced User Experience**: Proper form state management, validation feedback, and successful submission workflow with toast notifications and form reset functionality

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