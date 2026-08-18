import React from "react";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <NotificationProvider>
                    <AppRoutes />
                </NotificationProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;