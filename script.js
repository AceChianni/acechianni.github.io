document.addEventListener("DOMContentLoaded", () => {
  "use strict";

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

  const projectModal = qs("#project-modal");
  const modalClose = projectModal?.querySelector(".modal-close");

  const modalTitle = qs("#modal-title");
  const modalMeta = qs("#modal-meta");
  const modalDescription = qs("#modal-description");
  const slideCaptionEl = qs("#slide-caption");
  const slideCounterEl = qs("#modal-slide-counter");

  const carouselEl = qs("#projectCarousel");
  const carouselInner = qs("#project-carousel-inner");
  const indicators = qs("#project-carousel-indicators");

  const modalIsPresent =
    projectModal &&
    modalClose &&
    modalTitle &&
    modalMeta &&
    modalDescription &&
    carouselEl &&
    carouselInner &&
    indicators;

  let projectCarouselInstance = null;
  let lastFocusedEl = null;
  let totalSlidesForCurrentProject = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const MIN_SLIDES_PER_PROJECT = 5;

  const projects = {
    inkspression: {
      title: "Inkspression",
      meta:
        "Role: UX/UI Design, Information Architecture, Interaction Design, Front-End Development · Tools: React · Tailwind CSS · Firebase",
      overview:
        "Inkspression is a neurodivergent-friendly journaling and productivity platform designed to reduce cognitive overload and make reflection easier to begin and return to. Unlike traditional tools, it removes streaks, gamification, and high-density dashboards in favor of gentle structure, emotional check-ins, and low-pressure interaction patterns.",
      slides: [
        {
          src: "images/inkspression/landing.jpg",
          heading: "Landing",
          caption:
            "A low-friction entry point that allows users to explore the product before committing, reducing signup pressure.",
        },
        {
          src: "images/inkspression/dash.jpg",
          heading: "Dashboard",
          caption:
            "A simplified home screen focused on emotional state, recent entries, and one clear next step.",
        },
        {
          src: "images/inkspression/signin.jpg",
          heading: "Account",
          caption:
            "A minimal authentication flow designed to feel optional and non-disruptive.",
        },
        {
          src: "images/inkspression/entry.jpg",
          heading: "Journal Entry",
          caption:
            "A distraction-free writing environment with mood-led prompts and reduced visual noise.",
        },
      ],
      caseStudy: {
        why:
          "Many people want to journal or reflect but struggle to start or stay consistent due to overwhelm, pressure, or rigid productivity systems. Inkspression explores how a journaling tool can feel safe, flexible, and aligned with real human energy rather than idealized habits.",
        problem:
          "Most journaling and productivity tools rely on streaks, gamification, and dense interfaces. For users prone to overwhelm or inconsistent energy, these systems increase pressure and lead to abandonment rather than engagement.",
        insight:
          "Through community discussions and informal user interviews, I found that many neurodivergent users avoid or quit journaling apps due to visual clutter, rigid workflows, and performance-based mechanics that don’t reflect how their energy and focus fluctuate.",
        goals: [
          "Make it easier to start and return to journaling",
          "Reduce cognitive load and visual overwhelm",
          "Support emotional regulation instead of performance tracking",
          "Provide personalization without adding complexity",
          "Maintain strong accessibility across themes",
        ],
        principles: [
          "Reduce friction at the moment of starting",
          "One clear action per screen",
          "No pressure, no streaks, no shame loops",
          "Support fluctuating energy levels",
          "Keep interactions calm, simple, and forgiving",
        ],
        decisions: [
          "Designed low-density layouts with clear spacing to reduce sensory overload",
          "Introduced mood-first interaction to guide users into reflection without requiring structure",
          "Removed streaks and metrics to eliminate shame-based disengagement",
          "Limited each screen to one primary action to reduce decision fatigue",
          "Built a simple theming system that supports personalization without overwhelming users",
        ],
        impact:
          "The result is a journaling experience that reduces friction at the moment of starting and supports repeat use by aligning with real-world energy levels rather than idealized consistency. Users can engage without pressure, making the tool feel safe to return to even after periods of inactivity.",
        reflection:
          "Next steps include usability testing with neurodivergent users, refining onboarding to reduce time-to-first-entry, and exploring adaptive UI patterns that respond to emotional input by adjusting layout density, prompts, and visual intensity.",
      },
    },

    kidsHub: {
      title: "Kids Hub: Neurodivergent Routine & Regulation Support",
      meta:
        "Role: UX/UI Design, Information Architecture, Interaction Design, Concept Product · Tools: Figma, React, Tailwind CSS",
      overview:
        "Kids Hub is a neurodivergent-friendly routine and emotional regulation tool designed for children and caregivers. The product focuses on reducing friction around transitions, daily structure, and emotional check-ins through calm visuals, predictable flows, and low-pressure support patterns. It is designed to support real-life moments of overwhelm rather than idealized behavior.",
      slides: [
        {
          src: "images/kidshub/home.jpg",
          heading: "Home",
          caption:
            "A simplified home screen that guides users toward one clear next step, reducing decision fatigue and visual overwhelm.",
        },
        {
          src: "images/kidshub/home-calm.jpg",
          heading: "Low Stimulation Mode",
          caption:
            "An alternate interface that reduces visual intensity, supporting children who are sensitive to motion, contrast, or dense layouts.",
        },
        {
          src: "images/kidshub/morning.jpg",
          heading: "Morning Routine",
          caption:
            "A structured routine experience that breaks tasks into manageable steps, helping children transition with clarity and reduced resistance.",
        },
        {
          src: "images/kidshub/calmcorner.jpg",
          heading: "Calm Corner",
          caption:
            "A guided regulation flow that helps children identify how they feel, choose a reset strategy, and re-engage without shame.",
        },
        {
          src: "images/kidshub/reward.jpg",
          heading: "Rewards",
          caption:
            "A gentle reinforcement system that celebrates effort without introducing pressure, streaks, or performance-based tracking.",
        },
      ],
      caseStudy: {
        why:
          "Transitions, emotional regulation, and daily routines can be some of the most difficult moments for neurodivergent children and their caregivers. Many existing tools unintentionally increase overwhelm instead of reducing it. Kids Hub explores how digital products can support these moments with calm, flexible, and emotionally aware design.",
        problem:
          "Many tools designed for children rely on rigid routines, overstimulating interfaces, or pressure-based reward systems. For neurodivergent children, these patterns can increase resistance, emotional escalation, and difficulty completing even simple transitions.",
        insight:
          "Emotional state directly impacts a child’s ability to complete tasks. Tools that ignore this often fail. Caregivers also need support that guides without escalating situations or introducing additional stress.",
        goals: [
          "Reduce friction around daily routines and transitions",
          "Support emotional regulation in real time",
          "Design low-stimulation, predictable interaction patterns",
          "Remove pressure-based motivation systems",
          "Create a shared experience for both children and caregivers",
        ],
        principles: [
          "One clear action per screen to reduce decision fatigue",
          "Low-density layouts to minimize sensory overload",
          "No shame-based mechanics (no streaks, no penalties)",
          "Meet emotional state before task completion",
          "Allow flexibility and recovery (reset, deselect, no forced flow)",
        ],
        decisions: [
          "Introduced mood-first interaction to meet the child where they are before suggesting actions",
          "Structured flows as guided steps rather than open navigation",
          "Designed low-density layouts to reduce sensory overload",
          "Allowed flexible interaction (deselect, reset, no forced completion)",
          "Reframed rewards as encouragement rather than performance tracking",
          "Created a parent view with scripts to support co-regulation",
        ],
        highlight:
          "The Calm Corner feature introduces a mood-first interaction model, guiding children to identify how they feel before suggesting a reset. This reduces resistance and supports co-regulation between child and caregiver.",
        scenario:
          "For example, during a morning transition, a child who feels overwhelmed can select their mood, choose a reset, and return to their routine with less escalation. Caregivers are supported with scripts that help maintain a calm interaction.",
        impact:
          "By prioritizing emotional state, reducing cognitive load, and removing pressure-based systems, Kids Hub creates a calmer interaction loop. This supports smoother transitions, reduces resistance, and helps children re-engage more independently.",
        reflection:
          "Future iterations will introduce linked parent-child accounts, secure tracking of moods and routines, and exportable summaries to support communication with therapists, doctors, and care teams. The long-term goal is to evolve Kids Hub into a collaborative support system rather than a standalone tool.",
      },
    },

    inkspresso: {
      title: "Inkspresso — Fuel Your Imagination",
      meta:
        "Role: UX, IA, UI, Full-Stack Build · Tools: Node.js · Express · MongoDB",
      overview:
        "A cozy café-inspired eCommerce and digital library experience focused on calm browsing and exploration-first navigation.",
      slides: [
        {
          src: "images/inkspresso/dashboard.png",
          heading: "Dashboard",
          caption: "A hub connecting café and library experiences.",
        },
        {
          src: "images/inkspresso/menu.jpg",
          heading: "Café Menu",
          caption: "Warm, low-pressure browsing without urgency tactics.",
        },
        {
          src: "images/inkspresso/library.png",
          heading: "Library",
          caption: "Exploration-driven discovery for books and resources.",
        },
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
          "Designed a cozy visual system that supports atmosphere without sacrificing usability",
          "Used exploration-first hierarchy instead of urgency-based CTAs",
        ],
        impact:
          "The concept supports longer, more exploratory browsing by making the experience feel leisurely rather than transactional.",
        reflection:
          "Future improvements include navigation testing, refined filtering, and checkout microcopy that reduces friction without adding urgency.",
      },
    },

    anniime: {
      title: "Anniime Finder",
      meta:
        "Role: UX/Product Designer + Front-End Developer · Tools: React · JavaScript · Jikan API",
      overview:
        "A guided anime discovery tool that helps new viewers find shows quickly without decision fatigue.",
      slides: [
        {
          src: "images/anniime/home-light.jpg",
          heading: "Landing",
          caption: "A welcoming entry point designed for first-time anime viewers.",
        },
        {
          src: "images/anniime/quiz-dark.jpg",
          heading: "Quiz",
          caption: "Preference-based onboarding converts taste into recommendations.",
        },
        {
          src: "images/anniime/search-dark.jpg",
          heading: "Results",
          caption: "Grouped results for fast scanning and low-pressure selection.",
        },
      ],
      caseStudy: {
        problem:
          "New anime viewers face analysis paralysis due to massive catalogs, niche genre labels, and recommendation systems that assume prior knowledge.",
        insight:
          "Beginner viewers often spend more time searching than watching, leading to drop-off before starting a series.",
        goals: [
          "Reduce time-to-first-watch decision",
          "Create a friendly onboarding experience",
          "Present results in a digestible format",
        ],
        decisions: [
          "Used quiz-based onboarding instead of open-ended search",
          "Designed grouped results for faster scanning",
          "Included light and dark modes for comfort and accessibility",
        ],
        impact:
          "The experience is designed to reduce decision time from extended browsing into a few guided steps.",
        reflection:
          "Next steps include explainable recommendations and lightweight personalization for returning users.",
      },
    },
  };

  const renderCaseStudyHTML = (project) => {
    const cs = project.caseStudy || {};
    const goals = Array.isArray(cs.goals) ? cs.goals : [];
    const principles = Array.isArray(cs.principles) ? cs.principles : [];
    const decisions = Array.isArray(cs.decisions) ? cs.decisions : [];

    return `
      <h4>Overview</h4>
      <p>${project.overview || ""}</p>

      ${cs.why ? `<h4>Why this matters</h4><p>${cs.why}</p>` : ""}
      ${cs.problem ? `<h4>Problem</h4><p>${cs.problem}</p>` : ""}
      ${cs.insight ? `<h4>Insight</h4><p>${cs.insight}</p>` : ""}
      ${goals.length ? `<h4>UX Goals</h4><ul>${goals.map((g) => `<li>${g}</li>`).join("")}</ul>` : ""}
      ${principles.length ? `<h4>Design Principles</h4><ul>${principles.map((p) => `<li>${p}</li>`).join("")}</ul>` : ""}
      ${decisions.length ? `<h4>Key UX Decisions</h4><ul>${decisions.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}
      ${cs.highlight ? `<h4>Feature Highlight</h4><p>${cs.highlight}</p>` : ""}
      ${cs.scenario ? `<h4>Use Scenario</h4><p>${cs.scenario}</p>` : ""}
      ${cs.impact ? `<h4>Impact</h4><p>${cs.impact}</p>` : ""}
      ${cs.reflection ? `<h4>Reflection</h4><p>${cs.reflection}</p>` : ""}
    `;
  };

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
          <div class="modal-placeholder-sub">Add a future screenshot or mockup when ready.</div>
          <code class="modal-placeholder-code">images/${projectKey}/your-image-${slideIndex + 1}.jpg</code>
        </div>
      </div>
      <div class="carousel-caption">
        <h5>Coming Soon</h5>
        <p>Add a slide image and caption in your project data.</p>
      </div>
    </div>
  `;

  const getCarouselInstance = () => {
    if (!window.bootstrap || !carouselEl) return null;

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
        keyboard: false,
        touch: false,
      });

    return projectCarouselInstance;
  };

  const updateSlideCaption = () => {
    if (!slideCaptionEl || !carouselInner) return;
    const active = carouselInner.querySelector(".carousel-item.active");
    if (!active) return;
    slideCaptionEl.textContent = active.querySelector(".carousel-caption p")?.textContent || "";
  };

  const updateSlideCounter = () => {
    if (!slideCounterEl || !carouselInner) return;
    const slides = qsa(".carousel-item", carouselInner);
    const activeIndex = slides.findIndex((slide) => slide.classList.contains("active"));
    const current = activeIndex >= 0 ? activeIndex + 1 : 1;
    slideCounterEl.textContent = `${current} / ${totalSlidesForCurrentProject}`;
  };

  const syncModalSlideMeta = () => {
    updateSlideCaption();
    updateSlideCounter();
  };

  const openProjectModal = (key) => {
    if (!modalIsPresent) {
      console.warn("Project modal markup not found on this page.");
      return;
    }

    const project = projects[key];
    if (!project) {
      console.error(`No project found for key: "${key}".`);
      return;
    }

    try {
      modalTitle.textContent = project.title || "";
      modalMeta.textContent = project.meta || "";
      modalDescription.innerHTML = renderCaseStudyHTML(project);

      carouselInner.innerHTML = "";
      indicators.innerHTML = "";

      const slides = Array.isArray(project.slides) ? project.slides : [];
      const total = Math.max(slides.length, MIN_SLIDES_PER_PROJECT);
      totalSlidesForCurrentProject = total;

      for (let i = 0; i < total; i++) {
        const isActive = i === 0;

        carouselInner.insertAdjacentHTML(
          "beforeend",
          slides[i] ? buildSlide(slides[i], isActive) : buildPlaceholderSlide(key, i, isActive)
        );

        indicators.insertAdjacentHTML("beforeend", buildIndicator(i, isActive));
      }

      lastFocusedEl = document.activeElement;
      projectModal.classList.add("active");
      projectModal.setAttribute("aria-hidden", "false");
      setScrollLock(true);
      projectModal.focus();

      const carousel = getCarouselInstance();
      carousel?.to(0);

      syncModalSlideMeta();
      carouselEl.addEventListener("slid.bs.carousel", syncModalSlideMeta);
    } catch (err) {
      console.error("Failed to open project modal:", err);
    }
  };

  const closeProjectModal = () => {
    if (!modalIsPresent) return;

    projectModal.classList.remove("active");
    projectModal.setAttribute("aria-hidden", "true");
    setScrollLock(false);

    carouselEl.removeEventListener("slid.bs.carousel", syncModalSlideMeta);

    if (projectCarouselInstance) {
      try {
        projectCarouselInstance.to(0);
      } catch (_) {}
    }

    if (lastFocusedEl) lastFocusedEl.focus();
    lastFocusedEl = null;
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".btn-web[data-project]");
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const key = trigger.dataset.project?.trim();
    if (!key) return;

    openProjectModal(key);
  });

  modalClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeProjectModal();
  });

  projectModal?.addEventListener("click", (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  document.addEventListener("keydown", (e) => {
    if (projectModal?.classList.contains("active")) {
      const carousel = getCarouselInstance();

      if (e.key === "Escape") {
        e.preventDefault();
        closeProjectModal();
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        carousel?.prev();
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        carousel?.next();
      }
    } else if (lightbox?.classList.contains("active") && e.key === "Escape") {
      closeLightbox();
    }
  });

  carouselEl?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carouselEl?.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const carousel = getCarouselInstance();

    if (Math.abs(diff) > 50) {
      if (diff > 0) carousel?.next();
      else carousel?.prev();
    }
  }, { passive: true });
});