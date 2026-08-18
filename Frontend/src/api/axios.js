import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Common Responses and Token Expiration
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const status = error.response ? error.response.status : null;
        
        if (status === 401) {
            // Token expired or invalid
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register") && !currentPath.startsWith("/accept-invitation")) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login?sessionExpired=true";
            }
        }

        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.errors?.join(", ") ||
            error.message ||
            "An unexpected error occurred.";

        return Promise.reject({
            status,
            message: errorMessage,
            data: error.response?.data
        });
    }
);

export default apiClient;
