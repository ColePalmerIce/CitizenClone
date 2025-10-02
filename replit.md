# replit.md

## Overview

This project is a modern, responsive banking website named "First Citizens Bank," built with React and Express. It provides a comprehensive digital banking platform offering personal and business banking, wealth management, and customer service. Key capabilities include interactive search, credit card recommendations, account opening workflows, and secure login functionalities. The project aims to deliver a realistic and feature-rich banking experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Frameworks**: React 18 with TypeScript for robust, type-safe UI development.
- **Build & Routing**: Vite for fast development and optimized builds, Wouter for lightweight client-side routing.
- **Styling**: Tailwind CSS for utility-first styling combined with shadcn/ui for accessible, pre-built components.
- **State Management**: TanStack Query for server state management and caching, React Hook Form with Zod for form validation.

### Backend
- **Server**: Express.js for RESTful API services, including middleware for logging and error handling.
- **Data Storage**: Drizzle ORM for type-safe PostgreSQL interactions (Neon Database), with an in-memory fallback for development.
- **API Structure**: Modular routes for various banking services (search, applications, contact).
- **Security**: Session-based authentication using Express session with a PostgreSQL store, AES-256-CBC encryption for sensitive data (SSN, PII) with scrypt-derived keys and per-record salting.

### Core Features
- **Authentication**: Modal-based login, comprehensive user management, two-factor authentication with user-bound access codes.
- **Financial Services**: Account creation (checking, savings, business) with unique routing numbers, comprehensive transaction history, domestic (ACH) and international (SWIFT) wire transfer capabilities with fee transparency and reference number generation.
- **Admin Panel**: Tools for customer onboarding, account provisioning, editing user data, and managing access codes.
- **UI/UX**: Professional currency formatting (`$75,000.00`), enhanced display of customer and account details, and improved form experiences with flexible input formatting (phone, SSN).

### System Design
- **Monorepo Structure**: Shared TypeScript types and schemas ensure full-stack type safety.
- **Modular Design**: Facilitates easy extension of banking services and integration with external financial systems.
- **Development/Production Modes**: Configured for different environments, including static file serving for production.

## External Dependencies

- **Neon Database**: Cloud PostgreSQL service for primary data persistence.
- **Radix UI**: Headless component library for building accessible UI components.
- **Lucide Icons**: Icon library for consistent visual elements.
- **Unsplash Images**: Service for stock photography used in the application.
- **Google Fonts**: Used for typography (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter).

## Recent Changes

### October 2, 2025 - Wire Transfer Fixes & Bank Dropdown Enhancements
- **Wire Transfer Forms Fixed**: Added all required fields for domestic and international wire transfers including recipientBankAddress, beneficiaryAddress, beneficiaryAccountType (for domestic), and beneficiaryCountry (for international)
- **Bank Dropdown Selector**: Replaced text inputs with dropdown selectors for recipient bank selection featuring comprehensive list of 40+ major US banks (Bank of America, Wells Fargo, Chase, Citibank, etc.)
- **Form Validation**: Enhanced submit button validation to require ALL mandatory fields before enabling wire transfer submission
- **Mobile Responsive**: Wire transfer forms use responsive grid layouts (single column on mobile, two columns on desktop) for optimal mobile experience
- **Bank Logo**: Verified First Citizens Bank logo displays correctly on both admin and user dashboards

### October 2, 2025 - User Profile Editing & Bug Fixes
- **Profile Editing Feature**: Users can now edit their profile information including date of birth, phone number, and address (street, city, state, ZIP) through the "My Profile" dialog
- **Edit Mode UI**: Profile dialog switches between view mode (read-only display) and edit mode (editable inputs) with Save/Cancel buttons for a smooth editing experience
- **Backend API**: Added PATCH `/api/user/profile` endpoint for updating customer profiles using the correct storage methods (getCustomerProfileByUserId, updateCustomerProfileByUserId)
- **Customer Creation Bug Fix**: Fixed admin panel error "Failed to create comprehensive customer account" when creating customers with custom account creation dates - now creates user first, then updates createdAt using updateUserCreatedAt method

### October 2, 2025 - Critical Bug Fixes (Wire Transfers, Profile, Balance Display)
- **Wire Transfer Tables Created**: Created domestic_wire_transfers and international_wire_transfers database tables via SQL to enable wire transfer functionality
- **Profile API Fixed**: Corrected profile endpoints to use proper storage method names (getUser instead of getUserById, getCustomerProfile instead of getCustomerProfileByUserId) - profile editing now saves correctly
- **Balance Display Fixed**: Updated account balance rendering to always display as positive values using Math.abs() with proper 2-decimal formatting ($46,000.00 instead of potential negative values)