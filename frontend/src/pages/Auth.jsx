import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import DropdownMenu from "../components/DropdownMenu";

export default function Auth() {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isSignup = mode === "signup";
    const submitText = isSignup ? "Create Account" : "Log In";

    useEffect(() => { // Clear form and messages when switching modes
        setSuccess("");
        setError("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, [mode]);

    useEffect(() => {  // Check for success message in URL parameters (e.g., after successful signup)  
        const param = new URLSearchParams(window.location.search);
        const successMsg = param.get("success");
        if (successMsg) {
            setSuccess(successMsg);
        }
    }, []);

    const ensureValidEmail = (value) => { // Simple email regex for basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
  
    const ensureValidPassword = (value) => { // Enforce strong password:
        // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;        
        return passwordRegex.test(value);
    }

    const handleSubmit = async () => { // Signup and login logic with client-side validation and error handling
        setSuccess("");
        setError("");

        if (isSignup) { // Signup
            if (!email || !username || !password || !confirmPassword) {
            setError("One or more fields are empty");
            return;
            } else if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
            } else if (!ensureValidEmail(email)) {
            setError("Invalid email");
            return;
            } else if (!ensureValidPassword(password)) {
            setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
            } else {
                try {
                    const response = await fetch("http://localhost:8000/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: email, username: username, password:password }),
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

                        setError(message);
                        return;
                    }

                    await response.json();
                    window.location.assign("/auth?success=Account created successfully. Please log in.");
                } catch (requestError){
                    setError("Network error")
                }
            }
        } else {  // Login
            if (!email || !password) {
                setError("Email and password are required");
                return;
            } else if (!ensureValidEmail(email)) {
                setError("Invalid email");
                return;
            } else {
                try {
                    const response = await fetch("http://localhost:8000/login", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: email, password: password }),
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

                        setError(message);
                        return;
                    }

                    const data = await response.json();
                    localStorage.setItem("token", data.access_token);
                    window.location.assign("/");
                } catch (requestError){
                    setError("Network error")
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
        <DropdownMenu />
        <div className="min-h-104 w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-6 rounded-xl shadow-lg text-center transition-colors">
            <h1 className="text-text-light dark:text-text-dark text-3xl font-bold mb-2 transition-colors">
            {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-6">
            {isSignup ? "Join URL Cutr in a minute." : "Log in to manage your links."}
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
            <button
                type="button"
                onClick={() => {
                    setSuccess("");
                    setMode("login");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                !isSignup
                    ? "bg-button text-white"
                    : "bg-transparent text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"
                }`}
            >
                Log In
            </button>
            <button
                type="button"
                onClick={() => {
                    setSuccess("");
                    setMode("signup");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isSignup
                    ? "bg-button text-white"
                    : "bg-transparent text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"
                }`}
            >
                Sign Up
            </button>
            </div>

            <div className="flex flex-col gap-3 items-center">
            {isSignup && (
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChange={setUsername}
                    additionalClasses="w-full"
                    title="Enter your username"
                />
            )}
            <TextInput
                placeholder="Email"
                value={email}
                onChange={setEmail}
                additionalClasses="w-full"
                title="Enter your email"
            />
            <TextInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={setPassword}
                additionalClasses="w-full"
                title="Enter your password"
            />
            {isSignup && (
                <TextInput
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    additionalClasses="w-full "
                    title="Confirm your password"
                />
            )}
            </div>

            <div className="mt-5">
            <EnterButton onClick={handleSubmit} title={submitText} text={submitText} />
            </div>

            {error && (
            <p className="text-red-600 dark:text-red-400 mt-4 font-semibold transition-colors">
                {error}
            </p>
            )}

            {success && (
            <p className="text-green-600 dark:text-green-400 mt-4 font-semibold transition-colors">
                {success}
            </p>
            )}

        </div>
        </div>
    );
}
