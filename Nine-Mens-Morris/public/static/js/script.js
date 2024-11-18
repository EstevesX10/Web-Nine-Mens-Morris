class NavigationManager {
  constructor() {
    // Get all the Navigation Buttons
    this.navButtons = document.querySelectorAll(".nav-btn");

    // Add event listeners to each one to keep track of their behaviour and which one is selected
    this.navButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        // Get the section Id to which we are transitioning into
        this.sectionId = button.getAttribute("data-target");

        // Clean Active Selection
        this.cleanActiveSection();

        // Switch section on button click
        this.updateActiveSection(this.sectionId);
      });
    });
  }

  // Function to clear the active class from the previous content section
  cleanActiveSection() {
    // Get the current active content section
    const section = document.querySelector(".content.active");

    // Update the display of the content to none since we are going to move into another section
    // We perform it before we actually remove the active section in order to create a smooth transition animation
    section.style.display = "none";

    // Remove the active class
    section.classList.remove("active");
  }

  // Function to update the current active content section
  updateActiveSection(sectionId) {
    // Show the target section and fade it in
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      // Update the style of the new active content section in order to provide a smooth transition animation
      targetSection.style.display = "block";

      setTimeout(() => {
        // Trigger the fade-in effect
        targetSection.classList.add("active");

        // Delay to allow the CSS to trigger
      }, 30);
    }
  }

  enableNavItems(show) {
    // Add event listeners to each one to keep track of their behaviour and which one is selected
    this.navButtons.forEach((button) => {
      if (button.getAttribute("data-target") !== "authentication") {
        button.style.display = show ? "" : "none";
      }
    });
  }
}

navManager = new NavigationManager();
