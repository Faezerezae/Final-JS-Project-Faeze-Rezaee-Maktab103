"use strict";
document.addEventListener("DOMContentLoaded", async function () {
  const carousel = document.getElementById("indicators-carousel");
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-item]"));
  const nextButton = document.getElementById("nextBtn");
  const getStartedButton = document.getElementById("getStartedBtn");
  const indicators = document.querySelectorAll("[data-carousel-slide-to]");

  let currentSlideIndex = 0;

  function showSlide(index) {
    slides.forEach((slide) => {
      slide.classList.add("hidden");
    });

    slides[index].classList.remove("hidden");
  }

  function updateButtonVisibility() {
    if (currentSlideIndex === 2) {
      nextButton.style.display = "none";
      getStartedButton.style.display = "block";
    } else {
      nextButton.style.display = "block";
      getStartedButton.style.display = "none";
    }
  }

  function updateIndicatorColor(index) {
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.style.backgroundColor = "black";
      } else {
        indicator.style.backgroundColor = "gray"; // بازگرداندن به حالت اولیه
      }
    });
  }

  updateButtonVisibility();

  nextButton.addEventListener("click", function () {
    currentSlideIndex++;

    if (currentSlideIndex >= slides.length) {
      currentSlideIndex = 0;
    }

    showSlide(currentSlideIndex);
    updateButtonVisibility();
    updateIndicatorColor(currentSlideIndex);
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", function () {
      currentSlideIndex = index;
      showSlide(currentSlideIndex);
      updateButtonVisibility();
      updateIndicatorColor(currentSlideIndex);
    });
  });

  getStartedButton.addEventListener("click", async function () {
    window.location.href = "/login";
  });
});
