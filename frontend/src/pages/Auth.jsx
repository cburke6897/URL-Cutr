import { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import DropdownMenu from "../components/DropdownMenu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup, login } from "../utils/Auth";

export default function Auth() {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const successMsg = searchParams.get("success");
    const isSignup = mode === "signup";
    const submitText = isSignup ? "Create Account" : "Log In";

    useEffect(() => { // Clear form and messages when switching modes
        setError("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
    }, [mode]);

    useEffect(() => {
        async function init() {
            const token = localStorage.getItem("token");
            if (token) {
                navigate("/dashboard");
            }
        }

        init()
    }, []);

    const handleSubmit = async () => { // Signup and login logic with client-side validation and error handling
        setError("");
        
        const result = isSignup 
            ? await signup({ email, username, password, confirmPassword, navigate })
            : await login({ email, password, navigate });

        if (result.error) {
            setError(result.error);
        } else if (result.switchToLogin) {
            setMode("login"); // Switch to login mode after successful signup
            setShowSuccess(true); // Show success message
        }
    };

    return (
        <div className="min-h-dvh flex justify-center items-start bg-bg-light dark:bg-bg-dark transition-colors p-4 pt-[12svh] md:pt-[7.5%]">
            <DropdownMenu />
            <div className="min-h-104 w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-6 rounded-xl shadow-lg text-center transition-colors">
                <h1 className="text-text-light dark:text-text-dark text-3xl font-bold mb-2 transition-colors">
                    {isSignup ? "Create your account" : "Welcome back"}
                </h1>

                <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-6">
                    {isSignup ? "Join URL Cutr in a minute" : "Log in to manage your links"}
                </p>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            setMode("login");
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        !isSignup
                            ? "bg-button text-white"
                            : "bg-transparent text-text-light dark:text-text-dark hover:bg-hover-overlay dark:hover:bg-hover-overlay-dark"
                        }`}
                    >
                        Log In
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMode("signup");
                            setShowSuccess(false); // Hide success message when switching to signup
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isSignup
                            ? "bg-button text-white"
                            : "bg-transparent text-text-light dark:text-text-dark hover:bg-hover-overlay dark:hover:bg-hover-overlay-dark"
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-3 items-center">
                    {isSignup && (
                        <div className="w-full">
                            <TextInput
                                placeholder="Username"
                                value={username}
                                onChange={setUsername}
                                additionalClasses="w-full"
                                title="Enter your username (max 50 characters)"
                                maxLength={50}
                            />
                            <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1 text-right">{username.length}/50</p>
                        </div>
                    )}
                    <div className="w-full">
                        <TextInput
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            additionalClasses="w-full"
                            title="Enter your email (max 255 characters)"
                            autocomplete="email"
                            maxLength={255}
                        />
                        {isSignup && <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1 text-right">{email.length}/255</p>}
                    </div>
                    <div className="w-full">
                        <TextInput
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            additionalClasses="w-full"
                            title="Enter your password (max 128 characters)"
                            autocomplete = {isSignup ? "new-password" : "current-password"}
                            maxLength={128}
                        />
                        {isSignup && <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1 text-right">{password.length}/128</p>}
                    </div>
                    {isSignup && (
                        <TextInput
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            additionalClasses="w-full "
                            title="Confirm your password"
                            autocomplete="new-password"
                            maxLength={128}
                        />
                    )}
                    <EnterButton type="submit" title={submitText} text={submitText}/>
                </form>

                {!isSignup && (
                    <button
                        type="button"
                        onClick={() => navigate("/reset-password")}
                        className="mt-3 w-full text-left text-sm font-medium text-button hover:underline"
                    >
                        Forgot Password?
                    </button>
                )}

                <div className="mt-4 min-h-6">
                    {error && (
                        <p className="text-error dark:text-error-dark mt-4 font-semibold transition-colors">
                            {error}
                        </p>
                    )}

                    {successMsg && showSuccess && (
                        <p className="text-success dark:text-success-dark mt-4 font-semibold transition-colors">
                            {successMsg}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
