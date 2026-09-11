# Task_Management_System

TaskFlow is a top MNC / Apple-inspired enterprise Task Management System engineered with React (Vite) and Node.js (Express + MongoDB).

## Features

- **Apple-Inspired Enterprise UI**: Minimal, clean, high-trust light design system with 8px rhythm and Lucide React outline icons.
- **Single Common Login Portal**: Automatic role detection routing Administrators to `/admin/dashboard` and Employees to `/employee/dashboard`.
- **Admin-Controlled Employee Management**: Enterprise staff directory with persistent MongoDB CRUD, structured fields, and filtering.
- **Strict Role-Based Access Control (RBAC)**: Enforced across client route guards and backend middleware.
- **Automated Email Notifications**: Real-time task assignments and employee status updates dispatched via Nodemailer Gmail SMTP.
- **Comprehensive Dashboards**: Equal-height KPI metric cards, deliverable progress bars, and recent activity streams.

## Project Structure

```
Task Management/
├── client/              # React (Vite) frontend with Apple-inspired UI
│   ├── src/
│   │   ├── components/  # Reusable UI, layout, table & modal components
│   │   ├── pages/       # Admin, Employee, and Common pages
│   │   ├── routes/      # ProtectedRoute & AppRoutes with RBAC
│   │   ├── services/    # Axios API services
│   │   └── styles/      # Enterprise light design system CSS
│   └── package.json
├── server/              # Express REST API backend
│   ├── src/
│   │   ├── controllers/ # Auth, Task, Employee & Dashboard handlers
│   │   ├── models/      # MongoDB Mongoose schemas (User, Task, etc.)
│   │   ├── routes/      # Express API routes
│   │   └── services/    # Email & database services
│   └── package.json
└── package.json         # Root orchestrator scripts
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB database
- npm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mounika462006/Task_Management_System.git
   cd Task_Management_System
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

Configure `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM="TaskFlow System" <your_email@gmail.com>
ADMIN_EMAIL=admin.taskflow@gmail.com
ADMIN_PASSWORD=Admin@taskflow
```

### Running Locally

- Start the backend server:
  ```bash
  cd server
  npm run dev
  ```

- Start the frontend dev server:
  ```bash
  cd client
  npm run dev
  ```

- Or from the root directory:
  ```bash
  npm run server
  npm run client
  ```
