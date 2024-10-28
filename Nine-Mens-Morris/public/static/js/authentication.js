document.addEventListener("DOMContentLoaded", () => {
  const logregBox = document.querySelector(".logreg-box");
  const loginLink = document.querySelector(".login-link");
  const registerLink = document.querySelector(".register-link");

  registerLink.addEventListener("click", () => {
    logregBox.classList.remove("login");
    logregBox.classList.remove("account");
    logregBox.classList.add("register");
  });

  loginLink.addEventListener("click", () => {
    logregBox.classList.remove("register");
    logregBox.classList.remove("account");
    logregBox.classList.add("login");
  });

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Fetching the values from the login form
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    console.log("Login Form Data:", {
      username: username,
      password: password,
    });

    logregBox.classList.remove("login");
    logregBox.classList.remove("register");
    logregBox.classList.add("account");

    // Here, we could make an AJAX call or fetch request to send the data to a server.

    // Add the data into the account details section
    var accountUsername = document.getElementById("accountUsername");
    console.log(username);
    accountUsername.textContent = username;

    // Fetch EMAIL IN BACKEND

    var accountPassword = document.getElementById("accountPassword");
    accountPassword.textContent = password;
  });

  // Register Form Submission
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Fetching the values from the register form
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    console.log("Register Form Data:", {
      username: username,
      email: email,
      password: password,
    });

    // Add the data into the account details section
    var accountUsername = document.getElementById("accountUsername");
    accountUsername.textContent = username;
    var accountEmail = document.getElementById("accountEmail");
    accountEmail.textContent = email;
    var accountPassword = document.getElementById("accountPassword");
    accountPassword.textContent = password;

    logregBox.classList.remove("login");
    logregBox.classList.remove("register");
    logregBox.classList.add("account");

    // Similarly, you could send the data to a server here.
  });

  // [Logout] Register Form Submission
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Fetching the values from the register form
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    console.log("Register Form Data:", {
      username: username,
      email: email,
      password: password,
    });

    // Reset forms and go back to the login
    loginForm.reset();
    registerForm.reset();
    logregBox.classList.remove("account");
    logregBox.classList.remove("register");
    logregBox.classList.add("login");

    // Remove the account details from the HTML when logging out
    document.getElementById("accountUsername").textContent = "";
    document.getElementById("accountEmail").textContent = "";
    document.getElementById("accountPassword").textContent = "";

    // Send the data to a server here.
  });
});
