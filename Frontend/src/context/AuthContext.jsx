import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Helper function to check if the token exists and is still within its validity period
    const isSessionValid = () => {
        const storedToken = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        
        if (!storedToken) return false;
        
        // ✅ NEW: If there is NO expiry (old token) OR the current time has passed the expiry, reject it.
        if (!tokenExpiry || Date.now() > parseInt(tokenExpiry, 10)) {
            return false;
        }
        
        return true;
    };

    const [user, setUser] = useState(() => {
        if (!isSessionValid()) return null; // Prevent flashing logged-in state if expired
        const storedUser = localStorage.getItem("user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => isSessionValid() ? localStorage.getItem("token") : null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Fetch fresh profile on mount if token exists
    const refreshProfile = useCallback(async () => {
        // Run our expiry check before attempting to fetch the profile
        if (!isSessionValid()) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("user");
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        }

        try {
            const res = await authApi.getProfile();
            if (res.success && res.data) {
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            }
        } catch (error) {
            console.error("Failed to refresh user profile:", error);
            // Backend rejected the token (e.g., 401 Unauthorized)
            if (error.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiry");
                localStorage.removeItem("user");
                setUser(null);
                setToken(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    const getDashboardPathForRole = (role) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "/admin/dashboard";
            case "BRANCH_ADMIN":
                return "/branch/dashboard";
            case "MANAGER":
                return "/manager/dashboard";
            case "EMPLOYEE":
                return "/employee/dashboard";
            default:
                return "/login";
        }
    };

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        if (response.success) {
            const authToken = response.token;
            const userData = response.user;

            /*
             * ✅ ROLE-BASED TOKEN EXPIRY
             * Admins and Managers get 24 hours. Employees get 30 days.
             */
            const privilegedRoles = ["SUPER_ADMIN", "BRANCH_ADMIN", "MANAGER"];
            const isAdminSession = privilegedRoles.includes(userData.role);
            
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;
            const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;
            
            const expiryDuration = isAdminSession ? ONE_DAY_MS : THIRTY_DAYS_MS;
            const expiryTimestamp = Date.now() + expiryDuration;

            // Store the token, user data, and the newly calculated expiry timestamp
            localStorage.setItem("token", authToken);
            localStorage.setItem("tokenExpiry", expiryTimestamp.toString());
            localStorage.setItem("user", JSON.stringify(userData));

            setToken(authToken);
            setUser(userData);

            const dashboardPath = getDashboardPathForRole(userData.role);
            navigate(dashboardPath, { replace: true });
            return response;
        }
        return response;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error("Logout API call error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry"); // Ensure expiry is cleared on manual logout
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            navigate("/login", { replace: true });
        }
    };

    const updateUserData = (updatedFields) => {
        setUser((prev) => {
            const updated = { ...prev, ...updatedFields };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    };

    const hasRole = (...roles) => {
        if (!user || !user.role) return false;
        return roles.includes(user.role);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
        isSuperAdmin: user?.role === "SUPER_ADMIN",
        isBranchAdmin: user?.role === "BRANCH_ADMIN",
        isManager: user?.role === "MANAGER",
        isEmployee: user?.role === "EMPLOYEE",
        hasRole,
        login,
        logout,
        refreshProfile,
        updateUserData,
        getDashboardPathForRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};