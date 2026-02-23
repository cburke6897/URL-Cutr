export async function logout(navigate, location, token) {
    const response = await fetch("http://localhost:8000/logout", {
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
    } else {
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
    } else if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    } else if (!ensureValidEmail(email)) {
        return { error: "Invalid email" };
    } else if (!ensureValidPassword(password)) {
        return { error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." };
    }

    try {
        const response = await fetch("http://localhost:8000/signup", {
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
        navigate(`/auth?success=${encodeURIComponent("Account created successfully! Please log in.")}`, { replace: true });
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
        const response = await fetch("http://localhost:8000/login", {
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