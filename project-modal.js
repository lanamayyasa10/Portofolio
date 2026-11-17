/* =========================================================
   PROJECT DETAIL MODAL
   Desktop/Mobile gallery, auto slideshow, manual controls
========================================================= */

(() => {
  "use strict";

  function initProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal || modal.dataset.initialized === "true") return;

    const closeButton = document.getElementById("modal-close");
    const overlay = modal.querySelector(".project-modal-overlay");
    const modalImage = document.getElementById("modal-image");
    const imagePlaceholder = document.getElementById("modal-image-placeholder");
    const imageWrapper = modal.querySelector(".modal-image-wrapper");

    const modalTitle = document.getElementById("modal-title");
    const modalCategory = document.getElementById("modal-category");
    const modalNumber = document.getElementById("modal-number");
    const modalEyebrow = document.getElementById("modal-eyebrow");
    const modalDescription = document.getElementById("modal-description");
    const modalOverview = document.getElementById("modal-overview");
    const modalTechnologies = document.getElementById("modal-technologies");
    const modalFeatures = document.getElementById("modal-features");

    const modalLink = document.getElementById("modal-project-link");
    const modalLinkLabel = document.getElementById("modal-link-label");

    const galleryPrev = document.getElementById("gallery-prev");
    const galleryNext = document.getElementById("gallery-next");
    const galleryCurrent = document.getElementById("gallery-current");
    const galleryTotal = document.getElementById("gallery-total");
    const viewButtons = [...modal.querySelectorAll(".preview-switch-btn")];

    const requiredElements = [
      closeButton, overlay, modalImage, imagePlaceholder, imageWrapper,
      modalTitle, modalCategory, modalNumber, modalEyebrow,
      modalDescription, modalOverview, modalTechnologies, modalFeatures,
      modalLink, modalLinkLabel, galleryPrev, galleryNext,
      galleryCurrent, galleryTotal
    ];

    if (requiredElements.some(element => !element)) {
      console.error("Project modal: ada elemen HTML yang belum ditemukan.");
      return;
    }

    modal.dataset.initialized = "true";
    modal.hidden = true;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    const makeImages = (folder, prefix, total, label) =>
      Array.from({ length: total }, (_, index) => ({
        src: `assets/projects/${folder}/${prefix}-${index + 1}.png`,
        alt: `${label} ${index + 1}`
      }));

    /* Data proyek mengikuti judul, deskripsi, dan teknologi
       yang sudah tercantum pada kartu proyek di portfolio. */
    const projects = {
      cms: {
        number: "01",
        title: "Class Management System",
        category: "WEB DEVELOPMENT",
        description:
          "A class management dashboard designed to organise class data, simplify recapitulation, and support CRUD operations.",
        overview:
          "A web-based application designed to help administrators manage class information and student attendance through an organised dashboard.",
        technologies: ["PHP", "MVC", "CRUD"],
        features: [
          "Dashboard administrasi",
          "Pengelolaan data siswa",
          "Pengelolaan data kelas",
          "Rekapitulasi data"
        ],
        views: {
          desktop: makeImages("cms", "desktop", 8, "CMS Desktop Screenshot"),
          mobile: makeImages("cms", "mobile", 11, "CMS Mobile Screenshot")
        },
        link: "https://github.com/lanamayyasa10/Daftar-Hadir-Program",
        linkLabel: "View Source Code on GitHub",
        external: true
      },

      loka: {
        number: "02",
        title: "Loka Jawa",
        category: "WEB DEVELOPMENT",
        description:
          "An interactive cultural storytelling website that introduces visitors to traditional stories and Indonesian heritage.",
        overview:
          "A digital experience focused on introducing traditional stories and Indonesian cultural heritage through an interactive website.",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: [
          "Cultural storytelling",
          "Traditional stories",
          "Indonesian cultural heritage"
        ],
        /* Add the Loka Jawa screenshots when they are available. */
        views: {
          desktop: [],
          mobile: []
        },
        link: "https://github.com/lanamayyasa10/LokaJawa",
        linkLabel: "View Source Code on GitHub",
        external: true
      },

      creative: {
        number: "03",
        title: "Creative Interface",
        category: "UI / UX DESIGN",
        description:
          "An interface design concept focused on visual hierarchy, consistent components, and an intuitive user experience.",
        overview:
          "A UI/UX design project exploring visual composition, interface consistency, and user-friendly digital experiences.",
        technologies: ["Figma", "UI Design", "Prototyping"],
        features: [
          "Visual hierarchy",
          "Consistent components",
          "Interface design",
          "User experience exploration"
        ],
        /* Add the Creative Interface screenshots when they are available. */
        views: {
          desktop: [],
          mobile: []
        },
        link: "#contact",
        linkLabel: "Discuss This Design",
        external: false
      }
    };

    const AUTO_SLIDE_DELAY = 4000;

    let activeProject = null;
    let activeView = "desktop";
    let currentImageIndex = 0;
    let autoSlideTimer = null;
    let closeTimer = null;
    let previousTrigger = null;
    let previousBodyOverflow = "";
    let touchStartX = 0;
    let touchStartY = 0;

    function currentImages() {
      if (!activeProject) return [];
      return activeProject.views[activeView] || [];
    }

    function stopAutoSlide() {
      if (autoSlideTimer !== null) {
        window.clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function startAutoSlide() {
      stopAutoSlide();

      const images = currentImages();
      if (!modal.classList.contains("active")) return;
      if (document.hidden || images.length <= 1) return;

      autoSlideTimer = window.setInterval(() => {
        showImage(currentImageIndex + 1);
      }, AUTO_SLIDE_DELAY);
    }

    function setPlaceholder(message) {
      modalImage.hidden = true;
      imagePlaceholder.hidden = false;

      const paragraph = imagePlaceholder.querySelector("p");
      if (paragraph) paragraph.textContent = message;
    }

    function showImage(index) {
      if (!activeProject) return;

      const images = currentImages();

      imageWrapper.classList.toggle("mobile-view", activeView === "mobile");

      if (images.length === 0) {
        currentImageIndex = 0;
        galleryCurrent.textContent = "00";
        galleryTotal.textContent = "00";
        galleryPrev.disabled = true;
        galleryNext.disabled = true;

        setPlaceholder(
          `Screenshot ${activeView === "desktop" ? "Desktop" : "Mobile"} untuk proyek ini belum ditambahkan.`
        );
        return;
      }

      currentImageIndex = (index + images.length) % images.length;

      const image = images[currentImageIndex];

      galleryCurrent.textContent =
        String(currentImageIndex + 1).padStart(2, "0");
      galleryTotal.textContent =
        String(images.length).padStart(2, "0");

      galleryPrev.disabled = images.length <= 1;
      galleryNext.disabled = images.length <= 1;

      modalImage.classList.add("changing");
      imagePlaceholder.hidden = true;
      modalImage.hidden = false;
      modalImage.alt = image.alt;

      modalImage.onload = () => {
        modalImage.classList.remove("changing");
      };

      modalImage.onerror = () => {
        modalImage.classList.remove("changing");
        setPlaceholder("File screenshot tidak ditemukan. Periksa nama dan lokasi gambar di folder assets/projects.");
      };

      modalImage.src = image.src;
    }

    function moveImage(direction) {
      if (!activeProject || currentImages().length <= 1) return;
      showImage(currentImageIndex + direction);
      startAutoSlide();
    }

    function setActiveView(view) {
      if (!activeProject || !["desktop", "mobile"].includes(view)) return;

      activeView = view;

      viewButtons.forEach(button => {
        const selected = button.dataset.view === activeView;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      currentImageIndex = 0;
      showImage(0);
      startAutoSlide();
    }

    function fillProjectInformation(project) {
      modalTitle.textContent = project.title;
      modalCategory.textContent = project.category;
      modalNumber.textContent = `${project.number} / PROJECT`;
      modalEyebrow.textContent = project.category;
      modalDescription.textContent = project.description;
      modalOverview.textContent = project.overview;

      modalTechnologies.replaceChildren(
        ...project.technologies.map(technology => {
          const tag = document.createElement("span");
          tag.textContent = technology;
          return tag;
        })
      );

      modalFeatures.replaceChildren(
        ...project.features.map(feature => {
          const item = document.createElement("li");
          item.textContent = feature;
          return item;
        })
      );

      modalLink.href = project.link;
      modalLinkLabel.textContent = project.linkLabel;

      if (project.external) {
        modalLink.target = "_blank";
        modalLink.rel = "noopener noreferrer";
      } else {
        modalLink.removeAttribute("target");
        modalLink.removeAttribute("rel");
      }
    }

    function openProject(projectKey, trigger) {
      const project = projects[projectKey];
      if (!project) {
        console.warn(`Data proyek "${projectKey}" tidak ditemukan.`);
        return;
      }

      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      activeProject = project;
      previousTrigger = trigger;
      activeView = "desktop";
      currentImageIndex = 0;

      fillProjectInformation(project);

      viewButtons.forEach(button => {
        const selected = button.dataset.view === "desktop";
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      previousBodyOverflow = document.body.style.overflow;

      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("project-modal-open");
      document.body.style.overflow = "hidden";

      showImage(0);

      window.requestAnimationFrame(() => {
        modal.classList.add("active");
        closeButton.focus();
        startAutoSlide();
      });
    }

    function closeProject() {
      if (modal.hidden || !modal.classList.contains("active")) return;

      stopAutoSlide();
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("project-modal-open");
      document.body.style.overflow = previousBodyOverflow;

      closeTimer = window.setTimeout(() => {
        modal.hidden = true;
        activeProject = null;
        closeTimer = null;

        if (previousTrigger && document.contains(previousTrigger)) {
          previousTrigger.focus();
        }
      }, 300);
    }

    /* Project card buttons */
    document.querySelectorAll(".project-card-link[data-project]").forEach(button => {
      button.addEventListener("click", () => {
        openProject(button.dataset.project, button);
      });
    });

    /* Desktop / Mobile switch */
    viewButtons.forEach(button => {
      button.addEventListener("click", () => {
        setActiveView(button.dataset.view);
      });
    });

    /* Manual arrows */
    galleryPrev.addEventListener("click", () => moveImage(-1));
    galleryNext.addEventListener("click", () => moveImage(1));

    /* Close actions */
    closeButton.addEventListener("click", closeProject);
    overlay.addEventListener("click", closeProject);

    /* Close the modal before navigating to Contact for Creative Interface. */
    modalLink.addEventListener("click", () => {
      if (activeProject && !activeProject.external) {
        closeProject();
      }
    });

    /* Keyboard controls and focus trap */
    document.addEventListener("keydown", event => {
      if (modal.hidden || !modal.classList.contains("active")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveImage(1);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveImage(-1);
        return;
      }

      if (event.key === "Tab") {
        const focusable = [
          ...modal.querySelectorAll(
            'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
          )
        ].filter(element => !element.hidden);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    /* Touch swipe on the preview image */
    imageWrapper.addEventListener("touchstart", event => {
      if (!event.changedTouches.length) return;
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    imageWrapper.addEventListener("touchend", event => {
      if (!event.changedTouches.length) return;

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        moveImage(deltaX < 0 ? 1 : -1);
      }
    }, { passive: true });

    /* Pause slideshow while the browser tab is not visible */
    document.addEventListener("visibilitychange", () => {
      if (!modal.classList.contains("active")) return;

      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });

    console.info("Project Detail Modal siap digunakan.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectModal, { once: true });
  } else {
    initProjectModal();
  }
})();
