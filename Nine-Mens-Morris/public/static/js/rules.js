class Rules {
  constructor() {
    this.topicSlides = document.querySelectorAll(".topic-slide");
    this.currentTopic = 0;
    this.startRules();
  }

  startRules() {
    // Adicionar event listeners para as setas
    document.getElementById("prev-topic").addEventListener("click", () => {
      this.changeTopic(this.currentTopic - 1, "prev");
    });

    document.getElementById("next-topic").addEventListener("click", () => {
      this.changeTopic(this.currentTopic + 1, "next");
    });

    // Handle section navigation inside each topic
    document.querySelectorAll(".slider-container").forEach((container) => {
      const slides = container.querySelectorAll(".slide");
      const dots = container.querySelectorAll(".dot");
      let currentSlide = 0;

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          const selectedSlide = parseInt(dot.getAttribute("data-slide"));
          currentSlide = this.changeSlide(
            slides,
            dots,
            currentSlide,
            selectedSlide
          );
        });
      });
    });
  }

  changeSlide(slides, dots, currentSlide, newSlide) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (newSlide + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
    return currentSlide;
  }

  changeTopic(newTopic, direction) {
    // Remove all classes
    this.topicSlides.forEach((slide) => {
      slide.classList.remove("active", "prev", "next");
    });

    // Define the swipe direction
    if (direction === "next") {
      this.topicSlides[this.currentTopic].classList.add("prev");
    } else if (direction === "prev") {
      this.topicSlides[this.currentTopic].classList.add("next");
    }

    // Update the index of the current topic (evitar valores negativos ou superiores ao número de slides)
    const totalSlides = this.topicSlides.length;
    this.currentTopic = (newTopic + totalSlides) % totalSlides;

    // Adiciona a classe 'active' ao novo slide
    this.topicSlides[this.currentTopic].classList.add("active");
  }
}

const rules = new Rules();
