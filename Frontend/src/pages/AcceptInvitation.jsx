import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AcceptInvitation = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    // Validate invitation when page loads
    useEffect(() => {

        const fetchInvitation = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/invitations/${token}`
                );

                const result = await response.json();

                if (!result.success) {
                    setError(result.message);
                    return;
                }

                setInvitation(result.data);

            } catch (error) {

                console.error(
                    "Fetch Invitation Error:",
                    error
                );

                setError("Failed to load invitation.");

            } finally {

                setLoading(false);
            }
        };

        fetchInvitation();

    }, [token]);


    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Accept invitation
    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");
        setSuccessMessage("");


        // Check password confirmation
        if (formData.password !== formData.confirmPassword) {

            setFormError("Passwords do not match.");
            return;
        }


        try {

            setSubmitting(true);

            const response = await fetch(
                `http://localhost:5000/api/invitations/${token}/accept`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        phone: formData.phone,
                        password: formData.password
                    })
                }
            );


            const result = await response.json();


            if (!result.success) {
                setFormError(result.message);
                return;
            }


            setSuccessMessage(
                "Invitation accepted successfully. Your account has been created."
            );

        } catch (error) {

            console.error(
                "Accept Invitation Error:",
                error
            );

            setFormError(
                "Failed to accept invitation."
            );

        } finally {

            setSubmitting(false);
        }
    };


    if (loading) {
        return <p>Loading invitation...</p>;
    }


    if (error) {
        return (
            <div>
                <h2>Invalid Invitation</h2>
                <p>{error}</p>
            </div>
        );
    }


    return (
        <div>

            <h1>Accept Invitation</h1>

            <p>
                Email: {invitation.email}
            </p>

            <p>
                Role: {invitation.role}
            </p>


            {formError && (
                <p>
                    {formError}
                </p>
            )}


            {successMessage && (
                <p>
                    {successMessage}
                </p>
            )}


            {!successMessage && (

                <form onSubmit={handleSubmit}>

                    <div>

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div>

                        <label>Phone Number</label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>


                    <div>

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div>

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {
                            submitting
                                ? "Creating Account..."
                                : "Accept Invitation"
                        }
                    </button>

                </form>
            )}

        </div>
    );
};

export default AcceptInvitation;