// script.js
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     0) UTILITIES
  ===================================================== */

  const injectHTML = async (placeholderEl, filePath) => {
    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      placeholderEl.innerHTML = await res.text();
    } catch (err) {
      console.error(`${filePath} load failed:`, err);
    }
  };

  const setScrollLock = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =====================================================
     1) NAVBAR + FOOTER
  ===================================================== */

  const navbarPlaceholder = qs("#navbar-placeholder");
  if (navbarPlaceholder) {
    injectHTML(navbarPlaceholder, "navbar.html").then(() => {
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      qsa(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === currentPage);
      });
    });
  }

  const footerPlaceholder = qs("#footer-placeholder");
  if (footerPlaceholder) injectHTML(footerPlaceholder, "footer.html");

  /* =====================================================
     2) FADE-IN ON SCROLL
  ===================================================== */

  const fadeSections = qsa(".fade-section, .timeline-item");

  const revealOnScroll = () => {
    fadeSections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight - 100) {
        section.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  /* =====================================================
     3) HERO CAROUSEL (Homepage only)
  ===================================================== */

  const heroCarouselEl = qs("#carouselNav");
  const pauseBtn = qs("#pauseCarousel");
  const playBtn = qs("#playCarousel");

  if (heroCarouselEl && pauseBtn && playBtn && window.bootstrap) {
    const heroCarousel = new bootstrap.Carousel(heroCarouselEl, { interval: 4000 });

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
     4) LIGHTBOX (Visual work)
  ===================================================== */

  const lightbox = qs("#lightbox");
  const lightboxImg = qs("#lightbox-img");

  const openLightbox = (src) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add("active");
    setScrollLock(true);
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    setScrollLock(false);
  };

  if (lightbox) {
    qsa(".case-image img, .thumb-img").forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(img.src));
    });

    lightbox.addEventListener("click", closeLightbox);
  }

  /* =====================================================
     5) PROJECT MODAL 
  ===================================================== */

  const projectModal = qs("#project-modal");
  const modalClose = projectModal?.querySelector(".modal-close");

  const modalTitle = qs("#modal-title");
  const modalMeta = qs("#modal-meta");
  const modalDescription = qs("#modal-description");
  const slideCaptionEl = qs("#slide-caption");

  const carouselEl = qs("#projectCarousel");
  const carouselInner = qs("#project-carousel-inner");
  const indicators = qs("#project-carousel-indicators");

  // If the modal isn't on this page, still support ESC for lightbox
  const modalIsPresent =
    projectModal && modalClose && modalTitle && modalMeta && modalDescription && carouselEl && carouselInner && indicators;

  // Prevent Bootstrap instances stacking
  let projectCarouselInstance = null;
  const MIN_SLIDES_PER_PROJECT = 5;
  let lastFocusedEl = null;

  // PROJECT DATA 
  const projects = {
    inkspression: {
      title: "Inkspression",
      meta: "Role: UX/UI, IA, interaction design · Tools: React · TailwindCSS · Firebase",
      overview:
        "A neurodivergent-friendly journaling + productivity experience designed to reduce overwhelm through gentle structure, emotional check-ins, and low-cognitive-load layouts.",
      slides: [
        { src: "images/inkspression/dashboard.jpg", heading: "Dashboard", caption: "A calm home base: mood, prompts, and recent entries." },
        { src: "images/inkspression/theme.jpg", heading: "Themes", caption: "Sensory-friendly themes for different emotional states." },
        { src: "images/inkspression/entry.jpg", heading: "Journal Entry", caption: "A focused writing space with minimal distractions." },
      ],
      caseStudy: {
        problem:
          "Many journaling/productivity tools increase anxiety with dense dashboards, rigid prompts, and gamified pressure. Users who experience overwhelm need an experience that supports regulation, not performance.",
        goals: [
          "Reduce cognitive load during reflection",
          "Support emotional safety + self-paced use",
          "Make customization feel calming (not complicated)",
          "Keep accessibility strong across themes",
        ],
        decisions: [
          "Low-density layouts + generous spacing to reduce overwhelm",
          "Theme flexibility to match mood and sensory needs",
          "No streaks/punishment language — gentle, forgiving UX",
          "Clear hierarchy: one primary action per screen",
        ],
        reflection:
          "Next iterations would include lightweight usability testing with neurodivergent users and a clearer onboarding that teaches the system in under 60 seconds.",
      },
    },

    anniime: {
      title: "AnniiMe Finder",
      meta: "Role: UX flow + front-end implementation · Tools: React · JavaScript · Jikan API",
      overview:
        "A guided anime discovery platform that reduces decision fatigue for beginners through a short quiz, curated results, and consistent layout patterns.",
      slides: [
        { src: "images/anniime/home-light.jpg", heading: "Landing", caption: "A soft entry point designed for first-time users." },
        { src: "images/anniime/quiz-dark.jpg", heading: "Quiz", caption: "Guided onboarding turns preferences into recommendations." },
        { src: "images/anniime/search-dark.jpg", heading: "Results", caption: "Grouped recommendations for easier scanning." },
      ],
      caseStudy: {
        problem:
          "New anime viewers often feel overwhelmed by huge catalogs and unclear genre systems. “What should I watch?” becomes a high-friction decision.",
        goals: ["Reduce decision fatigue", "Create a guided, friendly onboarding", "Make results scannable + approachable"],
        decisions: ["Quiz-based onboarding instead of open search", "Clear grouping + consistent UI", "Light/dark mode for comfort"],
        reflection:
          "A next step is improving recommendation explainability (“why you got this”) to increase trust and conversion to click-through.",
      },
    },

    inkspresso: {
      title: "Inkspresso — Fuel Your Imagination",
      meta: "Role: UX, IA, UI, full-stack build · Tools: Node.js · Express · MongoDB",
      overview:
        "A cozy café-inspired eCommerce + digital library concept designed for calm browsing, longer sessions, and exploration-first navigation.",
      slides: [
        { src: "images/inkspresso/dashboard.png", heading: "Dashboard", caption: "A central hub connecting café + library experiences." },
        { src: "images/inkspresso/menu.jpg", heading: "Café Menu", caption: "Warm browsing that doesn’t feel pushy or loud." },
        { src: "images/inkspresso/library.png", heading: "Library", caption: "Exploration-first book discovery." },
      ],
      caseStudy: {
        problem:
          "Many eCommerce experiences are aggressive and dense, turning browsing into pressure. Users who want a cozy experience need calmer hierarchy and clearer exploration paths.",
        goals: ["Create an inviting browsing experience", "Separate exploration from purchase pressure", "Support long-form discovery"],
        decisions: ["Café vs library modes", "Dark-mode-friendly UI", "Exploration-first hierarchy"],
        reflection:
          "Next steps: test navigation labels, improve filtering, and refine checkout microcopy to reduce friction without increasing pressure.",
      },
    },
  };

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

  const buildSlide = (slide, isActive) => `
    <div class="carousel-item ${isActive ? "active" : ""}">
      <img
        src="${slide.src}"
        class="d-block w-100 modal-slide-img"
        alt="${slide.heading || "Project screenshot"}"
        loading="lazy"
      />
      <div class="carousel-caption">
        <h5>${slide.heading || ""}</h5>
        <p>${slide.caption || ""}</p>
      </div>
    </div>
  `;

  const buildPlaceholderSlide = (projectKey, slideIndex, isActive) => `
    <div class="carousel-item ${isActive ? "active" : ""}">
      <div class="modal-placeholder">
        <div class="modal-placeholder-inner">
          <div class="modal-placeholder-title">Image placeholder</div>
          <div class="modal-placeholder-sub">Add a future screenshot/mockup when ready.</div>
          <code class="modal-placeholder-code">images/${projectKey}/your-image-${slideIndex + 1}.jpg</code>
        </div>
      </div>
      <div class="carousel-caption">
        <h5>Coming Soon</h5>
        <p>Add a slide image + caption in your project data.</p>
      </div>
    </div>
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
      new bootstrap.Carousel(carouselEl, { interval: false, ride: false, keyboard: false });

    return projectCarouselInstance;
  };

  const updateSlideCaption = () => {
    if (!slideCaptionEl) return;
    const active = carouselInner.querySelector(".carousel-item.active");
    if (!active) return;
    slideCaptionEl.textContent = active.querySelector(".carousel-caption p")?.textContent || "";
  };

  const openProjectModal = (key) => {
    if (!modalIsPresent) {
      console.warn("Project modal markup not found on this page.");
      return;
    }

    const project = projects[key];
    if (!project) {
      console.error(`No project found for key: "${key}". Check data-project on the button.`);
      return;
    }

    // Build content
    modalTitle.textContent = project.title || "";
    modalMeta.textContent = project.meta || "";
    modalDescription.innerHTML = renderCaseStudyHTML(project);

    // Reset carousel
    carouselInner.innerHTML = "";
    indicators.innerHTML = "";

    const slides = Array.isArray(project.slides) ? project.slides : [];
    const total = Math.max(slides.length, MIN_SLIDES_PER_PROJECT);

    for (let i = 0; i < total; i++) {
      const isActive = i === 0;

      carouselInner.insertAdjacentHTML(
        "beforeend",
        slides[i] ? buildSlide(slides[i], isActive) : buildPlaceholderSlide(key, i, isActive)
      );

      indicators.insertAdjacentHTML("beforeend", buildIndicator(i, isActive));
    }

    // Show modal
    lastFocusedEl = document.activeElement;
    projectModal.classList.add("active");
    projectModal.setAttribute("aria-hidden", "false");
    setScrollLock(true);
    projectModal.focus();

    // Reset carousel to first slide
    const carousel = getCarouselInstance();
    carousel?.to(0);

    // Update caption + keep synced
    updateSlideCaption();
    carouselEl.addEventListener("slid.bs.carousel", updateSlideCaption);
  };

  const closeProjectModal = () => {
    if (!modalIsPresent) return;

    projectModal.classList.remove("active");
    projectModal.setAttribute("aria-hidden", "true");
    setScrollLock(false);

    carouselEl.removeEventListener("slid.bs.carousel", updateSlideCaption);

    if (projectCarouselInstance) {
      try {
        projectCarouselInstance.to(0);
      } catch (_) {}
    }

    if (lastFocusedEl) lastFocusedEl.focus();
    lastFocusedEl = null;
  };

  // Bind buttons 
  qsa(".btn-web[data-project]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.dataset.project;
      openProjectModal(key);
    });
  });

  // Close handlers
  modalClose?.addEventListener("click", closeProjectModal);
  modalClose?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeProjectModal();
    }
  });

  projectModal?.addEventListener("click", (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // Keyboard nav
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (projectModal?.classList.contains("active")) closeProjectModal();
      else if (lightbox?.classList.contains("active")) closeLightbox();
    }

    if (projectModal?.classList.contains("active")) {
      const carousel = getCarouselInstance();
      if (e.key === "ArrowLeft") carousel?.prev();
      if (e.key === "ArrowRight") carousel?.next();
    }
  });
});
