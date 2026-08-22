import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit"; // 1. Import rate-limit
import helmet from "helmet";

import authRoutes from "./modules/auth/auth.routes.js";
import invitationRoutes from "./modules/invitations/invitation.routes.js";
import leaveRoutes from "./modules/leave/leave.routes.js";
import leaveTypeRoutes from "./modules/leaveTypes/leaveType.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import branchRoutes from "./modules/branch/branch.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));

app.use(express.json());

// 2. Configure general API rate limiter (e.g., 100 requests per 15 minutes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." }
});

// 3. Configure strict rate limiter for auth/login routes to prevent brute-forcing
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Limit to 10 attempts per 15 minutes
    message: { success: false, message: "Too many login attempts, please try again later." }
});

// 4. Apply general limiter to all API endpoints, and strict limiter specifically to auth
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter); // Stricter protection specifically on login

app.use("/api/invitations", invitationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;