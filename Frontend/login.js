// Add submit event listener to the login form
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form's default submission behavior

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    // User data with roles (for demo purposes only)
    const users = {
        "worker": { password: "worker123", role: "worker" },
        "student": { password: "student123", role: "student" }
    };

    // Validate login credentials
    if (users[username] && users[username].password === password) {
        // Store the user role in session storage
        sessionStorage.setItem("userRole", users[username].role);

        // Redirect to the main page on successful login
        window.location.href = "index.html";
    } else {
        // Display error message on invalid credentials
        loginMessage.textContent = "Invalid username or password. Please try again.";
        loginMessage.style.color = "red";
    }
});
