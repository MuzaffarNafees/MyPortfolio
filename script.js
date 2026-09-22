document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const scrollProgress = document.querySelector(".scroll-progress");
  const cursorGlow = document.querySelector(".cursor-glow");

  const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  if (cursorGlow && supportsHover && !prefersReducedMotion) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sectionLinks = [...navLinks].filter((link) => link.hash && link.pathname === window.location.pathname);
  const trackedSections = sectionLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  if (trackedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((link) => {
            link.classList.toggle("is-current", link.hash === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-30% 0px -55%", threshold: 0 }
    );

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  if (!prefersReducedMotion) {
    document.querySelectorAll('a[href*="contact.html"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented || link.target === "_blank") return;

        event.preventDefault();
        const transition = document.createElement("div");
        transition.className = "page-transition";
        transition.innerHTML = `
          <p class="page-transition-brand" aria-hidden="true">Muzaffar<span>Nafees</span></p>
          <div class="page-transition-mark" aria-hidden="true"><span></span></div>
        `;
        document.body.appendChild(transition);
        document.body.classList.add("is-leaving");

        window.setTimeout(() => {
          window.location.href = link.href;
        }, 520);
      });
    });

    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        button.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      });
    });

    if (supportsHover) {
      document.querySelectorAll(".project-card, .info-card, .stack-block, .quote-panel").forEach((card) => {
        card.classList.add("tilt-card");
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--tilt-x", `${y * -4}deg`);
          card.style.setProperty("--tilt-y", `${x * 4}deg`);
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        });
      });
    }
  }

  const revealEls = document.querySelectorAll(
    ".about-card, .info-card, .stack-block, .profile-card, .mini-stats div, .project-card, .contact-card, .contact-form, .ai-panel, .quote-panel, .flow-block, .multi-stack"
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

  const architectureSteps = document.querySelectorAll(".architecture-step");
  const architectureConnectors = document.querySelectorAll(".architecture-flow .connector");
  const architectureTitle = document.getElementById("architecture-detail-title");
  const architectureCopy = document.getElementById("architecture-detail-copy");
  const architecturePlay = document.querySelector(".architecture-play");
  const architectureProgress = document.querySelector(".architecture-progress span");
  const architectureStatus = document.getElementById("architecture-status");
  const architecturePlayIcon = architecturePlay?.querySelector("i");
  const architectureDetails = {
    cases: {
      title: "Test Cases",
      copy: "Start with clear, risk-based scenarios that describe the behavior customers and teams actually depend on."
    },
    bdd: {
      title: "Cucumber / BDD",
      copy: "Turn shared product language into executable examples that keep engineering, QA, and stakeholders aligned."
    },
    steps: {
      title: "Step Definitions",
      copy: "Keep the intent readable while mapping each scenario to reusable, maintainable automation behavior."
    },
    layers: {
      title: "Page / API Layer",
      copy: "Separate product actions from test intent so UI and API coverage can evolve without brittle duplication."
    },
    reporting: {
      title: "Allure / Extent",
      copy: "Make failures useful with clear evidence, readable reports, and enough context to move quickly from red to resolution."
    },
    pipeline: {
      title: "GitHub Actions",
      copy: "Run the right checks at the right point in the delivery pipeline, turning quality into a continuous team habit."
    }
  };

  const activateArchitectureStep = (step, shouldFocus = false) => {
    const detail = architectureDetails[step.dataset.step];
    if (!detail || !architectureTitle || !architectureCopy) return;

    architectureSteps.forEach((item) => {
      const isActive = item === step;
      item.classList.toggle("is-active", isActive);
      item.classList.remove("is-pulse");
      item.setAttribute("aria-expanded", String(isActive));
    });

    step.classList.add("is-pulse");

    architectureTitle.textContent = detail.title;
    architectureCopy.textContent = detail.copy;

    const stepIndex = [...architectureSteps].indexOf(step);
    if (architectureProgress) {
      architectureProgress.style.width = `${((stepIndex + 1) / architectureSteps.length) * 100}%`;
    }

    if (architectureStatus && !architecturePlay?.disabled) {
      architectureStatus.textContent = `Stage ${stepIndex + 1} of ${architectureSteps.length}: ${detail.title}.`;
    }

    if (shouldFocus) {
      step.focus();
    }
  };

  architectureSteps.forEach((step) => {
    step.addEventListener("click", () => activateArchitectureStep(step));
  });

  if (architecturePlay && architectureSteps.length) {
    architecturePlay.addEventListener("click", () => {
      architecturePlay.disabled = true;
      architecturePlay.classList.remove("is-complete");
      architecturePlay.querySelector("span").textContent = "Tracing...";
      architecturePlayIcon?.classList.replace("fa-play", "fa-route");
      let currentIndex = 0;

      const playNext = () => {
        architectureConnectors.forEach((connector) => connector.classList.remove("is-live"));
        activateArchitectureStep(architectureSteps[currentIndex]);

        if (currentIndex > 0 && architectureConnectors[currentIndex - 1]) {
          architectureConnectors[currentIndex - 1].classList.add("is-live");
        }

        if (architectureStatus) {
          architectureStatus.textContent = `Stage ${currentIndex + 1} of ${architectureSteps.length}: ${architectureDetails[architectureSteps[currentIndex].dataset.step].title}.`;
        }

        currentIndex += 1;

        if (currentIndex < architectureSteps.length) {
          window.setTimeout(playNext, 700);
        } else {
          window.setTimeout(() => {
            architectureConnectors.forEach((connector) => connector.classList.add("is-live"));
            architecturePlay.classList.add("is-complete");
            architecturePlay.disabled = false;
            architecturePlay.querySelector("span").textContent = "Flow complete";
            architecturePlayIcon?.classList.replace("fa-route", "fa-rotate-right");
            if (architectureStatus) {
              architectureStatus.textContent = "Flow complete. Quality is now part of the release signal.";
            }

            window.setTimeout(() => {
              architecturePlay.classList.remove("is-complete");
              architecturePlay.querySelector("span").textContent = "Play again";
              architecturePlayIcon?.classList.replace("fa-rotate-right", "fa-play");
            }, 1800);
          }, 700);
        }
      };

      playNext();
    });
  }

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

    const params = new URLSearchParams(window.location.search);
    const resumeNote = document.getElementById("resume-note");
    const contactEyebrow = document.getElementById("contact-eyebrow");
    const contactHeading = document.getElementById("contact-heading");

    if (params.get("request") === "resume") {
      if (contactEyebrow) {
        contactEyebrow.textContent = "Resume request";
      }

      if (contactHeading) {
        contactHeading.textContent = "Request my resume.";
      }

      if (resumeNote) {
        resumeNote.classList.add("visible");
      }

      if (fields.subject) {
        fields.subject.value = "Resume request";
      }
    }

    const setFieldState = (fieldName, message = "") => {
      const field = fields[fieldName];
      const wrapper = field?.closest(".field");
      const errorNode = document.getElementById(`${fieldName}-error`);

      if (wrapper) {
        wrapper.classList.toggle("has-error", Boolean(message));
      }

      if (field) {
        field.setAttribute("aria-invalid", String(Boolean(message)));
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
