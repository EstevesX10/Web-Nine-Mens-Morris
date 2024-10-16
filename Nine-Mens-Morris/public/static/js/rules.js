document.addEventListener('DOMContentLoaded', function() {
    const topicSlides = document.querySelectorAll('.topic-slide');
    const mainDots = document.querySelectorAll('.main-dot');
    let currentTopic = 0;

    // Handle topic navigation
    mainDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const selectedTopic = parseInt(this.getAttribute('data-topic'));
            changeTopic(selectedTopic);
        });
    });

    function changeTopic(newTopic) {
        topicSlides[currentTopic].classList.remove('active');
        mainDots[currentTopic].classList.remove('active');
        currentTopic = newTopic;
        topicSlides[currentTopic].classList.add('active');
        mainDots[currentTopic].classList.add('active');
    }

    // Handle section navigation inside each topic
    document.querySelectorAll('.slider-container').forEach(container => {
        const slides = container.querySelectorAll('.slide');
        const dots = container.querySelectorAll('.dot');
        let currentSlide = 0;

        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const selectedSlide = parseInt(this.getAttribute('data-slide'));
                changeSlide(selectedSlide);
            });
        });

        function changeSlide(newSlide) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (newSlide + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
    });
});
