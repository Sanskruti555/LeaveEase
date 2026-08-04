import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import invitationRoutes from "./modules/invitations/invitation.routes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/invitations", invitationRoutes);
app.use("/api/auth", authRoutes);

export default app;