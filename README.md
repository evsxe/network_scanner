# Scanner1726 - Cybersecurity Dashboard

A modern, responsive web application for managing security scans, targets, and vulnerabilities. This dashboard provides security professionals with tools to monitor, analyze, and respond to security threats across their infrastructure.

## Features

- **Authentication System**: Secure login with JWT token-based authentication
- **Target Management**: Add, edit, and delete scanning targets with support for Active Directory credentials
- **Scan Management**: Create, start, stop, and monitor security scans
- **Vulnerability Tracking**: View and analyze detected vulnerabilities by severity
- **Real-time Updates**: Monitor active scans and their progress
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Eye-friendly dark interface for security operations centers

## Technology Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Access to the Scanner1726 backend API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/scanner1726.git
cd scanner1726
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://your-api-url/api
```
## Running the Application
### Development Mode

To run the application in development mode with hot-reloading:
```bash
npm run dev
# or
yarn dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

To create an optimized production build:
```bash
npm run build
# or
yarn build
```

To start the production server:
```bash
npm run start
# or
yarn start
```
The application will be available at [http://localhost:3000](http://localhost:3000).

Project Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── api-config.ts     # API configuration and auth helpers
│   ├── auth-api.ts       # Authentication API service
│   ├── auth-context.tsx  # Authentication context provider
│   ├── cybersecurity-dashboard.tsx  # Main dashboard component
│   ├── finding-api.ts    # Findings API service
│   ├── layout.tsx        # Root layout component
│   ├── login-page.tsx    # Login page component
│   ├── page.tsx          # Root page component
│   ├── profile-page.tsx  # User profile page
│   ├── scan-api.ts       # Scans API service
│   ├── scan-dialog.tsx   # Scan creation dialog
│   ├── scan-info-dialog.tsx  # Scan details dialog
│   ├── target-api.ts     # Targets API service
│   ├── target-dialog.tsx # Target creation/edit dialog
│   ├── target-filters.tsx # Target filtering component
│   └── types.ts          # TypeScript interfaces
├── components/           # UI components (shadcn)
├── public/               # Static assets
├── styles/               # Global styles
├── .env.local            # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## API Integration

The dashboard connects to a RESTful API for all data operations. The API endpoints are defined in the Swagger specification and include:

- Authentication endpoints (`/api/auth`, `/api/register`)
- Target management endpoints (`/api/target/*`)
- Scan management endpoints (`/api/scan/*`)
- Finding retrieval endpoints (`/api/finding/*`)
- Task management endpoints (`/api/task/*`)

## Authentication

The application uses JWT (JSON Web Token) for authentication. Upon successful login, a token is stored in the browser's localStorage and included in the Authorization header for all subsequent API requests.

## Development Guidelines

- **Code Style**: Follow the existing code style and use TypeScript for type safety
- **Component Structure**: Create reusable components in the components directory
- **API Services**: Keep API calls in dedicated service files
- **State Management**: Use React Context for global state, component state for local state
- **Error Handling**: Implement proper error handling for all API calls