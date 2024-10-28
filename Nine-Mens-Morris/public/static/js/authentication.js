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

    // Here, you could make an AJAX call or fetch request to send the data to a server.
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

    logregBox.classList.remove("login");
    logregBox.classList.remove("register");
    logregBox.classList.add("account");

    // Similarly, you could send the data to a server here.
  });

  // Register Form Submission
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

    // Similarly, you could send the data to a server here.
  });
});
