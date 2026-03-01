import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import { changePasswordWithToken } from "../utils/Change";

export default function ChangePassword() {
    const [userId, setUserId] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    useEffect(() => {
        async function init() {
            const token = searchParams.get("token");
            if (!token) {
                navigate("/");
                return;
            }
            
            try {
                const response = await fetch("http://localhost:8000/verify-reset-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    navigate(`/reset-password?error=${encodeURIComponent("Invalid or expired reset token")}`);
                    return;
                }

                const data = await response.json();
                setUserId(data.user_id);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors">
                <div className="text-text-light dark:text-text-dark text-xl">
                    Verifying token...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
            <div className="min-h-[23.8rem] w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors">
                
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
                    <p className="text-green-600 dark:text-green-400 mt-4 font-semibold transition-colors">
                        {success}
                    </p>
                )}

                {error && (
                    <p className="text-red-600 dark:text-red-400 mt-4 font-semibold transition-colors">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}