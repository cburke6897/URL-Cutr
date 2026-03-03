import Settings from "./Settings";

export async function logout(navigate, location, token) {
    const response = await fetch(`${Settings.BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
    console.error("Failed to sign out:", response.status);
    }

    localStorage.removeItem("token");
    
    if (location.pathname == "/") {
        navigate(0)
    } else if (location.pathname !== "/change-password") {
        navigate("/");
    }
}

const ensureValidEmail = (value) => { // Simple email regex for basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

const ensureValidPassword = (value) => { // Enforce strong password:
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;        
    return passwordRegex.test(value);
}

export async function signup({ email, username, password, confirmPassword, navigate }) {
    if (!email || !username || !password || !confirmPassword) {
        return { error: "One or more fields are empty" };
    } else if (username.length > 50) {
        return { error: "Username must be 50 characters or less" };
    } else if (email.length > 255) {
        return { error: "Email must be 255 characters or less" };
    } else if (password.length > 128) {
        return { error: "Password must be 128 characters or less" };
    } else if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    } else if (!ensureValidEmail(email)) {
        return { error: "Invalid email" };
    } else if (!ensureValidPassword(password)) {
        return { error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." };
    }

    try {
        const response = await fetch(`${Settings.BACKEND_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        });

        if (!response.ok) {
            let message = "Unknown error";
            let errorText = null;

            try {
                errorText = await response.text();
                console.error("Error response body:", errorText);
            } catch (fetchError) {
                console.error("Failed to read error response text:", fetchError);
            }

            if (response.status === 400) {
                message = "Email or username already registered";
            }

            return { error: message };
        }

        await response.json();
        navigate(`/auth?success=${encodeURIComponent("Account created successfully! Please log in.")}`);
        return { success: true, switchToLogin: true };
    } catch (requestError){
        return { error: "Network error" };
    }
}

export async function login({ email, password, navigate }) {
    if (!email || !password) {
        return { error: "Email and password are required" };
    } else if (!ensureValidEmail(email)) {
        return { error: "Invalid email" };
    }

    try {
        const response = await fetch(`${Settings.BACKEND_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            let message = "Unknown error";
            let errorText = null;

            try {
                errorText = await response.text();
                console.error("Error response body:", errorText);
            } catch (fetchError) {
                console.error("Failed to read error response text:", fetchError);
            }

            if (response.status === 401) {
                message = "Invalid email or password";
            }

            return { error: message };
        }

        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
        return { success: true };
    } catch (requestError){
        return { error: "Network error" };
    }
}

export async function changeUsername({ email, password, newUsername, navigate, setError }) {
    if (!email || !password || !newUsername) {
        setError("One or more fields are empty");
        return;
    } else if (newUsername.length > 50) {
        setError("Username must be 50 characters or less");
        return;
    } else if (!ensureValidEmail(email)) {
        setError("Invalid email");
        return;
    }

    try {
        const response = await fetch(`${Settings.BACKEND_URL}/change-username`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password, new_username: newUsername }),
        });

        if (!response.ok) {
            let message = "Unknown error";
            let errorText = null;

            try {
                errorText = await response.text();
                console.error("Error response body:", errorText);
            } catch (fetchError) {
                console.error("Failed to read error response text:", fetchError);
            }

            if (response.status === 401) {
                message = "Invalid email or password";
            } else if (response.status === 400) {
                message = "Username already taken";
            }

            setError(message);
            return;
        }

        await response.json();
        navigate(`/?success=${encodeURIComponent("Username changed successfully!")}`);
    } catch (requestError) {
        setError("Network error");
    }
}