import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import invitationRoutes from "./modules/invitations/invitation.routes.js";
import leaveRoutes from "./modules/leave/leave.routes.js";
import leaveTypeRoutes from "./modules/leaveTypes/leaveType.routes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/invitations", invitationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use(
    "/api/leave-types",
    leaveTypeRoutes
);

export default app;