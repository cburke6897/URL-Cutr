import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import { deleteAccountWithToken } from "../utils/DeleteAccount";
import { fetchCurrentUser } from "../utils/User";

export default function DeleteAccount() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function init() {
            const token = searchParams.get("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/verify-delete-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: token }),
                });

                if (!response.ok) {
                    navigate(`/?error=${encodeURIComponent("Invalid or expired delete token")}`);
                    return;
                }

                await response.json();
                setUser(await fetchCurrentUser());
                setLoading(false);
            } catch (err) {
                navigate(`/?error=${encodeURIComponent("Failed to verify delete token")}`);
            }
        }

        init()
    }, [searchParams, navigate]);

    const handleDeleteAccount = async () => {
        const token = searchParams.get("token");
        await deleteAccountWithToken({ token, email, password, navigate, location, setError });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleDeleteAccount();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors">
                <DropdownMenu />
                {user && <UsernameLabel username={user.username} admin={user.admin} />}
                <div className="text-text-light dark:text-text-dark text-xl">
                    Verifying token...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
            <DropdownMenu />
            {user && <UsernameLabel username={user.username} admin={user.admin} />}
            <div 
                className="min-h-[23.8rem] w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors"
                onKeyDown={handleKeyDown}
            >
                
                <h1 className="text-text-light dark:text-text-dark text-3xl font-bold mb-4 transition-colors">
                    Delete Account
                </h1>

                <p className="text-text-light dark:text-text-dark mb-6 transition-colors">
                    Enter your email and password to confirm account deletion
                </p>
        
                <div className="flex flex-col gap-3 items-center p-3">
                    <TextInput 
                        placeholder="Email" 
                        value={email} 
                        onChange={setEmail} 
                        additionalClasses="w-full" 
                        title="Enter your email"
                        type="email"
                    />
                    <TextInput 
                        placeholder="Password" 
                        value={password} 
                        onChange={setPassword} 
                        additionalClasses="w-full" 
                        title="Enter your password"
                        type="password"
                    />
                </div>

                <div className="flex items-center gap-1 mt-3">
                    <EnterButton onClick={handleDeleteAccount} title="Delete Account" text="Delete Account"/>
                </div>

                {error && (
                    <p className="text-error dark:text-error-dark mt-4 font-semibold transition-colors">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}