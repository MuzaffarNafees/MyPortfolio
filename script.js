document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
    });
  });

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

  const contactForm = document.querySelector(".contact-form");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const originalText = button.textContent;
    button.textContent = "Message Sent";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
});
