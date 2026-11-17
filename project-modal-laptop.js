(() => {
  function prepareFrame() {
    const stage = document.querySelector(
      "#project-modal .modal-image-wrapper"
    );

    if (!stage) return;

    const modal = document.querySelector("#project-modal");
    const gallery = modal.querySelector(".modal-gallery");
    const info = modal.querySelector(".modal-information");

    if (!modal.querySelector(".modal-content") && gallery && info) {
      const content = document.createElement("div");

      content.className = "modal-content";
      content.dataset.laptopContent = "true";

      gallery.before(content);
      content.append(gallery, info);
    }

    if (window.matchMedia("(max-width: 760px)").matches) {
      const managed = stage.querySelector(
        ".modal-device[data-laptop-frame]"
      );

      if (managed) {
        stage.prepend(...managed.firstElementChild.childNodes);
        managed.remove();
      }

      return;
    }

    if (stage.querySelector(".modal-device")) return;

    const image = stage.querySelector("#modal-image");
    const placeholder = stage.querySelector("#modal-image-placeholder");

    if (!image) return;

    const device = document.createElement("div");
    const screen = document.createElement("div");

    device.className = "modal-device";
    device.dataset.laptopFrame = "true";
    screen.className = "modal-device-screen";

    screen.append(image);

    if (placeholder) {
      screen.append(placeholder);
    }

    device.append(screen);
    stage.prepend(device);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      prepareFrame,
      { once: true }
    );
  } else {
    prepareFrame();
  }

  window.addEventListener("resize", prepareFrame);
})();