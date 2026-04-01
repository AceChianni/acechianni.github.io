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

  meta:
    "Role: UX/UI Design, Information Architecture, Interaction Design, Front-End Development · Tools: React · Tailwind CSS · Firebase",

  overview:
    "A neurodivergent-friendly journaling and productivity platform designed to reduce cognitive overload through gentle structure, emotional check-ins, and low-pressure interaction patterns. Inkspression reimagines traditional journaling tools by removing performance-based mechanics and prioritizing emotional safety, ease of use, and return-friendly design.",

  slides: [
    {
      src: "images/inkspression/landing.jpg",
      heading: "Landing",
      caption:
        "A soft-entry landing experience that allows users to explore the app before committing, reducing friction and decision pressure.",
    },
    {
      src: "images/inkspression/dash.jpg",
      heading: "Dashboard",
      caption:
        "A calm home base prioritizing emotional state, recent entries, and one clear next action to reduce decision fatigue.",
    },
    {
      src: "images/inkspression/signin.jpg",
      heading: "Account",
      caption:
        "A minimal, accessible authentication flow designed to feel optional and low-pressure rather than required.",
    },
    {
      src: "images/inkspression/entry.jpg",
      heading: "Journal Entry",
      caption:
        "A distraction-free writing space focused on emotional safety, minimal UI, and gentle prompts to support reflection.",
    },
  ],

  caseStudy: {
    problem:
      "Many journaling and productivity tools rely on streaks, gamification, and dense dashboards that unintentionally increase anxiety. For users prone to overwhelm, these systems create pressure instead of support—making it harder to begin and harder to return.",

    insight:
      "Research through community discussions and informal user interviews revealed a consistent pattern: neurodivergent users often abandon journaling tools due to visual clutter, performance pressure, and rigid structures that fail to adapt to fluctuating energy and emotional states.",

    goals: [
      "Reduce cognitive load during reflection",
      "Support emotional regulation over performance tracking",
      "Enable personalization without increasing complexity",
      "Maintain strong accessibility across light and dark themes",
    ],

    decisions: [
      "Low-density layouts and generous spacing to reduce sensory load and visual overwhelm",
      "Emotion-led entry points (mood selection) to gently guide reflection without forcing structure",
      "Removal of streaks, metrics, and punitive language to reduce shame-based disengagement",
      "One primary action per screen to improve clarity and reduce decision fatigue",
      "Theme personalization designed for emotional regulation rather than aesthetic overload",
    ],

    impact:
      "The experience reduces friction at the moment of starting, supports emotional expression without pressure, and encourages repeat use by making the product feel safe, forgiving, and adaptable to real-life energy levels.",

    reflection:
      "Future iterations will include usability testing with neurodivergent users, reducing onboarding time to under 60 seconds, and exploring adaptive UI patterns that respond to emotional check-ins by adjusting layout density, prompts, and visual intensity.",
  },
},

  anniime: {
    title: "Anniime Finder",
    meta: "Role: UX/Product Designer + Front-End Developer · Tools: React · JavaScript · Jikan API",

    overview:
      "A guided anime discovery tool that helps new viewers find shows quickly without decision fatigue.",

    slides: [
      { src: "images/anniime/home-light.jpg", heading: "Landing", caption: "A welcoming entry point designed for first-time anime viewers." },
      { src: "images/anniime/quiz-dark.jpg", heading: "Quiz", caption: "Preference-based onboarding converts taste into recommendations." },
      { src: "images/anniime/search-dark.jpg", heading: "Results", caption: "Grouped results for fast scanning and low-pressure selection." },
    ],

    caseStudy: {
      problem:
        "New anime viewers face analysis paralysis due to massive catalogs, niche genre labels, and community recommendations that assume prior knowledge.",

      insight:
        "Beginner viewers often spend more time searching than watching, leading to drop-off before starting a series.",

      goals: [
        "Reduce time-to-first-watch decision",
        "Create a friendly onboarding experience",
        "Present results in a digestible format",
      ],

      decisions: [
        "Quiz-based onboarding instead of open search",
        "Clear grouping and minimal UI noise",
        "Light/dark modes for comfort and accessibility",
      ],

      impact:
        "Designed to reduce decision time from 20+ minutes of browsing to a few guided steps.",

      reflection:
        "Next steps include explainable recommendations ('Why this match?') and personalization memory for returning users.",
    },
  },

  inkspresso: {
    title: "Inkspresso — Fuel Your Imagination",
    meta: "Role: UX, IA, UI, Full-Stack Build · Tools: Node.js · Express · MongoDB",

    overview:
      "A cozy café-inspired eCommerce and digital library experience focused on calm browsing and exploration-first navigation.",

    slides: [
      { src: "images/inkspresso/dashboard.png", heading: "Dashboard", caption: "A hub connecting café and library experiences." },
      { src: "images/inkspresso/menu.jpg", heading: "Café Menu", caption: "Warm, low-pressure browsing without urgency tactics." },
      { src: "images/inkspresso/library.png", heading: "Library", caption: "Exploration-driven discovery for books and resources." },
    ],

    caseStudy: {
      problem:
        "Many eCommerce platforms rely on urgency, popups, and dense layouts that make browsing feel stressful rather than enjoyable.",

      insight:
        "Users seeking cozy or hobby-based shopping experiences value atmosphere and discovery over speed and pressure.",

      goals: [
        "Encourage exploration without pressure",
        "Create a welcoming, calm atmosphere",
        "Support long-session browsing",
      ],

      decisions: [
        "Separated café and library modes for mental clarity",
        "Dark-mode-friendly, cozy visual design",
        "Exploration-first hierarchy instead of pushy CTAs",
      ],

      impact:
        "Designed to increase session time and discovery by making browsing feel leisurely rather than transactional.",

      reflection:
        "Future improvements include navigation testing, refined filtering, and checkout microcopy that reduces friction without adding urgency.",
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
