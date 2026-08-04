import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                }
            );

            const result = await response.json();

            if (!result.success) {
                setError(result.message);
                return;
            }

            // Store authentication information
            localStorage.setItem(
                "token",
                result.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            console.log(
                "Logged in user:",
                result.user
            );

            // We'll replace this with role-based dashboards shortly
            navigate("/");

        } catch (error) {

            console.error("Login Error:", error);

            setError("Failed to login.");

        } finally {

            setLoading(false);
        }
    };


    return (
        <div>

            <h1>Login</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
};

export default Login;