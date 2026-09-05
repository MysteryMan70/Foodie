const counters = document.querySelectorAll(".numDetails span");

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const targetText = counter.textContent.trim();

      const target = targetText.includes("K")
        ? parseFloat(targetText) * 1000
        : parseInt(targetText);

      const duration = 1200;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.floor(easeProgress * target);

        if (progress === 1) {
          counter.textContent = target >= 1000 ? "10K" : target;
        } else if (target >= 1000) {
          const value = currentValue / 1000;

          counter.textContent = value >= 9.9 ? "9.9K" : value.toFixed(1) + "K";
        } else {
          counter.textContent = currentValue;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);

      observer.unobserve(counter);
    });
  },
  {
    threshold: 0.5,
  },
);

counters.forEach((counter) => {
  observer.observe(counter);
});

const chooseCards = document.querySelectorAll(".chooseCard");

const chooseObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        chooseCards.forEach((card) => {
          card.classList.add("show");
        });

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

const whyChooseSection = document.querySelector(".whyChoose");

chooseObserver.observe(whyChooseSection);
