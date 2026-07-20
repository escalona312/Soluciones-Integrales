const WHATSAPP_NUMBER = "56935172731";
const CLIENT_RAIL_SPEED = 20;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

document.documentElement.classList.replace("no-js", "has-js");

function initializeHeader() {
  let header = document.querySelector("[data-site-header]");
  let menuToggle = document.querySelector("[data-menu-toggle]");
  let mobileMenu = document.querySelector("[data-mobile-menu]");
  let brandLink = header?.querySelector(".brand");

  if (header) {
    let updateHeader = function () {
      header.classList.toggle("is-fixed", window.scrollY > 120);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (!menuToggle || !mobileMenu) return;

  function setMenuState(isOpen) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    mobileMenu.hidden = !isOpen;
    document.body.classList.toggle("menu-is-open", isOpen);
  }

  menuToggle.addEventListener("click", function () {
    let isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  let menuLinks = mobileMenu.querySelectorAll("a");
  for (let link of menuLinks) {
    link.addEventListener("click", function () {
      setMenuState(false);
    });
  }

  if (brandLink) {
    brandLink.addEventListener("click", function () {
      setMenuState(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
    setMenuState(false);
    menuToggle.focus();
  });

  document.addEventListener("focusin", function (event) {
    if (menuToggle.getAttribute("aria-expanded") !== "true") return;
    if (event.target instanceof Node && header?.contains(event.target)) return;
    setMenuState(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) setMenuState(false);
  });
}

function initializeScrollProgress() {
  let progress = document.querySelector("[data-scroll-progress]");
  if (!progress) return;

  let ticking = false;

  function updateProgress() {
    let scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    let ratio = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
    ticking = false;
  }

  function requestProgressUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }

  updateProgress();
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
}

function initializeReveals() {
  let elements = document.querySelectorAll("[data-reveal]");
  if (elements.length === 0) return;

  if (REDUCED_MOTION.matches || !("IntersectionObserver" in window)) {
    for (let element of elements) element.classList.add("is-visible");
    return;
  }

  let observer = new IntersectionObserver(
    function (entries) {
      for (let entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  document.documentElement.classList.add("reveal-enabled");
  for (let element of elements) observer.observe(element);
}

function initializeAboutStory() {
  let story = document.querySelector("[data-about-story]");
  let rail = story?.querySelector("[data-about-rail]");
  let steps = story?.querySelectorAll("[data-about-step]");
  if (!story || !rail || !steps || steps.length === 0) return;

  if (!("requestAnimationFrame" in window)) {
    story.classList.add("about-story--static");
    rail.style.setProperty("--about-progress", "1");
    return;
  }

  let animationFrame = 0;

  function clamp(value) {
    return Math.min(1, Math.max(0, value));
  }

  function renderAboutStory() {
    let viewportHeight = window.innerHeight;
    let horizontalOffset = Math.min(200, Math.max(72, window.innerWidth * 0.16));
    let measurements = [];
    let activeIndex = -1;
    let railProgress = 0;

    for (let index = 0; index < steps.length; index += 1) {
      let step = steps[index];
      let bounds = step.getBoundingClientRect();
      let rawProgress = clamp(
        (viewportHeight - bounds.top) / (viewportHeight * 0.5 + bounds.height * 0.5),
      );
      let progress = rawProgress * rawProgress;
      let offset = (1 - progress) * horizontalOffset;
      let iconVisible = bounds.top < viewportHeight * 0.92;

      if (progress > 0.32) activeIndex = index;
      if (progress > 0) railProgress = Math.max(railProgress, (index + progress) / steps.length);
      measurements.push({ step, progress, offset, iconVisible, index });
    }

    rail.style.setProperty("--about-progress", String(clamp(railProgress)));
    for (let measurement of measurements) {
      measurement.step.style.setProperty("--about-step-opacity", measurement.progress.toFixed(4));
      measurement.step.style.setProperty("--about-step-offset", `${measurement.offset.toFixed(2)}px`);
      measurement.step.classList.toggle("is-active", measurement.index === activeIndex);
      measurement.step.classList.toggle("is-reached", measurement.progress >= 0.98);
      if (measurement.iconVisible) measurement.step.classList.add("is-icon-visible");
    }

    animationFrame = 0;
  }

  function requestAboutRender() {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(renderAboutStory);
  }

  renderAboutStory();
  window.addEventListener("scroll", requestAboutRender, { passive: true });
  window.addEventListener("resize", requestAboutRender);
}

function initializeClientRail() {
  let viewport = document.querySelector("[data-client-rail]");
  let track = viewport?.querySelector(".client-rail__track");
  let groups = track?.querySelectorAll(".client-rail__group");
  if (!viewport || !track || !groups || groups.length !== 2) return;

  let primaryGroup = groups[0];
  let duplicateGroup = groups[1];
  let sourceItems = Array.from(primaryGroup.children);
  let resizeFrame = 0;
  if (sourceItems.length === 0) return;

  function removeGeneratedClones() {
    let clones = track.querySelectorAll("[data-client-rail-clone]");
    for (let clone of clones) clone.remove();
  }

  function appendCloneSets(group, setCount) {
    let fragment = document.createDocumentFragment();

    for (let setIndex = 1; setIndex < setCount; setIndex += 1) {
      for (let item of sourceItems) {
        let clone = item.cloneNode(true);
        if (!(clone instanceof HTMLElement)) continue;

        clone.setAttribute("data-client-rail-clone", "");
        clone.setAttribute("aria-hidden", "true");
        let image = clone.querySelector("img");
        if (image instanceof HTMLImageElement) image.alt = "";
        fragment.append(clone);
      }
    }

    group.append(fragment);
  }

  function synchronizeRail() {
    removeGeneratedClones();
    track.style.removeProperty("--client-rail-duration");

    let firstItem = sourceItems[0];
    if (!(firstItem instanceof HTMLElement)) return;

    let itemWidth = firstItem.getBoundingClientRect().width;
    let styles = window.getComputedStyle(primaryGroup);
    let gap = Number.parseFloat(styles.columnGap) || 0;
    let basePeriod = sourceItems.length * (itemWidth + gap);
    if (basePeriod <= 0) return;

    let setCount = Math.max(1, Math.ceil((viewport.clientWidth + gap) / basePeriod));
    appendCloneSets(primaryGroup, setCount);
    appendCloneSets(duplicateGroup, setCount);

    let totalPeriod = basePeriod * setCount;
    track.style.setProperty("--client-rail-duration", `${totalPeriod / CLIENT_RAIL_SPEED}s`);
  }

  function requestRailSync() {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      synchronizeRail();
      resizeFrame = 0;
    });
  }

  synchronizeRail();

  if ("ResizeObserver" in window) {
    let resizeObserver = new ResizeObserver(requestRailSync);
    resizeObserver.observe(viewport);
  } else {
    window.addEventListener("resize", requestRailSync);
  }

  if (typeof REDUCED_MOTION.addEventListener === "function") {
    REDUCED_MOTION.addEventListener("change", requestRailSync);
  } else {
    REDUCED_MOTION.addListener(requestRailSync);
  }
}

function initializeGallery(gallery) {
  let track = gallery.querySelector("[data-gallery-track]");
  let slides = gallery.querySelectorAll(".gallery-slide");
  let previousButton = gallery.querySelector("[data-gallery-prev]");
  let nextButton = gallery.querySelector("[data-gallery-next]");
  let counter = gallery.querySelector("[data-gallery-counter]");
  let currentIndex = 0;
  let pointerStart = null;

  if (!track || slides.length === 0) return;

  function updateGallery(nextIndex) {
    let total = slides.length;
    currentIndex = (nextIndex + total) % total;
    track.style.transform = `translate3d(${-currentIndex * 100}%, 0, 0)`;

    for (let index = 0; index < total; index += 1) {
      let slide = slides[index];
      slide.setAttribute("aria-hidden", String(index !== currentIndex));
    }

    if (counter) {
      let current = String(currentIndex + 1).padStart(2, "0");
      let totalLabel = String(total).padStart(2, "0");
      counter.textContent = `${current} / ${totalLabel}`;
    }
  }

  gallery.setAttribute("tabindex", "0");
  if (counter) {
    counter.setAttribute("aria-live", "polite");
    counter.setAttribute("aria-atomic", "true");
  }

  if (slides.length === 1) {
    if (previousButton) previousButton.hidden = true;
    if (nextButton) nextButton.hidden = true;
    updateGallery(0);
    return;
  }

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      updateGallery(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      updateGallery(currentIndex + 1);
    });
  }

  gallery.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateGallery(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateGallery(currentIndex + 1);
    }
  });

  gallery.addEventListener(
    "pointerdown",
    function (event) {
      if (event.pointerType === "mouse") return;
      pointerStart = event.clientX;
    },
    { passive: true },
  );

  gallery.addEventListener(
    "pointerup",
    function (event) {
      if (pointerStart === null) return;
      let distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) < 45) return;
      updateGallery(currentIndex + (distance < 0 ? 1 : -1));
    },
    { passive: true },
  );

  updateGallery(0);
}

function initializeGalleries() {
  let galleries = document.querySelectorAll("[data-gallery]");
  for (let gallery of galleries) initializeGallery(gallery);
}

function initializeFilters() {
  let filterList = document.querySelector("[data-filter-list]");
  let projectGrid = document.querySelector("[data-project-grid]");
  if (!filterList || !projectGrid) return;

  let buttons = filterList.querySelectorAll("[data-filter]");
  let projects = projectGrid.querySelectorAll("[data-project]");
  let emptyState = document.querySelector("[data-filter-empty]");
  let status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("aria-live", "polite");
  filterList.insertAdjacentElement("afterend", status);

  function applyFilter(filter) {
    let visibleCount = 0;

    for (let button of buttons) {
      let isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }

    for (let project of projects) {
      let categories = new Set((project.dataset.category || "").split(" "));
      let shouldShow = filter === "todos" || categories.has(filter);

      if (shouldShow) {
        project.hidden = false;
        project.classList.add("is-filtering-in");
        visibleCount += 1;
      } else {
        project.classList.remove("is-filtering-in");
        project.hidden = true;
      }
    }

    if (emptyState) emptyState.hidden = visibleCount !== 0;
    status.textContent = `${visibleCount} ${visibleCount === 1 ? "proyecto visible" : "proyectos visibles"}.`;
  }

  for (let button of buttons) {
    button.addEventListener("click", function () {
      applyFilter(button.dataset.filter || "todos");
    });
  }

  for (let project of projects) {
    project.addEventListener("animationend", function (event) {
      if (event.animationName === "card-in") project.classList.remove("is-filtering-in");
    });
  }
}

function initializeHousesDialog() {
  let dialog = document.querySelector("[data-houses-dialog]");
  if (!dialog || typeof dialog.showModal !== "function") return;

  let openButtons = document.querySelectorAll("[data-open-houses]");
  let closeButtons = dialog.querySelectorAll("[data-close-houses]");
  let previousFocus = null;

  function openDialog(event) {
    previousFocus = event.currentTarget;
    dialog.showModal();
    document.body.classList.add("dialog-is-open");
  }

  function closeDialog() {
    dialog.close();
  }

  for (let button of openButtons) button.addEventListener("click", openDialog);
  for (let button of closeButtons) button.addEventListener("click", closeDialog);

  dialog.addEventListener("click", function (event) {
    let bounds = dialog.getBoundingClientRect();
    let inside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;
    if (!inside) closeDialog();
  });

  dialog.addEventListener("close", function () {
    document.body.classList.remove("dialog-is-open");
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  });
}

function initializeWhatsAppForm() {
  let form = document.querySelector("[data-whatsapp-form]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    let data = new FormData(form);
    let message = [
      "Hola, me gustaría solicitar una cotización.",
      "",
      `*Nombre:* ${data.get("nombre") || ""}`,
      `*Correo:* ${data.get("correo") || ""}`,
      `*Teléfono:* ${data.get("telefono") || ""}`,
      `*Servicio:* ${data.get("servicio") || ""}`,
      `*Descripción:* ${data.get("mensaje") || ""}`,
    ].join("\n");
    let url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function setCurrentYear() {
  let yearElements = document.querySelectorAll("[data-current-year]");
  let year = String(new Date().getFullYear());
  for (let element of yearElements) element.textContent = year;
}

function initializeSite() {
  initializeHeader();
  initializeScrollProgress();
  initializeReveals();
  initializeAboutStory();
  initializeClientRail();
  initializeGalleries();
  initializeFilters();
  initializeHousesDialog();
  initializeWhatsAppForm();
  setCurrentYear();
}

document.addEventListener("DOMContentLoaded", initializeSite);
