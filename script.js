document.addEventListener("DOMContentLoaded", () => {
  // script.js
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
// flowstate: {
//   title: "Flowstate: Calm Planning Workspace for Creatives",
//   meta:
//     "Role: UX/UI Design, Interaction Design, Front-End Development · Tools: Figma · React · Tailwind CSS · Firebase",

//   overview:
//     "Flowstate is a calm planning workspace designed for creatives, freelancers, and small teams. It reduces overwhelm by consolidating projects, schedules, and assets into a low-stimulation, easy-to-navigate interface. The product focuses on improving clarity, reducing context switching, and supporting predictable workflows.",

//   slides: [
//     {
//       src: "images/flowstate/landing.jpg",
//       heading: "Landing",
//       caption:
//         "Clear hero section with concise value proposition and gentle visuals that communicate calm workspace benefits without overwhelming the user.",
//     },
//     {
//       src: "images/flowstate/dashboard.jpg",
//       heading: "Dashboard",
//       caption:
//         "Simplified dashboard prioritizes ongoing projects, upcoming deadlines, and one clear next action to reduce cognitive load and improve task initiation.",
//     },
//     {
//       src: "images/flowstate/project-view.jpg",
//       heading: "Project View",
//       caption:
//         "Organized project workspace shows relevant tasks, notes, and assets in a low-density layout, supporting focused work and minimizing context switching.",
//     },
//     {
//       src: "images/flowstate/calendar.jpg",
//       heading: "Calendar",
//       caption:
//         "Visual calendar provides a calm overview of tasks and deadlines, allowing users to plan with clarity and avoid overstimulation.",
//     },
//     {
//       src: "images/flowstate/task-detail.jpg",
//       heading: "Task Detail",
//       caption:
//         "Focused task screens present only essential information and a single primary action, improving completion rates and reducing decision fatigue.",
//     },
//   ],

//   caseStudy: {
//     product:
//       "Product Type: Planning & productivity workspace · Platform: Web (React) · Focus: Reducing overwhelm and supporting low-stimulation project management for creatives",

//     why:
//       "Many creatives and small teams struggle with fragmented workflows, scattered task management, and visually dense project tools. Flowstate was designed to reduce cognitive load, simplify navigation, and support predictable, calm workflows.",

//     problem:
//       "Traditional project management and planning tools present too much information at once, leading to overwhelm, context switching, and incomplete tasks. Users need a workspace that guides attention and reduces unnecessary choices.",

//     insight:
//       "Users perform best when the workspace emphasizes clarity, prioritizes a single next action, and reduces competing visual elements. A calm, low-density interface supports focus, productivity, and sustained engagement.",

//     goals: [
//       "Reduce cognitive overload across project and task management flows",
//       "Support clear task initiation and completion",
//       "Provide a calm, predictable, and low-stimulation interface",
//       "Enable flexible planning while maintaining focus",
//     ],

//     principles: [
//       "One primary action per screen",
//       "Low-density, readable layouts",
//       "Predictable navigation and workflow patterns",
//       "Flexible engagement with tasks and projects",
//       "Support clarity without visual or cognitive clutter",
//     ],

//     decisions: [
//       "Designed a dashboard highlighting key projects and next actions to reduce decision fatigue",
//       "Organized project views and assets to minimize context switching and improve task completion",
//       "Implemented a low-density visual hierarchy to maintain calm and focus",
//       "Developed focused task screens with a single primary action for each step",
//       "Added a visual calendar and progress overview to support predictable workflows",
//     ],

//     highlight:
//       "Flowstate’s design consolidates scattered projects and tasks into a low-stimulation workspace that promotes focus, clarity, and calm productivity without adding pressure.",

//     scenario:
//       "A solo creative or small team member can open Flowstate, see their key projects and next action, and start working immediately without feeling overwhelmed by excessive options or clutter.",

//     impact:
//       "By reducing visual and cognitive overload, Flowstate improves task initiation, supports consistent progress, and enables users to engage with projects in a calm, focused way. The predictable layout and single-action screens reduce context switching and decision fatigue.",

//     reflection:
//       "Future iterations will include deeper customization options, adaptive task prioritization, and enhanced collaboration features to further support flexible workflows and low-stimulation productivity for small teams and creative users.",
//   },
// },


    
    inkspression: {
  title: "Inkspression",
  meta:
    "Role: End-to-end Product Design (Research, UX, UI, Front-End Development) · Tools: React · Tailwind CSS · Firebase",

  overview:
    "Inkspression is a journaling and productivity web app designed to reduce cognitive overload by simplifying how users start, navigate, and return to reflection. The product focuses on reducing friction in multi-step user flows through mood-based entry, low-density layouts, and flexible interaction patterns. This approach improves engagement by lowering the barrier to task initiation and supporting repeat use without pressure.",

  slides: [
    {
      src: "images/inkspression/landing.jpg",
      heading: "Landing",
      caption:
        "Low-friction entry flow lets users begin journaling immediately—no account creation required—reducing onboarding friction and improving task initiation.",
    },
    {
      src: "images/inkspression/dash.jpg",
      heading: "Dashboard",
      caption:
        "Simplified dashboard prioritizes emotional state, recent activity, and one clear next action to reduce decision fatigue and support sustained engagement.",
    },
    {
      src: "images/inkspression/signin.jpg",
      heading: "Account",
      caption:
        "Minimal authentication flow feels optional, allowing users to engage before committing to an account and lowering initial friction.",
    },
    {
      src: "images/inkspression/entry.jpg",
      heading: "Journal Entry",
      caption:
        "Distraction-free writing environment with mood-led prompts and reduced visual noise to support focus, ease of expression, and flexible session lengths.",
    },
  ],

  caseStudy: {
    product:
      "Product Type: Journaling & productivity web app · Platform: React (web) · Focus: Reducing friction in user flows and supporting consistent engagement",

    why:
      "Many users want to journal or reflect but struggle to start or stay consistent due to overwhelm, pressure, or rigid productivity systems. By reducing friction at the moment of entry, this project improves task initiation and encourages repeat use without relying on performance-based mechanics.",

    problem:
      "Traditional journaling and productivity tools rely on dense dashboards, streaks, and performance metrics. For users with fluctuating energy or attention, these patterns increase cognitive load, create pressure, and lead to drop-off rather than sustained engagement.",

    insight:
      "Users engage more when barriers to entry are low and the experience adapts to their current mental or emotional state. Reducing early decision points supports task initiation and encourages repeat engagement.",

    goals: [
      "Improve task initiation by reducing friction at entry",
      "Reduce cognitive load across core flows",
      "Support flexible engagement aligned with user energy",
      "Create a calm, accessible, and forgiving interaction system",
    ],

    principles: [
      "One primary action per screen",
      "Reduce friction at the moment of starting",
      "No pressure-based mechanics (no streaks, no shame loops)",
      "Design for fluctuating attention and energy",
      "Keep interactions simple, forgiving, and low-stimulation",
    ],

    decisions: [
      "Mood-first entry flow to reduce early decision fatigue and encourage immediate journaling",
      "Removed streaks and performance metrics to eliminate pressure and disengagement",
      "Structured screens around a single primary action to reduce cognitive load",
      "Low-density UI patterns to improve readability, focus, and emotional calm",
      "Flexible journaling paths allowing users to engage for short or long sessions based on energy levels",
    ],

    impact:
      "By simplifying early decisions and aligning with user energy levels, Inkspression reduces onboarding friction, improves task initiation, and supports consistent engagement without relying on habit enforcement or pressure-based mechanics.",

    reflection:
      "Next steps include usability testing to validate entry flow effectiveness, optimizing time-to-first-entry, and exploring adaptive UI patterns that respond dynamically to user input and emotional state.",
  },
},

   kidsHub: {
  title: "Kids Hub: Neurodivergent Routine & Regulation Support",
  meta:
    "Role: UX/UI Design, Information Architecture, Interaction Design · Tools: Figma · React · Tailwind CSS",

  overview:
    "Kids Hub is a routine and emotional regulation tool designed to support neurodivergent children and caregivers during high-stress moments. The product focuses on reducing friction in transitions through guided flows, mood-based interaction, and low-stimulation design patterns, improving task completion and engagement.",

  slides: [
    {
      src: "images/kidshub/home.jpg",
      heading: "Home",
      caption:
        "Simplified home screen directs users to one clear next step, reducing decision fatigue and minimizing frustration during transitions.",
    },
    {
      src: "images/kidshub/home-calm.jpg",
      heading: "Low Stimulation Mode",
      caption:
        "Alternate interface reduces visual intensity to support children sensitive to motion, contrast, or dense layouts, improving focus and emotional comfort.",
    },
    {
      src: "images/kidshub/morning.jpg",
      heading: "Morning Routine",
      caption:
        "Structured routine flow breaks tasks into manageable steps, increasing clarity, reducing resistance, and improving completion rates.",
    },
    {
      src: "images/kidshub/calmcorner.jpg",
      heading: "Calm Corner",
      caption:
        "Guided emotional regulation flow helps users identify their state, reset, and re-engage without pressure, preventing escalation during transitions.",
    },
    {
      src: "images/kidshub/reward.jpg",
      heading: "Rewards",
      caption:
        "Reinforcement system encourages effort without pressure, streaks, or performance tracking, supporting intrinsic motivation and sustained engagement.",
    },
  ],

  caseStudy: {
    product:
      "Product Type: Routine & emotional regulation tool · Users: Neurodivergent children and caregivers · Focus: Reducing friction in transitions and supporting emotional regulation",

    why:
      "Daily routines and transitions often trigger high-friction moments for neurodivergent children and their caregivers. By designing to support emotional regulation and reduce cognitive load, Kids Hub improves engagement, task completion, and caregiver confidence.",

    problem:
      "Existing tools rely on rigid routines or overstimulating interfaces, increasing resistance, emotional escalation, and incomplete tasks rather than supporting success.",

    insight:
      "A child’s emotional state directly impacts their ability to complete tasks. Addressing regulation before and during task engagement reduces friction, prevents escalation, and supports consistent progress.",

    goals: [
      "Reduce resistance during transitions",
      "Support real-time emotional regulation",
      "Simplify task flows for children and caregivers",
      "Create predictable, low-stimulation interaction patterns",
    ],

    principles: [
      "One clear action per screen",
      "Low-density layouts to reduce sensory overload",
      "No pressure-based systems",
      "Meet emotional state before task completion",
      "Allow flexibility and recovery (reset, deselect)",
    ],

    decisions: [
      "Introduced mood-first navigation to engage users before task execution",
      "Guided step-by-step flows to reduce cognitive load and improve completion rates",
      "Low-density layouts to minimize sensory overwhelm",
      "Flexible interaction options (reset, deselect) to allow recovery without frustration",
      "Integrated caregiver support tools for co-regulation and guidance",
    ],

    highlight:
      "The Calm Corner feature provides a mood-first interaction model, allowing users to regulate before continuing tasks. This reduces resistance and improves re-engagement without introducing pressure.",

    scenario:
      "During a transition, a child identifies their emotional state, selects a reset action if needed, and resumes their routine with less escalation, while caregivers receive structured guidance to maintain calm interactions.",

    impact:
      "By prioritizing emotional state and simplifying transitions, Kids Hub reduces resistance, supports smoother task completion, and enables independent re-engagement. Caregivers benefit from structured guidance, improving the overall experience for both parties.",

    reflection:
      "Future iterations include connected caregiver accounts, progress tracking, and integrations with care providers to support collaborative and adaptive routines.",
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
