const checkAuth = async (response) => {
    if (response.status === 401) {
        const data = await response.json();
        if (data.message === "Invalid or expired token") {
            // Clear authentication tokens
            localStorage.clear();
            return false; // Return false if the token is invalid or expired
        }
    }
    return true; // Return true if the response is fine
};

export default checkAuth;
