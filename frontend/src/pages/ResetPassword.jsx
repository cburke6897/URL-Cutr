import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import { resetPassword } from "../utils/ResetPassword";
import { fetchCurrentUser } from "../utils/User";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("error");
  const displayError = error || (!message && errorMessage ? decodeURIComponent(errorMessage) : "");

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await fetchCurrentUser();
        if (userData) {
          setUser(userData);
        }
      }
    }
    init();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
      
    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage(result.message || "If the email is registered, a reset link has been sent.");
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-bg-light dark:bg-bg-dark transition-colors p-4 pt-[7.5%]">
      {user && <UsernameLabel username={user.username} admin={user.admin} />}
      <DropdownMenu />
      <div className="w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors">
        <label className="block text-text-light dark:text-text-dark text-3xl font-bold mb-6 transition-colors">
          Password Reset
        </label>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-3 items-center">
          <TextInput
            placeholder="Email"
            value={email}
            onChange={setEmail}
            additionalClasses="w-full"
            title="Enter your email"
            type="email"
          />
          <EnterButton type="submit" title="Send Reset Link" text="Send Reset Link" />
        </form>

        <div className="mt-2 h-8 flex items-center justify-center">
          {message && (
            <p className="text-success dark:text-success-dark font-semibold transition-colors">
              {message}
            </p>
          )}

          {!message && displayError && (
            <p className="text-error dark:text-error-dark font-semibold transition-colors">
              {displayError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
