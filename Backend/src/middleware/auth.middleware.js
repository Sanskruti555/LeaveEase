import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
    });
}

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

