// script.js
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     0) UTILITIES (small + reusable helpers)
  ===================================================== */

  // Fetch + inject HTML into a placeholder element (navbar/footer)
  const injectHTML = async (placeholderEl, filePath) => {
    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      placeholderEl.innerHTML = html;
    } catch (err) {
      console.error(`${filePath} load failed:`, err);
    }
  };

  // Lock/unlock page scroll (modal open/close)
  const setScrollLock = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
  };

  // Escape key helper (single listener)
  const onEscape = (callback) => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") callback(e);
    });
  };

  /* =====================================================
     1) NAVBAR: LOAD + ACTIVE STATE
  ===================================================== */
  const navbarPlaceholder = document.getElementById("navbar-placeholder");

  if (navbarPlaceholder) {
    injectHTML(navbarPlaceholder, "navbar.html").then(() => {
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

      document.querySelectorAll(".nav-link").forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === currentPage);
      });
    });
  }

  /* =====================================================
     2) FOOTER: LOAD
  ===================================================== */
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) injectHTML(footerPlaceholder, "footer.html");

  /* =====================================================
     3) FADE-IN ON SCROLL (case cards + timeline items)
  ===================================================== */
  const fadeSections = document.querySelectorAll(
    ".fade-section, .timeline-item"
  );

  const revealOnScroll = () => {
    fadeSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) section.classList.add("visible");
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* =====================================================
     4) HERO CAROUSEL PLAY/PAUSE (Homepage only)
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
     5) LIGHTBOX (Photoshop / Art section)
  ===================================================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  const openLightbox = (imgSrc) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightbox.classList.add("active");
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  };

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".case-image img, .thumb-img").forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(img.src));
    });

    // Click anywhere on overlay closes
    lightbox.addEventListener("click", closeLightbox);
  }

  /* =====================================================
     6) WEB PROJECT MODAL + BOOTSTRAP CAROUSEL
  ===================================================== */

  const projectModal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalMeta = document.getElementById("modal-meta");
  const modalClose = projectModal?.querySelector(".modal-close");

  const carouselEl = document.getElementById("projectCarousel");
  const carouselInner = document.getElementById("project-carousel-inner");
  const indicators = document.getElementById("project-carousel-indicators");

  // Optional caption line you already have in HTML
  const slideCaptionEl = document.getElementById("slide-caption");

  // Minimum number of slides the modal should show (pads with placeholders)
  const MIN_SLIDES_PER_PROJECT = 5;

  // Prevent multiple Bootstrap instances from stacking
  let projectCarouselInstance = null;

  // Modal focus + keyboard state
  let lastFocusedEl = null;
  let modalKeyHandler = null;

  const hasProjectModal =
    projectModal &&
    modalTitle &&
    modalDescription &&
    modalMeta &&
    modalClose &&
    carouselEl &&
    carouselInner &&
    indicators;

  if (hasProjectModal) {
    /* ---------------------
       6A) PROJECT DATA
    --------------------- */
    const projects = {
      inkspression: {
        title: "Inkspression",
        overview:
          "A neurodivergent-friendly journaling and reflection platform designed to support emotional regulation without overwhelm.",
        meta: "Role: UX/UI Designer & Front-End Developer · Stack: React, Tailwind, Firebase",
        slides: [
          {
            src: "images/inkspression/dashboard.jpg",
            heading: "Dashboard",
            caption: "Gentle overview of mood, prompts, and recent entries.",
          },
          {
            src: "images/inkspression/theme.jpg",
            heading: "Theme Selection",
            caption: "Sensory-friendly themes designed for comfort and clarity.",
          },
          {
            src: "images/inkspression/entry.jpg",
            heading: "Entry Screen",
            caption: "Focused writing environment for expressive journaling.",
          },
        ],
        caseStudy: {
          problem:
            "Many journaling and productivity tools rely on rigid prompts, dense dashboards, or gamified pressure that increases anxiety instead of reducing it.",
          goals: [
            "Reduce cognitive load during reflection",
            "Support emotional safety and self-paced use",
            "Ensure accessibility across themes and layouts",
          ],
          decisions: [
            "Low-density layouts with generous spacing to minimize overwhelm",
            "Theme customization to support different emotional states",
            "Avoidance of streaks or punitive language",
          ],
          reflection:
            "Inkspression reinforced the importance of emotional context in UX. Future iterations would include usability testing with neurodivergent users.",
        },
      },

      inkspresso: {
        title: "Inkspresso — Fuel Your Imagination",
        overview:
          "A cozy café-inspired eCommerce and digital library experience designed for mindful browsing.",
        meta: "Role: UX/UI Designer & Full-Stack Developer · Stack: Node.js, Express, MongoDB",
        slides: [
          {
            src: "images/inkspresso/dashboard.png",
            heading: "Dashboard",
            caption: "Central hub connecting café and library experiences.",
          },
          {
            src: "images/inkspresso/menu.jpg",
            heading: "Café Menu",
            caption: "Warm, low-pressure browsing of drinks and treats.",
          },
          {
            src: "images/inkspresso/library.png",
            heading: "Library View",
            caption: "Exploration-focused book discovery experience.",
          },

          // ADD MORE SLIDES 👇
          // {
          //   src: "images/inkspresso/checkout.jpg",
          //   heading: "Checkout",
          //   caption: "Low-friction checkout flow with calm visual hierarchy.",
          // },
          // {
          //   src: "images/inkspresso/product.jpg",
          //   heading: "Product Page",
          //   caption: "Warm product detail layout with simple add-to-cart actions.",
          // },
        ],
        caseStudy: {
          problem:
            "Many eCommerce platforms overwhelm users with aggressive CTAs and dense layouts, making browsing feel transactional.",
          goals: [
            "Create a calm, inviting browsing experience",
            "Separate exploration from purchase decisions",
            "Support long-form discovery",
          ],
          decisions: [
            "Separated café and library modes to reduce decision pressure",
            "Dark-mode-first design for extended sessions",
            "Clear hierarchy prioritizing exploration over conversion",
          ],
          reflection:
            "This project strengthened my approach to calm commerce UX and information architecture.",
        },
      },

      anniime: {
        title: "AnniiMe Finder",
        overview:
          "A guided anime discovery platform that helps new viewers navigate a vast catalog without decision fatigue.",
        meta: "Role: Product Designer & Front-End Developer · Stack: React, JavaScript, Jikan API",
        slides: [
          {
            src: "images/anniime/home-light.jpg",
            heading: "Landing — Light Mode",
            caption: "Low-stimulation entry point for new users.",
          },
          {
            src: "images/anniime/quiz-dark.jpg",
            heading: "Onboarding Quiz",
            caption: "Mood-based quiz guiding discovery.",
          },
          {
            src: "images/anniime/search-dark.jpg",
            heading: "Results View",
            caption: "Digestible recommendation grouping.",
          },
        ],
        caseStudy: {
          problem:
            "New anime viewers often feel overwhelmed by large catalogs and complex genre systems.",
          goals: [
            "Reduce decision fatigue",
            "Guide discovery through preference",
            "Make recommendations approachable",
          ],
          decisions: [
            "Quiz-based onboarding instead of open search",
            "Clear grouping of recommendations",
            "Consistent layouts across themes",
          ],
          reflection:
            "AnniiMe Finder highlighted the value of guided discovery for first-time users.",
        },
      },
    };

    /* ---------------------
       6B) MODAL CONTENT HELPERS
    --------------------- */

    const renderCaseStudyHTML = (project) => `
      <h4>Overview</h4>
      <p>${project.overview}</p>

      <h4>Problem</h4>
      <p>${project.caseStudy.problem}</p>

      <h4>UX Goals</h4>
      <ul>${project.caseStudy.goals.map((g) => `<li>${g}</li>`).join("")}</ul>

      <h4>Key UX Decisions</h4>
      <ul>${project.caseStudy.decisions.map((d) => `<li>${d}</li>`).join("")}</ul>

      <h4>Reflection</h4>
      <p>${project.caseStudy.reflection}</p>

      <p class="small text-muted mt-3">
        Design iterations were explored directly in high-fidelity UI and code,
        allowing continuous refinement without separate wireframes.
      </p>
    `;

    const buildSlide = (slide, isActive) => `
      <div class="carousel-item ${isActive ? "active" : ""}">
        <img
          src="${slide.src}"
          class="d-block w-100 modal-slide-img"
          alt="${slide.heading}"
          loading="lazy"
        >
        <div class="carousel-caption">
          <h5>${slide.heading}</h5>
          <p>${slide.caption}</p>
        </div>
      </div>
    `;

    const buildPlaceholderSlide = (projectKey, slideIndex, isActive) => `
      <div class="carousel-item ${isActive ? "active" : ""}">
        <div class="modal-placeholder">
          <div class="modal-placeholder-inner">
            <div class="modal-placeholder-title">Image placeholder</div>
            <div class="modal-placeholder-sub">
              Add a future screenshot/mockup when ready.
            </div>
            <code class="modal-placeholder-code">
              images/${projectKey}/your-image-${slideIndex + 1}.jpg
            </code>
          </div>
        </div>

        <div class="carousel-caption">
          <h5>Coming Soon</h5>
          <p>Add a slide image + caption in your project data.</p>
        </div>
      </div>
    `;

    const buildIndicator = (index, isActive) => `
      <button
        type="button"
        data-bs-target="#projectCarousel"
        data-bs-slide-to="${index}"
        class="${isActive ? "active" : ""}"
        aria-label="Slide ${index + 1}"
        ${isActive ? 'aria-current="true"' : ""}
      ></button>
    `;

    const getCarouselInstance = () => {
      if (!window.bootstrap) return null;

      const existing = bootstrap.Carousel.getInstance(carouselEl);
      if (existing) {
        projectCarouselInstance = existing;
        return existing;
      }

      projectCarouselInstance =
        projectCarouselInstance ||
        new bootstrap.Carousel(carouselEl, {
          interval: false,
          ride: false,
          keyboard: false, // we handle arrows ourselves
        });

      return projectCarouselInstance;
    };

    /* ---------------------
       6C) MODAL ACCESSIBILITY (focus + keyboard)
    --------------------- */

    const getFocusableEls = (root) => {
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        '[role="button"]',
        '[tabindex]:not([tabindex="-1"])',
      ];

      return Array.from(root.querySelectorAll(selectors.join(","))).filter(
        (el) => el.offsetParent !== null
      );
    };

    const trapFocus = (e) => {
      if (e.key !== "Tab") return;

      const focusables = getFocusableEls(projectModal);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const updateSlideCaption = () => {
      if (!slideCaptionEl) return;

      const active = carouselInner.querySelector(".carousel-item.active");
      if (!active) return;

      const captionText =
        active.querySelector(".carousel-caption p")?.textContent || "";
      slideCaptionEl.textContent = captionText;
    };

    const enableModalKeys = (carousel) => {
      modalKeyHandler = (e) => {
        if (!projectModal.classList.contains("active")) return;

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          carousel?.prev();
          return;
        }

        if (e.key === "ArrowRight") {
          e.preventDefault();
          carousel?.next();
          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          closeProjectModal();
          return;
        }

        if (
          (e.key === "Enter" || e.key === " ") &&
          document.activeElement === modalClose
        ) {
          e.preventDefault();
          closeProjectModal();
          return;
        }

        trapFocus(e);
      };

      document.addEventListener("keydown", modalKeyHandler);
    };

    const disableModalKeys = () => {
      if (!modalKeyHandler) return;
      document.removeEventListener("keydown", modalKeyHandler);
      modalKeyHandler = null;
    };

    /* ---------------------
       6D) OPEN / CLOSE MODAL
    --------------------- */

    const openProjectModal = (projectKey) => {
      const project = projects[projectKey];
      if (!project) return;

      // Fill text content
      modalTitle.textContent = project.title;
      modalMeta.textContent = project.meta;
      modalDescription.innerHTML = renderCaseStudyHTML(project);

      // Reset carousel DOM
      carouselInner.innerHTML = "";
      indicators.innerHTML = "";

      // Build slides (pads with placeholders to keep modal layout consistent)
      const slides = Array.isArray(project.slides) ? project.slides : [];
      const totalSlides = Math.max(slides.length, MIN_SLIDES_PER_PROJECT);

      for (let i = 0; i < totalSlides; i++) {
        const isActive = i === 0;

        carouselInner.insertAdjacentHTML(
          "beforeend",
          slides[i]
            ? buildSlide(slides[i], isActive)
            : buildPlaceholderSlide(projectKey, i, isActive)
        );

        indicators.insertAdjacentHTML("beforeend", buildIndicator(i, isActive));
      }

      // Ensure carousel is ready + reset to slide 1
      const carousel = getCarouselInstance();
      if (carousel) carousel.to(0);

      // Save the element that opened the modal
      lastFocusedEl = document.activeElement;

      // Show modal
      projectModal.classList.add("active");
      projectModal.setAttribute("aria-hidden", "false");
      setScrollLock(true);

      // Focus the modal container (needs tabindex="-1" in HTML)
      projectModal.focus();

      // Enable keyboard controls + keep caption in sync
      enableModalKeys(carousel);
      updateSlideCaption();

      carouselEl.addEventListener("slid.bs.carousel", updateSlideCaption);
    };

    const closeProjectModal = () => {
      projectModal.classList.remove("active");
      projectModal.setAttribute("aria-hidden", "true");
      setScrollLock(false);

      disableModalKeys();

      // Reset slide on close (optional but keeps it consistent)
      if (projectCarouselInstance) projectCarouselInstance.to(0);

      // Return focus to the button that launched the modal
      if (lastFocusedEl) lastFocusedEl.focus();
      lastFocusedEl = null;

      // Stop caption updates when closed
      carouselEl.removeEventListener("slid.bs.carousel", updateSlideCaption);
    };

    /* ---------------------
       6E) EVENTS (open + close)
    --------------------- */

    document.querySelectorAll(".btn-web[data-project]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openProjectModal(btn.dataset.project);
      });
    });

    modalClose.addEventListener("click", closeProjectModal);

    // Make the "X" work with Enter/Space (needs tabindex/role in HTML)
    modalClose.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeProjectModal();
      }
    });

    // Only close when clicking the overlay (not inside modal content)
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) closeProjectModal();
    });

    // Global Escape only handles lightbox now (modal handles its own Escape)
    onEscape(() => {
      if (lightbox?.classList.contains("active")) closeLightbox();
    });
  } else {
    // If modal doesn't exist on this page, Escape should still close lightbox
    onEscape(() => {
      if (lightbox?.classList.contains("active")) closeLightbox();
    });
  }
});
