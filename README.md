# 🚀 AI-Driven Full-Stack Next.js Project

This project is an experimental endeavor designed to test the capabilities of **Webstorm's AI Chat** (powered by Junie).  
Every single line of code, configuration, and documentation in this repository was generated **100% by AI**, demonstrating the potential of AI-assisted software development.

## 🎯 Project Objective
The primary goal was to evaluate how effectively an AI assistant can architect, implement, and refactor a full-stack Next.js application from scratch. This includes:
- Complex database modeling and migrations.
- Secure authentication and session management.
- Robust server-side logic and API route design.
- Modern, responsive UI implementation using industry-standard component libraries.

## 🛠️ Tech Stack
- **Framework:** [Next.js 16.1.3](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **UI & Styling:** [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS 4, Lucide React
- **Database:** MySQL 8.0
- **ORM:** [Prisma 6.19.2](https://www.prisma.io/)
- **Authentication:** JWT (via [jose](https://github.com/panva/jose))
- **Validation:** [Zod](https://zod.dev/)
- **Form Management:** React Hook Form
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## ✨ Key Features
- **Secure Authentication:**
  - Robust Sign-up and Sign-in flows with `bcryptjs` password hashing.
  - Secure Logout functionality that clears session cookies.
- **JWT Session Management:** Stateless authentication using HTTP-only, secure cookies for enhanced security.
- **Route Protection:** Next.js Middleware implemented to automatically protect authenticated routes and prevent duplicate logins.
- **Interactive Board (CRUD):**
  - **Create:** Validated post creation with automatic author linking.
  - **Read:** Dynamic list view and detailed post viewing.
  - **Update/Delete:** Permission-based actions (Edit/Delete buttons only visible and accessible to the original author).
- **Modern User Experience:** Sleek UI components from shadcn/ui and enhanced feedback via a custom-styled Sonner toast system.

## 🛡️ Error Handling Architecture
The project features a sophisticated, centralized error handling system designed for security and clarity:

- **Custom Error Hierarchy:**
  - `PublicError`: Base class for errors safe to display to users (e.g., `BadRequestError`, `UnauthorizedError`, `NotFoundError`).
  - `ServerError`: Base class for internal errors. These log detailed stack traces on the server but return a generic message to the client to prevent sensitive data leakage.
- **Unified API Handler:** All API routes use a consistent `handleApiError` utility, ensuring that every failure returns a standardized JSON response.
- **Full-Stack Validation:** Schemas defined in Zod are reused across both the frontend (client-side feedback) and backend (data integrity) for "Single Source of Truth" validation.

## 📦 Dependencies
### Core
- `next`: 16.1.3
- `react`: 19.2.3
- `@prisma/client`: 6.19.2
- `jose`: 6.1.3
- `zod`: 4.3.5

### UI & UX
- `tailwindcss`: 4.x
- `sonner`: 2.0.7
- `react-hook-form`: 7.71.1
- `lucide-react`: 0.562.0

---
**Disclaimer:** This project contains zero manual code edits. It is a pure manifestation of AI's capability in modern web development.
