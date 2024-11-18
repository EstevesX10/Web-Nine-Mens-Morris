class AuthenticationManager {
  constructor() {
    this.logregBox = document.querySelector(".logreg-box");
    this.loginLink = document.querySelector(".login-link");
    this.registerLink = document.querySelector(".register-link");

    this.registerLink.addEventListener("click", () => {
      this.logregBox.classList.remove("login");
      this.logregBox.classList.remove("account");
      this.logregBox.classList.add("register");
    });

    this.loginLink.addEventListener("click", () => {
      this.logregBox.classList.remove("register");
      this.logregBox.classList.remove("account");
      this.logregBox.classList.add("login");
    });

    this.loginForm = document.getElementById("loginForm");
    this.registerForm = document.getElementById("registerForm");
    this.logoutButton = document.getElementById("logoutButton");

    this.loginForm.addEventListener("submit", (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
      this.login();
    });

    this.registerForm.addEventListener("submit", (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
      this.register();
    });

    // [Logout] Register Form Submission
    this.logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.logout();
    });
  }

  capitalize(input) {
    return input.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  login() {
    // Fetching the values from the login form
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    console.log("Login Form Data:", {
      username: username,
      password: password,
    });

    // Update the name of the authentication button in the navigation bar
    var authNavBtnName = document.getElementById("nav-btn-authentication");
    authNavBtnName.classList.add("hidden");

    // Set a timeout to proper showcase the animation of the username appearing in the nav bar
    setTimeout(() => {
      authNavBtnName.textContent = this.capitalize(username);
      authNavBtnName.classList.remove("hidden");
    }, 750);

    this.logregBox.classList.remove("login");
    this.logregBox.classList.remove("register");
    this.logregBox.classList.add("account");

    // Here, we could make an AJAX call to request the data from a server.

    // Add the data into the account details section
    var accountUsername = document.getElementById("accountUsername");
    accountUsername.textContent = username;

    var accountEmail = document.getElementById("accountEmail");
    accountEmail.textContent = "None";

    var accountPassword = document.getElementById("accountPassword");
    accountPassword.textContent = password;

    navManager.enableNavItems(true);

    // [TODO] Fetch EMAIL IN BACKEND
  }

  register() {
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

    // Update the name of the authentication button in the navigation bar
    var authNavBtnName = document.getElementById("nav-btn-authentication");
    authNavBtnName.classList.add("hidden");

    // Set a timeout to proper showcase the animation of the username appearing in the nav bar
    setTimeout(() => {
      authNavBtnName.textContent = this.capitalize(username);
      authNavBtnName.classList.remove("hidden");
    }, 750);

    this.logregBox.classList.remove("login");
    this.logregBox.classList.remove("register");
    this.logregBox.classList.add("account");

    navManager.enableNavItems(true);

    // [TODO] Send the data to a server here.
  }

  logout() {
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
    this.loginForm.reset();
    this.registerForm.reset();
    this.logregBox.classList.remove("account");
    this.logregBox.classList.remove("register");
    this.logregBox.classList.add("login");

    // Update the name of the authentication button in the navigation bar back to the original state
    var authNavBtnName = document.getElementById("nav-btn-authentication");
    authNavBtnName.classList.add("hidden");

    // Set a timeout to show the nav button going back to the original state
    setTimeout(() => {
      authNavBtnName.textContent = "Sign In";
      authNavBtnName.classList.remove("hidden");
    }, 750);

    // Remove the account details from the HTML when logging out
    document.getElementById("accountUsername").textContent = "";
    document.getElementById("accountEmail").textContent = "";
    document.getElementById("accountPassword").textContent = "";

    navManager.enableNavItems(false);

    // Restart game board whenever the player logs out so that the next user does not have messy data
    g_config.loadBoard();

    // Send the data to a server here.
  }
}

authManeger = new AuthenticationManager();
