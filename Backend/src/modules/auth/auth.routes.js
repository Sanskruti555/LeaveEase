import express from "express";
import {registerCompany,login,verifyOTP,resendOTP,forgotPassword,resetPassword,changePassword,updateProfile,getProfile} from "./auth.controller.js";
import {validateRegisterCompany,validateLogin} from "./auth.validation.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register-company", validateRegisterCompany, registerCompany);

router.post("/login",validateLogin,login);

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully." });
});

router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.put("/profile",authMiddleware,updateProfile);
router.get("/profile", authMiddleware, getProfile);



export default router;

