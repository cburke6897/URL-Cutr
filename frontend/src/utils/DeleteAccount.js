import { fetchCurrentUser } from "./User";

export async function sendDeleteAccountEmail() {
    try {
        const user = await fetchCurrentUser();
        
        if (!user || !user.email) {
            const errorMessage = "Unable to retrieve user email. Please log in again.";
            window.alert(errorMessage);
            return { error: errorMessage };
        }

        const email = user.email;

        const response = await fetch("http://localhost:8000/send-delete-account-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || "Failed to send delete account email";
            window.alert(errorMessage);
            return { error: errorMessage };
        }

        const successMessage = data.message || "Delete account confirmation email has been sent.";
        window.alert(successMessage);
        return { message: successMessage };
    } catch (err) {
        const errorMessage = "Network error. Please try again.";
        window.alert(errorMessage);
        return { error: errorMessage };
    }
}
