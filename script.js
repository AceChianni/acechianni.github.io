// script.js
document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     LOAD NAVBAR + ACTIVE STATE
  ===================================================== */
  const navbarPlaceholder = document.getElementById("navbar-placeholder");

  if (navbarPlaceholder) {
    fetch("navbar.html")
      .then(res => res.text())
      .then(html => {
        navbarPlaceholder.innerHTML = html;

        const currentPage =
          window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".nav-link").forEach(link => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === currentPage);
        });
      })
      .catch(err => console.error("Navbar load failed:", err));
  }

  /* =====================================================
     LOAD FOOTER
  ===================================================== */
  const footerPlaceholder = document.getElementById("footer-placeholder");

  if (footerPlaceholder) {
    fetch("footer.html")
      .then(res => res.text())
      .then(html => (footerPlaceholder.innerHTML = html))
      .catch(err => console.error("Footer load failed:", err));
  }

  /* =====================================================
     FADE-IN ANIMATION ON SCROLL
  ===================================================== */
  const fadeSections = document.querySelectorAll(".fade-section, .timeline-item");

  function revealOnScroll() {
    fadeSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* =====================================================
     HERO CAROUSEL PLAY / PAUSE
  ===================================================== */
  const heroCarouselEl = document.querySelector("#carouselNav");
  const pauseBtn = document.querySelector("#pauseCarousel");
  const playBtn = document.querySelector("#playCarousel");

  if (heroCarouselEl && pauseBtn && playBtn && window.bootstrap) {
    const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
      interval: 4000,
    });

    pauseBtn.addEventListener("click", () => {
      heroCarousel.pause();
      pauseBtn.classList.add("active");
      playBtn.classList.remove("active");
    });

    playBtn.addEventListener("click", () => {
      heroCarousel.cycle();
      playBtn.classList.add("active");
      pauseBtn.classList.remove("active");
    });
  }

  /* =====================================================
     LIGHTBOX FOR ART / PHOTOSHOP
  ===================================================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".case-image img, .thumb-img").forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
      });
    });

    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("active");
      lightboxImg.src = "";
    });
  }

  /* =====================================================
     WEB PROJECT CASE STUDIES (UX + CAROUSEL)
  ===================================================== */
  const projectModal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalMeta = document.getElementById("modal-meta");
  const modalClose = projectModal?.querySelector(".modal-close");

  const carouselEl = document.getElementById("projectCarousel");
  const carouselInner = document.getElementById("project-carousel-inner");
  const indicators = document.getElementById("project-carousel-indicators");

  if (
    projectModal &&
    modalTitle &&
    modalDescription &&
    modalMeta &&
    carouselEl &&
    carouselInner &&
    indicators
  ) {

    /* =====================
       PROJECT DATA
    ===================== */
    const projects = {
      inkspression: {
        title: "Inkspression",
        overview:
          "A neurodivergent-friendly journaling and reflection platform designed to support emotional regulation without overwhelm.",
        meta:
          "Role: UX/UI Designer & Front-End Developer · Stack: React, Tailwind, Firebase",
        slides: [
          {
            src: "images/inkspression/dashboard.jpg",
            heading: "Dashboard",
            caption: "Gentle overview of mood, prompts, and recent entries."
          },
          {
            src: "images/inkspression/theme.jpg",
            heading: "Theme Selection",
            caption: "Sensory-friendly themes designed for comfort and clarity."
          },
          {
            src: "images/inkspression/entry.jpg",
            heading: "Entry Screen",
            caption: "Focused writing environment for expressive journaling."
          }
        ],
        caseStudy: {
          problem:
            "Many journaling and productivity tools rely on rigid prompts, dense dashboards, or gamified pressure that increases anxiety instead of reducing it.",
          goals: [
            "Reduce cognitive load during reflection",
            "Support emotional safety and self-paced use",
            "Ensure accessibility across themes and layouts"
          ],
          decisions: [
            "Low-density layouts with generous spacing to minimize overwhelm",
            "Theme customization to support different emotional states",
            "Avoidance of streaks or punitive language"
          ],
          reflection:
            "Inkspression reinforced the importance of emotional context in UX. Future iterations would include usability testing with neurodivergent users."
        }
      },

      inkspresso: {
        title: "Inkspresso — Fuel Your Imagination",
        overview:
          "A cozy café-inspired eCommerce and digital library experience designed for mindful browsing.",
        meta:
          "Role: UX/UI Designer & Full-Stack Developer · Stack: Node.js, Express, MongoDB",
        slides: [
          {
            src: "images/inkspresso/dashboard.png",
            heading: "Dashboard",
            caption: "Central hub connecting café and library experiences."
          },
          {
            src: "images/inkspresso/home.png",
            heading: "Café Menu",
            caption: "Warm, low-pressure browsing of drinks and treats."
          },
          {
            src: "images/inkspresso/library.png",
            heading: "Library View",
            caption: "Exploration-focused book discovery experience."
          }
        ],
        caseStudy: {
          problem:
            "Many eCommerce platforms overwhelm users with aggressive CTAs and dense layouts, making browsing feel transactional.",
          goals: [
            "Create a calm, inviting browsing experience",
            "Separate exploration from purchase decisions",
            "Support long-form discovery"
          ],
          decisions: [
            "Separated café and library modes to reduce decision pressure",
            "Dark-mode-first design for extended sessions",
            "Clear hierarchy prioritizing exploration over conversion"
          ],
          reflection:
            "This project strengthened my approach to calm commerce UX and information architecture."
        }
      },

      anniime: {
        title: "AnniiMe Finder",
        overview:
          "A guided anime discovery platform that helps new viewers navigate a vast catalog without decision fatigue.",
        meta:
          "Role: Product Designer & Front-End Developer · Stack: React, JavaScript, Jikan API",
        slides: [
          {
            src: "images/anniime/home-light.jpg",
            heading: "Landing — Light Mode",
            caption: "Low-stimulation entry point for new users."
          },
          {
            src: "images/anniime/quiz-dark.jpg",
            heading: "Onboarding Quiz",
            caption: "Mood-based quiz guiding discovery."
          },
          {
            src: "images/anniime/search-dark.jpg",
            heading: "Results View",
            caption: "Digestible recommendation grouping."
          }
        ],
        caseStudy: {
          problem:
            "New anime viewers often feel overwhelmed by large catalogs and complex genre systems.",
          goals: [
            "Reduce decision fatigue",
            "Guide discovery through preference",
            "Make recommendations approachable"
          ],
          decisions: [
            "Quiz-based onboarding instead of open search",
            "Clear grouping of recommendations",
            "Consistent layouts across themes"
          ],
          reflection:
            "AnniiMe Finder highlighted the value of guided discovery for first-time users."
        }
      }
    };

    /* =====================
       OPEN CASE STUDY
    ===================== */
    document.querySelectorAll(".btn-web[data-project]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();

        const project = projects[btn.dataset.project];
        if (!project) return;

        modalTitle.textContent = project.title;
        modalMeta.textContent = project.meta;

        modalDescription.innerHTML = `
          <h4>Overview</h4>
          <p>${project.overview}</p>

          <h4>Problem</h4>
          <p>${project.caseStudy.problem}</p>

          <h4>UX Goals</h4>
          <ul>${project.caseStudy.goals.map(g => `<li>${g}</li>`).join("")}</ul>

          <h4>Key UX Decisions</h4>
          <ul>${project.caseStudy.decisions.map(d => `<li>${d}</li>`).join("")}</ul>

          <h4>Reflection</h4>
          <p>${project.caseStudy.reflection}</p>

          <p class="small text-muted mt-3">
            Design iterations were explored directly in high-fidelity UI and code,
            allowing continuous refinement without separate wireframes.
          </p>
        `;

        carouselInner.innerHTML = "";
        indicators.innerHTML = "";

        project.slides.forEach((slide, i) => {
          carouselInner.insertAdjacentHTML(
            "beforeend",
            `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
              <img src="${slide.src}" class="d-block w-100 modal-slide-img" alt="${slide.heading}">
              <div class="carousel-caption">
                <h5>${slide.heading}</h5>
                <p>${slide.caption}</p>
              </div>
            </div>
          `
          );

          indicators.insertAdjacentHTML(
            "beforeend",
            `<button type="button" data-bs-target="#projectCarousel" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}"></button>`
          );
        });

        new bootstrap.Carousel(carouselEl, { interval: false });
        projectModal.classList.add("active");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    /* =====================
       CLOSE MODAL
    ===================== */
    const closeModal = () => {
      projectModal.classList.remove("active");
      projectModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    modalClose?.addEventListener("click", closeModal);

    projectModal.addEventListener("click", e => {
      if (e.target === projectModal) closeModal();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && projectModal.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
