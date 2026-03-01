const ensureValidPassword = (value) => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;        
    return passwordRegex.test(value);
}

export async function changePasswordWithToken({ token, newPassword, confirmPassword, navigate, setError, setSuccess }) {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
        setError("Please fill in all fields");
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
        const response = await fetch("http://localhost:8000/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
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