const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));


/* Project category slider: tabs, arrows, keyboard and touch swipe */
const projectTabs = [...document.querySelectorAll(".project-tab")];
const projectPanels = [...document.querySelectorAll(".projects-panel")];
const currentProjectNumber = document.querySelector("#project-current-number");
const projectStage = document.querySelector("#project-stage");
let activeProjectIndex = 0;

function showProjectCategory(index) {
  activeProjectIndex = (index + projectTabs.length) % projectTabs.length;

  projectTabs.forEach((tab, i) => {
    const selected = i === activeProjectIndex;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  projectPanels.forEach((panel, i) => {
    const selected = i === activeProjectIndex;
    panel.hidden = !selected;
    panel.classList.toggle("active", selected);
  });

  if (currentProjectNumber) {
    currentProjectNumber.textContent = String(activeProjectIndex + 1).padStart(2, "0");
  }
}

projectTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showProjectCategory(index));
  tab.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + projectTabs.length) % projectTabs.length;
      showProjectCategory(nextIndex);
      projectTabs[nextIndex].focus();
    }
  });
});

document.querySelector("#project-prev")?.addEventListener("click", () => showProjectCategory(activeProjectIndex - 1));
document.querySelector("#project-next")?.addEventListener("click", () => showProjectCategory(activeProjectIndex + 1));

let touchStartX = 0;
let touchStartY = 0;
projectStage?.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

projectStage?.addEventListener("touchend", event => {
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
    showProjectCategory(activeProjectIndex + (deltaX < 0 ? 1 : -1));
  }
}, { passive: true });


/* Hero project strip controls */
const heroWorkTrack = document.querySelector("#hero-work-track");
document.querySelector("#hero-work-prev")?.addEventListener("click", () => {
  heroWorkTrack?.scrollBy({ left: -heroWorkTrack.clientWidth * 0.72, behavior: "smooth" });
});
document.querySelector("#hero-work-next")?.addEventListener("click", () => {
  heroWorkTrack?.scrollBy({ left: heroWorkTrack.clientWidth * 0.72, behavior: "smooth" });
});


/* Typewriter animation: Full-stack Developer <-> UI/UX Designer */
(() => {
  const topWord = document.querySelector("#hero-role-top");
  const bottomWord = document.querySelector("#hero-role-bottom");
  const roleHeading = document.querySelector(".hero-role-bottom");

  if (!topWord || !bottomWord) return;

  const roles = [
    { top: "Full-stack", bottom: "Developer" },
    { top: "UI/UX", bottom: "Designer" }
  ];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let roleIndex = 0;
  let currentTop = roles[0].top;
  let currentBottom = roles[0].bottom;

  if (roleHeading) {
    roleHeading.setAttribute("aria-label", "Full-stack Developer");
  }

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function erase(element, value, speed = 48) {
    while (value.length > 0) {
      value = value.slice(0, -1);
      element.textContent = value;
      await wait(speed);
    }
    return value;
  }

  async function type(element, value, speed = 95) {
    let typed = "";
    for (const character of value) {
      typed += character;
      element.textContent = typed;
      await wait(speed);
    }
    return typed;
  }

  async function animateRoles() {
    await wait(1800);

    while (true) {
      const nextIndex = (roleIndex + 1) % roles.length;
      const nextRole = roles[nextIndex];

      // Delete the current title, then type the next one.
      await erase(bottomWord, currentBottom, 42);
      await erase(topWord, currentTop, 42);
      await wait(180);

      currentTop = await type(topWord, nextRole.top, 105);
      await wait(130);
      currentBottom = await type(bottomWord, nextRole.bottom, 90);

      roleIndex = nextIndex;
      if (roleHeading) {
        roleHeading.setAttribute("aria-label", `${currentTop} ${currentBottom}`);
      }
      await wait(1900);
    }
  }

  animateRoles();
})();

/* ===== INTERACTIVE LANYARD DRAG ===== */

(() => {
  const hanger = document.querySelector("#lanyard-hanger");

  if (!hanger) return;

  let dragging = false;
  let startX = 0;
  let startAngle = 0;
  let currentAngle = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let animationFrame = null;

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  function setAngle(angle) {
    currentAngle = clamp(angle, -28, 28);

    hanger.style.setProperty(
      "--swing-angle",
      `${currentAngle}deg`
    );
  }

  hanger.addEventListener("pointerdown", (event) => {
    const transform = getComputedStyle(hanger).transform;

    if (transform !== "none") {
      const matrix = new DOMMatrixReadOnly(transform);

      currentAngle =
        Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    }

    dragging = true;

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    hanger.classList.add("dragging");

    setAngle(currentAngle);

    startX = event.clientX;
    lastX = event.clientX;
    startAngle = currentAngle;
    lastTime = performance.now();
    velocity = 0;

    hanger.setPointerCapture(event.pointerId);

    event.preventDefault();
  });

  hanger.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const now = performance.now();
    const elapsed = Math.max(1, now - lastTime);

    velocity = (event.clientX - lastX) / elapsed;

    lastX = event.clientX;
    lastTime = now;

    const distance = event.clientX - startX;

    setAngle(startAngle + distance * 0.55);
  });

  function releaseLanyard() {
    if (!dragging) return;

    dragging = false;

    let angle = currentAngle;
    let speed = clamp(velocity * 2.5, -3, 3);

    function swing() {
      if (dragging) return;

      speed *= 0.96;
      angle += speed;
      angle *= 0.985;

      setAngle(angle);

      if (
        Math.abs(speed) > 0.025 ||
        Math.abs(angle) > 0.25
      ) {
        animationFrame = requestAnimationFrame(swing);
      } else {
        animationFrame = null;

        hanger.style.removeProperty("--swing-angle");
        hanger.classList.remove("dragging");
      }
    }

    animationFrame = requestAnimationFrame(swing);
  }

  hanger.addEventListener("pointerup", releaseLanyard);
  hanger.addEventListener("pointercancel", releaseLanyard);
})();


/* ===== INTERACTIVE CORE TECH STACK ===== */

(() => {
  const section = document.querySelector(".skills-showcase");
  const buttons = [...document.querySelectorAll(".tech-item")];

  if (!section || !buttons.length) return;

  const skillData = {
    html: {
      category: "FRONTEND DEVELOPMENT",
      title: "HTML5",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      description: "Building structured, semantic, and accessible web pages.",
      tags: ["Semantic HTML", "Web Structure", "Accessibility"],
      status: "CORE FOUNDATION"
    },
    css: {
      category: "FRONTEND DEVELOPMENT",
      title: "CSS3",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      description: "Creating responsive layouts, visual styles, and polished web interfaces.",
      tags: ["Responsive Design", "Flexbox & Grid", "Animations"],
      status: "CORE FOUNDATION"
    },
    javascript: {
      category: "WEB INTERACTION",
      title: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      description: "Adding dynamic behaviour, interactive components, and functionality to websites.",
      tags: ["DOM", "Events", "Interactivity"],
      status: "PRACTISING"
    },
    php: {
      category: "BACKEND DEVELOPMENT",
      title: "PHP",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      description: "Working with server-side logic and the data flow behind web applications.",
      tags: ["Server-side", "Forms", "Application Logic"],
      status: "BUILDING PROJECTS"
    },
    laravel: {
      category: "BACKEND FRAMEWORK",
      title: "Laravel",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
      description: "Exploring structured web application development with routes, controllers, and CRUD operations.",
      tags: ["MVC", "Routing", "CRUD"],
      status: "BUILDING PROJECTS"
    },
    figma: {
      category: "UI / UX DESIGN",
      title: "Figma",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      description: "Designing interfaces and prototypes with a focus on usability and visual consistency.",
      tags: ["UI Design", "Wireframes", "Prototyping"],
      status: "DESIGN PRACTICE"
    }
  };

  const category = document.querySelector("#skill-category");
  const index = document.querySelector("#skill-index");
  const icon = document.querySelector("#skill-detail-icon");
  const title = document.querySelector("#skill-detail-title");
  const description = document.querySelector("#skill-detail-description");
  const tags = document.querySelector("#skill-detail-tags");
  const status = document.querySelector("#skill-detail-status");

  function selectSkill(button) {
    const data = skillData[button.dataset.skill];
    if (!data) return;

    buttons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    const position = buttons.indexOf(button) + 1;

    category.textContent = data.category;
    index.textContent =
      `${String(position).padStart(2, "0")} / ${String(buttons.length).padStart(2, "0")}`;

    icon.src = data.icon;
    icon.alt = data.title;
    title.textContent = data.title;
    description.textContent = data.description;
    status.textContent = data.status;

    tags.replaceChildren(
      ...data.tags.map(label => {
        const tag = document.createElement("span");
        tag.textContent = label;
        return tag;
      })
    );
  }

  buttons.forEach(button => {
    button.addEventListener("mouseenter", () => selectSkill(button));
    button.addEventListener("focus", () => selectSkill(button));
    button.addEventListener("click", () => selectSkill(button));
  });

  // Reveal technology icons when the Skills section enters the viewport.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        section.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.18 });

    observer.observe(section);
  } else {
    section.classList.add("is-visible");
  }

  const initialButton =
    buttons.find(button => button.dataset.skill === "html") || buttons[0];

  selectSkill(initialButton);
})();

