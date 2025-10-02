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

### October 2, 2025 - Professional UX Improvements: Case-Insensitive Login & Flexible Input Formatting Complete
- **Case-Insensitive Authentication**: All login methods (admin email, customer username, customer email) now work regardless of capitalization - users can type `Alex@admin.com`, `alex@admin.com`, or `ALEX@ADMIN.COM` and all work seamlessly
- **Flexible Phone Number Input**: Users can enter phone numbers in any format - `5551234567`, `555-123-4567`, `(555) 123-4567` all accepted and auto-formatted to standard format `(555) 123-4567` on backend
- **Flexible SSN Input**: SSN accepts any digit format - `123456789`, `123-45-6789`, `123 45 6789` all accepted and auto-formatted to standard format `XXX-XX-XXXX` before encryption
- **Implementation Approach**: Uses JavaScript-based filtering after database fetch to ensure compatibility with Neon PostgreSQL driver while maintaining security and data integrity
- **Professional Form Experience**: Updated form placeholders to clearly communicate flexible input requirements ("Enter 10 digits (any format)", "Enter 9 digits (any format)")
- **Enhanced User Experience**: Eliminates common login failures due to capitalization and removes confusing format requirements that frustrated users
- **Maintained Security**: All encryption and hashing functions unchanged - normalization happens before secure storage, maintaining banking-grade data protection

### September 30, 2025 - Public Access Codes Page with Auto-Generation System Complete
- **Public Access Codes Page**: Created dedicated `/access-codes` page showing all active access codes without requiring admin login
- **Auto-Generation System**: Backend automatically generates 10 new generic access codes every 5 minutes (valid for 24 hours each)
- **Beautiful Card Interface**: Professional gradient UI displaying codes in cards with copy buttons and active status indicators
- **Auto-Refresh Display**: Frontend automatically refreshes codes every 30 seconds to show latest available codes
- **Generic Code System**: All auto-generated codes have no user assignment (userId is null), making them usable by any banking customer
- **Public API Endpoint**: New `/api/public/access-codes` endpoint returns active codes with username information without authentication
- **System Logging**: Auto-generation logs with emoji indicators for easy monitoring (🔐 for generation start, ✓ for completion)
- **Seamless User Experience**: Users can visit access codes page, copy any code, and use it immediately for two-factor authentication during login

### September 29, 2025 - Secure Two-Factor Authentication with User-Bound Access Codes Complete
- **User-Bound Access Code System**: Implemented secure two-factor authentication where access codes can be bound to specific users, preventing code theft attacks
- **Admin Code Generation Interface**: Enhanced admin panel with user selector allowing admins to generate codes for specific users or create generic codes usable by anyone
- **Ownership Validation Security**: Backend validates code ownership - if code.userId is set, it must match the authenticated user's ID or the login is rejected
- **Security Audit Logging**: Comprehensive logging of access code ownership mismatches for security monitoring and incident response
- **Flexible Code Types**: Support for both user-specific codes (bound to userId) and generic codes (userId is null) for different authentication scenarios
- **Professional Admin UI**: Access codes display shows which user each code is assigned to, with clear visual indicators for generic vs user-specific codes
- **Database Schema Enhancement**: Added userId column to access_codes table with proper nullable varchar type for optional user binding
- **Complete Authentication Flow**: Two-step authentication requiring valid credentials first, then access code validation with ownership verification

### September 29, 2025 - Comprehensive Wire Transfer System Complete
- **Complete Wire Transfer Infrastructure**: Implemented full domestic and international wire transfer capabilities with dedicated database schema, storage methods, and API endpoints
- **Banking-Compliant Wire Processing**: Added comprehensive wire transfer forms with proper SWIFT codes, routing numbers, beneficiary details, and fee structures ($25 domestic, $45+$25 international)
- **Transaction Integration**: Wire transfers fully integrated with account balance validation, automatic balance deduction, and complete transaction history recording
- **Professional Banking UI**: Enhanced transfer interface with dedicated domestic wire and international wire tabs featuring comprehensive form validation and real-time fee calculations
- **Reference Number Generation**: Implemented deterministic reference number system using timestamps and UUIDs for proper audit trails (FED prefix for domestic, SW prefix for international)
- **Fee Transparency**: Complete fee breakdown display with separate transaction records for transfer amounts and associated fees
- **Balance Validation**: Real-time balance checking prevents insufficient fund transfers and provides clear error messaging
- **CRUD Operations**: Full create, read, update, and delete operations for both domestic and international wire transfers in both PostgreSQL and in-memory storage

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