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
    modal.dataset.preview = "desktop";

    // Menambahkan frame tanpa perlu mengubah index.html.
    const device = document.createElement("div");
    device.className = "modal-device";

    const screen = document.createElement("div");
    screen.className = "modal-device-screen";
    screen.append(modalImage, imagePlaceholder);

    device.append(screen);
    imageWrapper.prepend(device);

    // Satu area scroll untuk konten pada layar ponsel.
    const content = document.createElement("div");
    content.className = "modal-content";

    const gallery = modal.querySelector(".modal-gallery");
    const information = modal.querySelector(".modal-information");

    gallery.before(content);
    content.append(gallery, information);

    // SVG agar bentuk ikon konsisten di berbagai perangkat.
    const iconPaths = {
      desktop: "M3 4h18v13H3z M8 21h8 M12 17v4",
      mobile: "M7 2h10v20H7z M10 19h4",
      close: "M5 5l14 14 M19 5L5 19",
      previous: "M15 4l-8 8 8 8",
      next: "M9 4l8 8-8 8",
      external: "M7 17L17 7 M7 7h10v10"
    };

    function makeIcon(name) {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "1.8");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.setAttribute("aria-hidden", "true");

      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("d", iconPaths[name]);

      svg.append(path);
      return svg;
    }

    viewButtons.forEach(button => {
      button.querySelector("span")?.replaceChildren(
        makeIcon(button.dataset.view)
      );
    });

    closeButton.replaceChildren(makeIcon("close"));
    galleryPrev.replaceChildren(makeIcon("previous"));
    galleryNext.replaceChildren(makeIcon("next"));

    const githubIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    githubIcon.setAttribute("viewBox", "0 0 24 24");
    githubIcon.setAttribute("aria-hidden", "true");
    githubIcon.classList.add("github-icon");

    const githubPath = document.createElementNS(
      githubIcon.namespaceURI,
      "path"
    );

    githubPath.setAttribute(
      "d",
      "M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.77-.244.77-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.79-1.508-3.79-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.022-.699.078-.684.078-.684 1.13.08 1.724 1.16 1.724 1.16 1.004 1.72 2.633 1.223 3.275.935.102-.727.393-1.223.715-1.504-2.5-.285-5.127-1.25-5.127-5.563 0-1.23.44-2.233 1.16-3.021-.116-.285-.503-1.43.11-2.98 0 0 .945-.303 3.094 1.155a10.78 10.78 0 0 1 5.63 0c2.148-1.458 3.09-1.155 3.09-1.155.616 1.55.229 2.695.113 2.98.723.788 1.158 1.791 1.158 3.021 0 4.325-2.63 5.275-5.137 5.553.404.35.764 1.043.764 2.1 0 1.516-.014 2.74-.014 3.112 0 .3.203.65.774.54A11.252 11.252 0 0 0 12 .75Z"
    );

    githubIcon.append(githubPath);
    modalLink.prepend(githubIcon);
    modalLink.querySelector("b")?.replaceChildren(makeIcon("external"));

    const makeImages = (folder, prefix, total, label) =>
      Array.from({ length: total }, (_, index) => ({
        src: `assets/projects/${folder}/${prefix}-${index + 1}.png`,
        alt: `${label} ${index + 1}`
      }));

    const projects = {
      cms: {
        number: "01",
        title: "Class Management System",
        category: "WEB DEVELOPMENT",
        description:
          "Aplikasi pengelolaan data kelas dan kehadiran siswa yang mempermudah administrasi sekolah.",
        overview:
          "Aplikasi berbasis web untuk mengelola data kelas, kehadiran, dan rekapitulasi secara efisien dengan fitur CRUD.",
        technologies: ["PHP", "MySQL", "CSS"],
        features: [
          "Dashboard administrasi",
          "Manajemen data siswa & kelas",
          "Rekapitulasi kehadiran",
          "Operasi CRUD"
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

      imageWrapper.classList.toggle(
        "mobile-view",
        activeView === "mobile"
      );

      if (images.length === 0) {
        currentImageIndex = 0;
        galleryCurrent.textContent = "00";
        galleryTotal.textContent = "00";
        galleryPrev.disabled = true;
        galleryNext.disabled = true;

        setPlaceholder(
          `Screenshot ${
            activeView === "desktop" ? "Desktop" : "Mobile"
          } untuk proyek ini belum ditambahkan.`
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

        setPlaceholder(
          "File screenshot tidak ditemukan. Periksa nama dan lokasi gambar di folder assets/projects."
        );
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
      modal.dataset.preview = view;

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
      modal.dataset.preview = "desktop";
      currentImageIndex = 0;
      content.scrollTop = 0;
      information.scrollTop = 0;

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

    // Tombol pada kartu proyek.
    document.querySelectorAll(
      ".project-card-link[data-project]"
    ).forEach(button => {
      button.addEventListener("click", () => {
        openProject(button.dataset.project, button);
      });
    });

    // Pilihan tampilan desktop / mobile.
    viewButtons.forEach(button => {
      button.addEventListener("click", () => {
        setActiveView(button.dataset.view);
      });
    });

    galleryPrev.addEventListener("click", () => moveImage(-1));
    galleryNext.addEventListener("click", () => moveImage(1));

    closeButton.addEventListener("click", closeProject);
    overlay.addEventListener("click", closeProject);

    modalLink.addEventListener("click", () => {
      if (activeProject && !activeProject.external) {
        closeProject();
      }
    });

    // Navigasi keyboard dan penjagaan fokus di dalam modal.
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

    // Swipe pada area preview.
    imageWrapper.addEventListener("touchstart", event => {
      if (!event.changedTouches.length) return;

      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });

    imageWrapper.addEventListener("touchend", event => {
      if (!event.changedTouches.length) return;

      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;

      if (
        Math.abs(deltaX) > 45 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2
      ) {
        moveImage(deltaX < 0 ? 1 : -1);
      }
    }, { passive: true });

    // Hentikan slideshow saat tab browser tidak terlihat.
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
    document.addEventListener(
      "DOMContentLoaded",
      initProjectModal,
      { once: true }
    );
  } else {
    initProjectModal();
  }
})();