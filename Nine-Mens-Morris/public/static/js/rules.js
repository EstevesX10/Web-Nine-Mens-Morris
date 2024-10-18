document.addEventListener('DOMContentLoaded', function () {
    const topicSlides = document.querySelectorAll('.topic-slide');
    let currentTopic = 0;

    // Função para gerir os slides
    function changeTopic(newTopic, direction) {
        // Remove todas as classes antes de atualizar o estado
        topicSlides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });

        // Definir o comportamento do swipe baseado na direção
        if (direction === 'next') {
            topicSlides[currentTopic].classList.add('prev'); // O slide atual sai para a esquerda
        } else if (direction === 'prev') {
            topicSlides[currentTopic].classList.add('next'); // O slide atual sai para a direita
        }

        // Atualiza o índice do tópico atual (evitar valores negativos ou superiores ao número de slides)
        const totalSlides = topicSlides.length;
        currentTopic = (newTopic + totalSlides) % totalSlides;

        // Adiciona a classe 'active' ao novo slide
        topicSlides[currentTopic].classList.add('active');
    }

    // Adicionar event listeners para as setas
    document.getElementById('prev-topic').addEventListener('click', function () {
        changeTopic(currentTopic - 1, 'prev');
    });

    document.getElementById('next-topic').addEventListener('click', function () {
        changeTopic(currentTopic + 1, 'next');
    });

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