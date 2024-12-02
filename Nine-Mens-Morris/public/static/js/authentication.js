class AuthenticationManager {
  constructor() {
    // Fetch login and register links
    this.logregBox = document.querySelector(".logreg-box");
    this.loginLink = document.querySelector(".login-link");
    this.registerLink = document.querySelector(".register-link");

    // If a login is performed
    this.loginLink.addEventListener("click", () => {
      this.logregBox.classList.remove("register");
      this.logregBox.classList.remove("account");
      this.logregBox.classList.add("login");
    });

    // If a registration is performed
    this.registerLink.addEventListener("click", () => {
      this.logregBox.classList.remove("login");
      this.logregBox.classList.remove("account");
      this.logregBox.classList.add("register");
    });

    // Fetch login and register forms as well as the logout button
    this.loginForm = document.getElementById("loginForm");
    this.registerForm = document.getElementById("registerForm");
    this.logoutButton = document.getElementById("logoutButton");

    this.loginForm.addEventListener("submit", (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
      // Login
      this.login();
    });

    this.registerForm.addEventListener("submit", (event) => {
      // Prevent the default form submission behavior
      event.preventDefault();
      // Register
      this.register();
    });

    // [Logout] Register Form Submission
    this.logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      // Logout
      this.logout();
    });
  }

  capitalize(input) {
    return input.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  async login() {
    // Fetching the values from the login form
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    // Check if the login is valid
    const loginResponse = await register(username, password);

    // Define a variable for whether or not we can login
    let canLogin = null;

    // Check if the we can perform login
    if (loginResponse["error"] == null) {
      canLogin = true;
    } else {
      canLogin = false;
    }

    // Perform Login
    if (canLogin) {
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

      // Add the data into the account details section
      var accountUsername = document.getElementById("accountUsername");
      accountUsername.textContent = username;

      var accountEmail = document.getElementById("accountEmail");
      accountEmail.textContent = "None";

      var accountPassword = document.getElementById("accountPassword");
      accountPassword.textContent = password;

      navManager.enableNavItems(true);

      // Restart game board whenever the player logs out so that the next user does not have messy data
      g_config.loadBoard();
    } else {
      alert("Inserted Wrong Password!");
    }
  }

  async register() {
    // Fetching the values from the register form
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    // Check if the register is valid
    const registerResponse = await register(username, password);

    // Define a variable for whether or not we can register
    let canRegister = null;

    // Check if the we can perform login
    if (registerResponse["error"] == null) {
      canRegister = true;
    } else {
      canRegister = false;
    }

    if (canRegister) {
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

      // Hide the login, register and account sections
      this.logregBox.classList.remove("login");
      this.logregBox.classList.remove("register");
      this.logregBox.classList.add("account");

      // Enable the Navigation Items
      navManager.enableNavItems(true);
    } else {
      alert("Invalid Registration (User Already exists!)");
    }
  }

  async logout() {
    // Fetching the values from the register form
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

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

    // Disable the navigation items
    navManager.enableNavItems(false);

    console.log("Game Hash", game.gameHash);

    // Leave the current session as we are no longer logged in
    let leaveResponse = await leave(username, password, game.gameHash);

    console.log(leaveResponse);

    // Restart game board whenever the player logs out so that the next user does not have messy data
    // g_config.loadBoard();
  }
}

authManeger = new AuthenticationManager();
