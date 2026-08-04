import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import invitationRoutes from "./modules/invitations/invitation.routes.js";

const app = express();

app.use(express.json());
app.use("/api/invitations", invitationRoutes);

app.use("/api/auth", authRoutes);

export default app;