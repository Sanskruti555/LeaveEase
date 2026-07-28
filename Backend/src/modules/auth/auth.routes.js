import express from "express";
import { registerCompany ,login } from "./auth.controller.js";

const router = express.Router();

router.post("/register-company", validateRegisterCompany, registerCompany);

router.post("/login",validateLogin,login);

export default router;

