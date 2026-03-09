import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import EnterButton from "../components/EnterButton";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import { changeUsername } from "../utils/Auth";
import { fetchCurrentUser } from "../utils/User";

export default function ChangeUsername() {
    const [newUsername, setNewUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function init() {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            const userData = await fetchCurrentUser();
            if (!userData) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            setUser(userData);
        }

        init();
    }, [navigate]);

    const handleChangeUsername = async () => {
        await changeUsername({ email, password, newUsername, navigate, setError });
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-bg-light dark:bg-bg-dark transition-colors p-4">
            <DropdownMenu />
            {user && <UsernameLabel username={user.username} admin={user.admin} />}
            <div className="min-h-[23.8rem] w-full max-w-lg bg-surface-light dark:bg-surface-dark p-8 pb-4 rounded-xl shadow-lg text-center transition-colors">
                <h1 className="text-text-light dark:text-text-dark text-3xl font-bold mb-4 transition-colors">
                    Change Username
                </h1>

                <p className="text-text-light dark:text-text-dark mb-6 transition-colors">
                    Enter your new username, email and password
                </p>
        
                <form onSubmit={handleChangeUsername} className="flex flex-col gap-3 items-center p-3">
                    <div className="w-full">
                        <TextInput
                            placeholder="New Username"
                            value={newUsername}
                            onChange={setNewUsername}
                            additionalClasses="w-full"
                            title="Enter your new username (max 50 characters)"
                            maxLength={50}
                        />
                        <p className="text-xs text-text-light/50 dark:text-text-dark/50 mt-1 text-right">{newUsername.length}/50</p>
                    </div>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChange={setEmail}
                        type="email"
                        additionalClasses="w-full"
                        title="Enter your email"
                        autocomplete="username"
                        maxLength={255}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                        type="password"
                        additionalClasses="w-full"
                        title="Enter your password"
                        autocomplete="current-password"
                        maxLength={128}
                    />

                    <EnterButton text="Change Username" type="submit" title="Change Username" />
                </form>

                <div className="h-10 mt-4">
                    {error && (
                        <p className="text-error dark:text-error-dark font-semibold transition-colors">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
