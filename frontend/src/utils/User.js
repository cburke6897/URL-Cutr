import { authFetch } from "./RefreshToken";
import Settings from "./Settings";

export async function fetchCurrentUser() { // Function to fetch current user data using access token stored in localStorage, returns null if not authenticated or on error
    const token = localStorage.getItem("token");
      
      if (token){
        const response = await authFetch(`${Settings.BACKEND_URL}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const user = await response.json();
          return user;
        }
        return null;
      }
}
