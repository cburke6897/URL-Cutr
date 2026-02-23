import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import CopyButton from "../components/CopyButton";
import { fetchCurrentUser } from "../utils/FetchCurrentUser";
import { authFetch } from "../utils/RefreshToken";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function init() {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/auth");
                return;
            }

            const userData = await fetchCurrentUser();
            if (userData) {
                setUser(userData);
                await fetchUserUrls(token);
            } else {
                // If token is invalid, redirect to auth
                localStorage.removeItem("token");
                navigate("/auth");
            }
        }

        init()
    }, [navigate]);

    const fetchUserUrls = async (token) => {
        try {
            setLoading(true);
            const response = await authFetch("http://localhost:8000/my-urls", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUrls(data);
            } else {
                setError("Failed to fetch URLs");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === "None") return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors">
            <DropdownMenu />
            {user && <UsernameLabel username={user.username} admin = {user.admin} />}
            
            <div className="flex flex-col items-center justify-center pt-20 px-4">
                <div className="w-full max-w-6xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-8 transition-colors">
                    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">
                        My Cut URLs
                    </h1>

                    {loading && (
                        <p className="text-text-light dark:text-text-dark">Loading...</p>
                    )}

                    {error && (
                        <p className="text-red-500 mb-4">{error}</p>
                    )}

                    {!loading && urls.length === 0 && (
                        <p className="text-text-light dark:text-text-dark">
                            You haven't created any Cut URLs yet
                        </p>
                    )}

                    {!loading && urls.length > 0 && (
                        <div className="space-y-2">
                            {urls.map((url, index) => (
                                <div 
                                    key={url.id || url.code} 
                                    className="bg-bg-light dark:bg-bg-dark rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 transition-colors flex items-center gap-4"
                                >
                                    <div className="w-8 text-text-light dark:text-text-dark font-semibold">
                                        {index + 1}.
                                    </div>
                                    
                                    <div className="w-40 min-w-0">
                                        <a 
                                            href={url.short_url || `http://localhost:8000/r/${url.code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium truncate block"
                                        >
                                            {url.code}
                                        </a>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <a 
                                            href={url.original_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-400 text-sm truncate block hover:text-blue-500 dark:hover:text-blue-400"
                                            title={url.original_url}
                                        >
                                            {url.original_url}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
                                        <span className="w-20">Clicks: {url.clicks || 0}</span>
                                        <span className="w-48 text-xs text-gray-500 dark:text-gray-400">
                                            Created: {formatDate(url.created_at)}
                                        </span>
                                        <span className="w-48 text-xs text-gray-500 dark:text-gray-400">
                                            Expires: {formatDate(url.delete_at)}
                                        </span>
                                        
                                        <CopyButton text={url.short_url || `http://localhost:8000/r/${url.code}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}