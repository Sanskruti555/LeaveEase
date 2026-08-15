import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import invitationRoutes from "./modules/invitations/invitation.routes.js";
import leaveRoutes from "./modules/leave/leave.routes.js";
import leaveTypeRoutes from "./modules/leaveTypes/leaveType.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import branchRoutes from "./modules/branch/branch.routes.js";
import dashboardRoutes
    from "./modules/dashboard/dashboard.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/invitations", invitationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use(errorMiddleware);
app.use(
    "/api/leave-types",
    leaveTypeRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);
app.use(
    "/api/branches",
    branchRoutes
);
app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/users",
    userRoutes
);

export default app;