import { authFetch } from "../utils/RefreshToken";

export async function fetchCurrentUser() { // Function to fetch current user data using access token stored in localStorage, returns null if not authenticated or on error
    const token = localStorage.getItem("token");
      
      if (token){
        console.log("Token found:", token);
        const response = await authFetch("http://localhost:8000/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("HERE");
        console.log("Fetch /me response:", response);
        console.log("Response status:", response.status);
        if (response.ok) {
          console.log("User data fetched successfully");
          const user = await response.json();
          return user;
        }
        return null;
      }
}
