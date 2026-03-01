import { fetchCurrentUser } from "./User";
import { logout } from "./Auth";

const ensureValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

export async function sendDeleteAccountEmail() {
    try {
        const user = await fetchCurrentUser();
        
        if (!user || !user.email) {
            const errorMessage = "Unable to retrieve user email. Please log in again.";
            return { error: errorMessage };
        }

        const email = user.email;

        const response = await fetch("http://localhost:8000/send-delete-account-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || "Failed to send delete account email";
            return { error: errorMessage };
        }

        const successMessage = data.message || "Delete account confirmation email has been sent.";
        return { message: successMessage };
    } catch (err) {
        const errorMessage = "Network error. Please try again.";
        return { error: errorMessage };
    }
}


export async function deleteAccountWithToken({ token, email, password, navigate, location, setError }) {
    setError("");

    if (!email || !password) {
        setError("Please fill in all fields");
        return;
    }

    if (!ensureValidEmail(email)) {
        setError("Please enter a valid email address");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/delete-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || "Failed to delete account";
            setError(errorMessage);
            return;
        }
        
        // Get the token and logout the user
        const accessToken = localStorage.getItem("token");
        localStorage.removeItem("token");
        
        if (accessToken) {
            await logout(navigate, location, accessToken);
        }

        navigate(`/?success=${encodeURIComponent("Account deleted successfully")}`);
    } catch (err) {
        setError("Network error. Please try again.");
    }
}