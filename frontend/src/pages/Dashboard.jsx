import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../components/DropdownMenu";
import UsernameLabel from "../components/UsernameLabel";
import CopyButton from "../components/CopyButton";
import InfoCard from "../components/InfoCard";
import { fetchCurrentUser } from "../utils/User";
import { authFetch } from "../utils/RefreshToken";
import DeleteButton from "../components/DeleteButton";
import { deleteUrl } from "../utils/Url";
import Settings from "../utils/Settings";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const urlsPerPage = 7;

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

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    const fetchUserUrls = async (token) => {
        try {
            setLoading(true);
            const response = await authFetch(`${Settings.BACKEND_URL}/my-urls`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUrls(data);
                setCurrentPage(1);
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

    const totalPages = Math.max(1, Math.ceil(urls.length / urlsPerPage));
    const startIndex = (currentPage - 1) * urlsPerPage;
    const currentUrls = urls.slice(startIndex, startIndex + urlsPerPage);

    return (
        <div className="h-screen overflow-hidden bg-bg-light dark:bg-bg-dark transition-colors">
            <DropdownMenu />
            <InfoCard />
            {user && <UsernameLabel username={user.username} admin = {user.admin} />}
            
            <div className="h-full flex flex-col items-center justify-start pt-20 px-4 overflow-hidden">
                <div className="w-full max-w-6xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg p-6 transition-colors">
                    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6">
                        My Cut URLs
                    </h1>

                    {loading && (
                        <p className="text-text-light dark:text-text-dark">Loading...</p>
                    )}

                    {error && (
                        <p className="text-error mb-4">{error}</p>
                    )}

                    {!loading && urls.length === 0 && (
                        <p className="text-text-light dark:text-text-dark">
                            You haven't created any Cut URLs yet
                        </p>
                    )}

                    {!loading && urls.length > 0 && (
                        <div className="space-y-2">
                            {currentUrls.map((url, index) => (
                                <div 
                                    key={url.id || url.code} 
                                    className="bg-bg-light dark:bg-bg-dark rounded-lg px-4 py-2 border border-border dark:border-border-dark transition-colors flex items-center gap-4"
                                >
                                    <div className="w-8 text-text-light dark:text-text-dark font-semibold">
                                        {startIndex + index + 1}.
                                    </div>
                                    
                                    <div className="w-30 min-w-0">
                                        <a 
                                            href={url.short_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-link hover:text-link dark:text-link-dark dark:hover:text-link font-medium truncate block"
                                            title = {url.short_url}
                                        >
                                            {url.code}
                                        </a>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <a 
                                            href={url.original_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-text-muted dark:text-text-muted-dark text-sm truncate block hover:text-link dark:hover:text-link-dark"
                                            title={url.original_url}
                                        >
                                            {url.original_url}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
                                        <span className="w-20">Clicks: {url.clicks}</span>
                                        <span className="w-48 text-xs text-text-muted dark:text-text-muted-dark">
                                            Created: {formatDate(url.created_at)}
                                        </span>
                                        <span className="w-48 text-xs text-text-muted dark:text-text-muted-dark">
                                            Expires: {formatDate(url.delete_at)}
                                        </span>
                                        
                                        <CopyButton text={url.short_url} />
                                        <DeleteButton onClick={() => deleteUrl(navigate, url.code)} title="Delete URL" />
                                    </div>
                                </div>
                            ))}

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md border border-border dark:border-border-dark text-text-light dark:text-text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover-overlay dark:hover:bg-hover-overlay-dark"
                                    >
                                        Previous
                                    </button>

                                    <span className="text-sm text-text-light dark:text-text-dark">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-md border border-border dark:border-border-dark text-text-light dark:text-text-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover-overlay dark:hover:bg-hover-overlay-dark"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}