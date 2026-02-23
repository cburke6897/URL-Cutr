export async function logout(navigate, location, token) {
    const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
    console.error("Failed to sign out:", response.status);
    }

    localStorage.removeItem("token");
    
    if (location.pathname == "/") {
        navigate(0)
    } else {
        navigate("/");
    }
}