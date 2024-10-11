document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const target = button.getAttribute('data-target');

            sections.forEach(section => {
                section.classList.remove('active');
            });

            document.getElementById(target).classList.add('active');
        });
    });
});