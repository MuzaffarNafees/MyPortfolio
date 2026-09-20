document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
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
    const formStatus = document.getElementById("form-status");
    const fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message")
    };

    const setFieldState = (fieldName, message = "") => {
      const field = fields[fieldName];
      const wrapper = field?.closest(".field");
      const errorNode = document.getElementById(`${fieldName}-error`);

      if (wrapper) {
        wrapper.classList.toggle("has-error", Boolean(message));
      }

      if (errorNode) {
        errorNode.textContent = message;
      }
    };

    const setStatus = (type, message) => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.remove("error", "success", "visible");
      if (message) {
        formStatus.classList.add(type, "visible");
      }
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validateField = (fieldName) => {
      const field = fields[fieldName];
      const value = field?.value.trim() || "";

      if (fieldName === "name" && value.length < 2) {
        setFieldState(fieldName, "Please enter your full name.");
        return false;
      }

      if (fieldName === "email" && !isValidEmail(value)) {
        setFieldState(fieldName, "Please enter a valid email address.");
        return false;
      }

      if (fieldName === "subject" && value.length < 3) {
        setFieldState(fieldName, "Subject must be at least 3 characters long.");
        return false;
      }

      if (fieldName === "message" && value.length < 10) {
        setFieldState(fieldName, "Message must be at least 10 characters long.");
        return false;
      }

      setFieldState(fieldName, "");
      return true;
    };

    Object.keys(fields).forEach((fieldName) => {
      fields[fieldName]?.addEventListener("input", () => validateField(fieldName));
      fields[fieldName]?.addEventListener("blur", () => validateField(fieldName));
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (contactForm.dataset.submitting === "true") {
        return;
      }

      let isValid = true;
      Object.keys(fields).forEach((fieldName) => {
        if (!validateField(fieldName)) {
          isValid = false;
        }
      });

      if (!isValid) {
        setStatus("error", "Please fix the highlighted fields before sending your message.");
        return;
      }

      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const subject = fields.subject.value.trim();
      const message = fields.message.value.trim();

      const button = contactForm.querySelector("button");
      if (!button) return;

      const originalText = button.textContent;
      button.textContent = "Sending...";
      button.disabled = true;
      contactForm.dataset.submitting = "true";
      setStatus("", "");

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

        setStatus("success", "Your message has been sent successfully.");
        contactForm.reset();
        Object.keys(fields).forEach((fieldName) => setFieldState(fieldName, ""));
      } catch (error) {
        setStatus("error", "Something went wrong while sending your message. Please try again.");
      } finally {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.dataset.submitting = "false";
      }
    });
  }
});
