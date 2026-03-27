# CareBridge - Frontend

CareBridge is a modern healthcare platform designed to streamline patient billing and provide flexible installment payment options. This repository contains the frontend implementation of the platform.

## 🔗 Backend Repository
**Backend Repo:** [https://github.com/CareBridge1/backend](https://github.com/CareBridge1/backend)

## 🚀 Tech Stack
- **Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & [Remix Icons](https://remixicon.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Custom Mira Style)
- **State Management:** React Hooks
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts

## ✨ Key Features
- **Flexible Installments:** Healthcare providers can divide large medical bills into 1, 2, 3, or 6-month payment plans.
- **Secure Payment Portal:** Integrated with **Interswitch** for safe and reliable transactions.
- **Real-time Tracking:** Dashboard for hospitals to track payment statuses, installments, and outstanding balances.
- **WhatsApp Integration:** Easily share payment links with patients via WhatsApp or email.
- **Automated OTP:** Secure patient verification via email-based OTP (Nodemailer).

## 🏗️ Project Architecture
The platform follows a modern client-server architecture:
- **Frontend:** A responsive Single Page Application (SPA) built with React and Vite, featuring a premium UI designed for healthcare environments.
- **Backend:** A robust REST API built with Node.js and Express, using Prisma ORM to communicate with a PostgreSQL database.
- **Deployment:** Optimized for Vercel with automated Prisma client generation and SPA routing support.

## 🛠️ Getting Started

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) (v20+) and [npm](https://www.npmjs.com/) installed.

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Environment Setup
The frontend communicates with the backend via a base API URL configured in the services. Ensure your backend is running on `http://localhost:4000` (default) or update your environment configuration.

### 4. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🔑 Login & Demo
To test the platform as a hospital administrator:
1.  Register a new hospital account via the **Sign Up** page.
2.  Log in with your credentials to access the dashboard.
3.  From the dashboard, you can generate secure payment links for patients.

## 👥 Contributors 
*   **Ahmad Ismail** - Full Stack Engineer
*   **Ikhahon Robinson Osamhanhiemen** - UI/UX Designer
*   **IGHEDOSA PROMISE IRIOBOSA** - Frontend Engineer
*   **AMUNE VICTOR EFI** - Frontend Engineer
