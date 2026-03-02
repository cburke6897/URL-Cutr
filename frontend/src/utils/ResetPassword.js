const ensureValidPassword = (value) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;        
    return passwordRegex.test(value);
}

const ensureValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

export async function resetPassword(email) {
    if (!email) {
        return { error: "Email is required" };
    }

    if (email.length > 255) {
        return { error: "Email must be 255 characters or less" };
    }

    if (!ensureValidEmail(email)) {
        return { error: "Invalid email" };
    }

    try {
        const response = await fetch("http://localhost:8000/send-reset-password-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.detail || "Failed to send reset email" };
        }

        return { message: data.message || "If the email is registered, a reset link has been sent." };
    } catch (err) {
        return { error: "Network error. Please try again." };
    }
}

export async function changePasswordWithToken({ token, newPassword, confirmPassword, navigate, setError, setSuccess }) {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
        setError("Please fill in all fields");
        return;
    }

    if (newPassword.length > 128) {
        setError("Password must be 128 characters or less");
        return;
    }

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    if (!ensureValidPassword(newPassword)) {
        setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                new_password: newPassword,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            setError(data.detail || "Failed to change password");
            return;
        }

        setSuccess("Password changed successfully! Redirecting to login...");
        setTimeout(() => {
            navigate(`/auth?success=${encodeURIComponent("Password changed successfully! Please log in.")}`);
        }, 2000);
    } catch (err) {
        setError("Network error. Please try again.");
    }
}