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

### October 2, 2025 - Wire Transfer Business Account & Comprehensive Country List
- **Business Account Type Support**: Added "business" as a valid account type option in both domestic and international wire transfer forms, alongside checking and savings accounts
- **Zod Validation Updated**: Updated `enhancedTransferSchema` to include "business" in account type enum validation to ensure forms accept and submit business account transfers
- **Comprehensive ISO 3166-1 Country List**: Replaced limited country dropdown with complete ISO 3166-1 list containing all 249 countries, sorted alphabetically for international wire transfers
- **Database Schema Compatibility**: Verified database schemas (domesticWireTransfers, internationalWireTransfers) use text fields that accept all account type values including "business"
- **Application Stability**: Fixed file structure issues and ensured no syntax errors or runtime issues after implementation

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

### October 2, 2025 - Transaction History Generation with Current Dates
- **Dynamic Date Generation**: Fixed transaction history to generate dates from 3 months ago until today (instead of hardcoded September 2025)
- **Accurate Balance Calculation**: Updated seeding to work backwards from current account balance, ensuring perfect balance accuracy
- **Transaction Date Logic**: Modified getTransactionsForMonth() to use `new Date()` as base and subtract monthOffset months dynamically
- **Balance Verification**: Added verification to ensure final transaction balance matches current account balance within 1 cent tolerance
- **Clean Transaction History**: Seeding now deletes existing transactions first to prevent duplicates and ensure consistent data

### October 2, 2025 - Phone Number Encryption Fix for Profile Display
- **Phone Number Encryption**: Changed phone numbers from one-way hashing to reversible encryption (AES-256-CBC like SSN), allowing decryption for display purposes
- **Encryption Functions**: Added `encryptPhoneNumber()` and `decryptPhoneNumber()` functions using same secure encryption as SSN with random IV per record
- **Profile GET Endpoint**: Updated `/api/user/profile` to decrypt phone numbers before returning to frontend - users now see their actual phone number instead of encrypted gibberish
- **Profile PATCH Endpoint**: Updated profile editing to format and encrypt phone numbers on save, maintaining security while enabling proper display
- **Admin Customer Creation**: Changed from `hashSensitiveData()` to `encryptPhoneNumber()` when creating customers - all new customers get encrypted (not hashed) phone numbers
- **Backward Compatibility**: Decryption function gracefully handles old hashed phone numbers by returning "Not available" if decryption fails
- **User Experience**: Users can now view and edit their phone numbers correctly in the "My Profile" dialog, seeing formatted numbers like "(555) 123-4567" instead of encrypted strings

### October 2, 2025 - User Profile Access Control & Balance Calculation Verification
- **Profile View-Only for Users**: Removed user ability to edit their own profiles - users can only view their profile information, all editing restricted to admin panel
- **Admin-Only Editing**: Only administrators can edit customer profiles through the admin dashboard customer management interface
- **Wire Transfer Balance Verification**: Verified all wire transfer approval logic is mathematically accurate: `newBalance = currentBalance - transferAmount` with proper account updates
- **Transaction Seeding Accuracy**: Confirmed transaction history generation uses correct backwards calculation: `Starting Balance = Current Balance - Total Credits + Total Debits`, ensuring perfect balance accuracy
- **Balance Calculation Audit**: All financial calculations verified to be mathematically sound with proper debit/credit logic throughout the application

### October 2, 2025 - Comprehensive Transaction History for All Account Types
- **All Account Types Get Transaction History**: Checking, savings, AND business accounts now automatically receive 3 months of professional transaction history when created
- **Account-Specific Transactions**: Each account type receives appropriate transactions:
  - **Checking Accounts**: Payroll deposits, grocery purchases, restaurant expenses, utilities, gas, retail purchases, ATM withdrawals, mortgage payments
  - **Savings Accounts**: Monthly interest payments, transfers from checking, direct deposits, ATM withdrawals, transfers to checking
  - **Business Accounts**: Client payments/invoices, payroll processing, office rent, office supplies, internet/phone services, business insurance, vendor payments (software, marketing)
- **Custom Join Date Support**: Admin can specify custom account creation date when creating customers - transaction history respects this date (generates from 3 months before join date to join date)
- **Automatic Seeding**: Transaction history automatically seeds during customer creation for all accounts with positive initial balances - no manual seeding required
- **Balance Accuracy**: All account types use the same backwards calculation method ensuring perfect mathematical accuracy for transaction history across all account types
- **Reference Date Integration**: Transaction seeding uses user's createdAt timestamp as reference date, ensuring historical accuracy for backdated accounts

### October 2, 2025 - Real-Time Statistics & Account Application Management  
- **Accurate Customer Count**: Fixed customer statistics to only count active users (status='active'), excluding blocked and deleted accounts - customer count now updates in real-time
- **Account Application Delete**: Added delete functionality for account applications with confirmation dialogs - applications can be deleted from both pending and processed sections
- **User Blocking System**: Implemented user blocking with login prevention - blocked users receive clear error message "Your account has been blocked. Please contact support for assistance."
- **User Deletion Protection**: Deleted users cannot access their accounts - login attempt shows "This account has been deleted and cannot be accessed."
- **Admin User Management**: Added backend routes for blocking (`POST /api/admin/block-user/:userId`), unblocking (`POST /api/admin/unblock-user/:userId`), and deleting users (`DELETE /api/admin/delete-user/:userId`)
- **Real-Time Stats Updates**: Dashboard statistics automatically refresh when users are created, approved, blocked, deleted, or unblocked - ensuring always accurate counts
- **User Restoration**: Only administrators can unblock or restore user accounts to allow login again
- **Status Tracking**: User status changes tracked with reason, admin ID who made the change, and timestamp for full audit trail