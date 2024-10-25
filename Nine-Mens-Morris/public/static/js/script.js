document.addEventListener('DOMContentLoaded', () => {
    // Function to switch between sections
    function switchSection(targetId) {
      // Get all sections and navigation buttons
      const sections = document.querySelectorAll('.content');
      const buttons = document.querySelectorAll('.nav-btn');
      buttons.forEach(button => {
        button.addEventListener('click', function () {
            const target = button.getAttribute('data-target');

            // Remove all active classes from the buttons
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Add the active class to the section currently selected
            document.getElementById(target).classList.add('active');
        });
     });
  
      // Show the target section and fade it in
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = 'block';
        setTimeout(() => {
          // Trigger the fade-in effect
          targetSection.classList.add('active'); 
          // Delay to allow the CSS to trigger
        }, 10); 
      }
    }
  
    // Example navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const targetId = button.getAttribute('data-target');
        // Switch section on button click
        switchSection(targetId); 
      });
    });
  });
  