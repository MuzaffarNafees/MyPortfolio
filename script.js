document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("is-open");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("is-open");
    });
  });

  const revealEls = document.querySelectorAll(
    ".about-card, .info-card, .stack-block, .profile-card, .mini-stats div, .contact-card, .contact-form, .ai-panel"
  );

  revealEls.forEach((el) => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));

  const heroCard = document.querySelector(".profile-card");

  if (heroCard) {
    heroCard.addEventListener("pointermove", (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 14;
      const rotateX = (0.5 - y) * 14;
      heroCard.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-10px)`;
    });

    heroCard.addEventListener("pointerleave", () => {
      heroCard.style.transform = "perspective(1200px) rotateY(-6deg) rotateX(2deg)";
    });
  }

  if (typeof Typed !== "undefined") {
    const typed = new Typed(".typed-text", {
      strings: [
        "Playwright",
        "Cypress",
        "Selenium",
        "REST Assured",
        "Cucumber & BDD",
        "AI-led Quality Engineering"
      ],
      typeSpeed: 95,
      backSpeed: 55,
      loop: true,
      showCursor: true,
      cursorChar: "|"
    });
  }

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const subject = document.getElementById("subject")?.value.trim();
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !subject || !message) {
        alert("Please fill in all the required information before sending your message.");
        return;
      }

      const button = contactForm.querySelector("button");
      if (!button) return;

      const originalText = button.textContent;
      button.textContent = "Sending...";
      button.disabled = true;

      try {
        const response = await fetch("https://formsubmit.co/ajax/muzaffarnafees536@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message
          })
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        alert("Your message has been sent successfully.");
        contactForm.reset();
      } catch (error) {
        alert("Something went wrong while sending your message. Please try again.");
      } finally {
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  }
});
