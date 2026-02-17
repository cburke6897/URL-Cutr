import { useState } from "react";
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

  const isSignup = mode === "signup";
  const submitText = isSignup ? "Create Account" : "Log In";

  const handleSubmit = async () => {
    if (isSignup) {
        if (!email || !username || !password || !confirmPassword) {
          setError("One or more fields are empty");
          return;
        } else if (password !== confirmPassword) {
          setError("Passwords do not match");
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
                }

            } catch (requestError){
                setError("Network error")
            }
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] transition-colors p-4">
      <DropdownMenu />
      <div className="min-h-[26rem] w-full max-w-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] p-8 pb-6 rounded-xl shadow-lg text-center transition-colors">
        <h1 className="text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] text-3xl font-bold mb-2 transition-colors">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-[var(--color-text-light)]/70 dark:text-[var(--color-text-dark)]/70 mb-6">
          {isSignup ? "Join URL Cutr in a minute." : "Log in to manage your links."}
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              !isSignup
                ? "bg-[var(--color-button)] text-white"
                : "bg-transparent text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isSignup
                ? "bg-[var(--color-button)] text-white"
                : "bg-transparent text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] hover:bg-black/5 dark:hover:bg-white/10"
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
            value={password}
            onChange={setPassword}
            additionalClasses="w-full"
            title="Enter your password"
          />
          {isSignup && (
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              additionalClasses="w-full"
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

      </div>
    </div>
  );
}
