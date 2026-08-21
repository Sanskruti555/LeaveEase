# LeaveEase

A full-stack, multi-tenant Leave Management System built for organizations to manage employee leave requests, approvals, and balances across multiple companies and branches — with role-based access control from Super Admin down to Employee.

---

## 📌 Overview

LeaveEase solves a problem every growing organization faces: tracking leave requests, approvals, and balances across multiple teams and branches without spreadsheets or manual back-and-forth. It supports multiple companies on a single platform (multi-tenancy), each with its own branches, roles, and leave policies — fully isolated from one another.

Built end-to-end: database design, authentication, authorization, business logic, and a React frontend — containerized with Docker for consistent local and production environments.

---

## ✨ Key Features

**Authentication & Access**
- Secure registration and login with JWT-based authentication
- Email OTP verification on signup
- Forgot/reset password flow via OTP
- Role-Based Access Control (RBAC): `SUPER_ADMIN`, `BRANCH_ADMIN`, `MANAGER`, `EMPLOYEE`

**Multi-Tenant Architecture**
- Companies and branches modeled as first-class entities
- Users scoped correctly to their company, branch, and manager
- Full tenant isolation enforced at the API level

**Invitations**
- Role-controlled invitation system with secure, expiring tokens
- Email delivery of invitation links
- Token resend and rotation
- Invitation cancellation
- Security-tested against expired, reused, and cancelled tokens

**Leave Management**
- Employees can apply for leave (full-day and half-day)
- Leave request validation (dates, duration, reason, type)
- Overlap detection to prevent duplicate/conflicting requests
- Managers can view, approve, or reject their team's requests with reasons
- Atomic, transactional balance deduction on approval — no race conditions on concurrent requests
- Employees can cancel eligible leave requests
- Employees can view allocated, used, and available leave balances

**Frontend**
- Role-based dashboards for Employee, Manager, Branch Admin, and Super Admin
- Protected routes with role-based redirects
- Built with React, Vite, and React Router

**Deployment**
- Fully Dockerized — frontend, backend, and database run via Docker Compose
- Environment-based configuration for local vs. production

---

## Tech Stack

| Layer          | Technology                              |
|----------------|------------------------------------------|
| Frontend       | React, Vite, React Router                |
| Backend        | Node.js, Express.js                      |
| Database       | MySQL                                    |
| Auth           | JWT, bcrypt (password hashing)           |
| Email          | OTP-based verification & invitations     |
| Containerization | Docker, Docker Compose                 |

---

## Architecture

LeaveEase uses a multi-tenant schema where every core entity — users, branches, leave requests, balances — is scoped to a `company_id`, ensuring complete data isolation between organizations on the same platform.

**Role hierarchy:**
```
SUPER_ADMIN   → manages enterprise branches, staff invitations, and users across the organization
BRANCH_ADMIN  → manages users, invitations, and leave types within a branch
MANAGER       → approves/rejects leave for their direct reports
EMPLOYEE      → applies for leave, views balance and history
```

Leave approval is handled as an atomic database transaction with row-level locking, ensuring that concurrent approval attempts on the same leave balance never result in over-deduction or inconsistent state.

---

## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Node.js (v18+) — only needed for local development outside containers

### Run with Docker (recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd leaveease

# Copy environment file and fill in your values
cp .env.example .env

# Build and start all services (frontend, backend, database)
docker-compose up --build
```

The app will be available at:
- Frontend: `http://localhost:<frontend-port>`
- Backend API: `http://localhost:<backend-port>`

### Environment Variables

Create a `.env` file based on `.env.example` with values such as:

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASSWORD=
FRONTEND_URL=
```

### Manual Setup (without Docker)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
leaveease/
├── Backend/
│   ├── database/
│   ├── node_modules/
│   ├── src/
│   ├── uploads/
│   ├── .env
│   ├── Dockerfile
│   ├── package-lock.json
│   └── package.json
├── Frontend/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📸 Screenshots

> _Add screenshots or a short GIF walkthrough of the Employee, Manager, Branch Admin, and Super Admin dashboards here._

Login Page:
 ./assets/Login.png

Super Admin Dashboard:
./assets/Login.png

Barnch Admin Dashboard:
./assets/Branchadmin.png

Manager Dashboard
.assets/Manager.png

Employee dashboard
.assets/Employee.png 
---

## 🗺️ Roadmap

- [ ] Notification system for request/approval events
- [ ] Audit logging for administrative actions
- [ ] Reports & analytics dashboard for leave usage
- [ ] Attachment support for leave types requiring documentation
- [ ] Leave allocation with yearly carry-forward rules
- [ ] UI/UX refinements and visual redesign for enhanced dashboard aesthetics
---

## 📄 License

This project was built as a personal portfolio project.
