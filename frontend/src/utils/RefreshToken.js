export async function refreshAccessToken() { // Function to refresh access token using refresh token stored in HTTP-only cookie
    const response = await fetch("http://localhost:8000/refresh", {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        console.error("Failed to refresh token:", response.status);
        localStorage.removeItem("token");
        return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return data.access_token;
}

export async function authFetch(url, options = {}) { // Wrapper around fetch to automatically include access token and handle 401 responses by attempting to refresh the token
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    
    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) { return response; }

        return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
        });
    }

    return response;
}
