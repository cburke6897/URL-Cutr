import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import DropdownMenu from "../components/DropdownMenu";
import { changePasswordWithToken } from "../utils/ResetPassword";
import { logout } from "../utils/Auth";

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        async function init() {
            const token = searchParams.get("token");
            if (!token) {
                navigate("/reset-password");
                return;
            }
            
            try {
                const response = await fetch("http://localhost:8000/verify-reset-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: token }),
                });

                if (!response.ok) {
                    navigate(`/reset-password?error=${encodeURIComponent("Invalid or expired reset token")}`);
                    return;
                }

                await response.json();
                
                // Logout user from any existing sessions
                const currentToken = localStorage.getItem("token");
                if (currentToken) {
                    await logout(navigate, location, currentToken);
                }
                
                setLoading(false);
            } catch (err) {
                navigate(`/reset-password?error=${encodeURIComponent("Failed to verify token")}`);
            }  


        }

        init();
    }, [searchParams, navigate]);

    const handleChangePassword = async () => {
        const token = searchParams.get("token");
        await changePasswordWithToken({
            token,
            newPassword,
            confirmPassword,
            navigate,
            setError,
            setSuccess
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleChangePassword();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors">
                <DropdownMenu />
                <div className="text-text-light dark:text-text-dark text-xl">
                    Verifying token...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
            <DropdownMenu />
            <div 
                className="min-h-[23.8rem] w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors"
                onKeyDown={handleKeyDown}
            >
                
                <h1 className="text-text-light dark:text-text-dark text-3xl font-bold mb-4 transition-colors">
                    Change Password
                </h1>

                <p className="text-text-light dark:text-text-dark mb-6 transition-colors">
                    Enter your new password below
                </p>
        
                <div className="flex flex-col gap-3 items-center p-3">
                    <TextInput 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={setNewPassword} 
                        additionalClasses="w-full" 
                        title="Enter your new password"
                        type="password"
                    />
                    <TextInput 
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChange={setConfirmPassword} 
                        additionalClasses="w-full" 
                        title="Confirm your new password"
                        type="password"
                    />
                </div>

                <div className="flex items-center gap-1 mt-3">
                    <EnterButton onClick={handleChangePassword} title="Change Password" text="Change Password"/>
                </div>

                {success && (
                    <p className="text-success dark:text-success-dark mt-4 font-semibold transition-colors">
                        {success}
                    </p>
                )}

                {error && (
                    <p className="text-error dark:text-error-dark mt-4 font-semibold transition-colors">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}