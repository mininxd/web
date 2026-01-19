document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("modal-open");
    // Disable scrolling when modal is opened
    document.body.style.overflow = "hidden";
  }

  function closeModal($el) {
    $el.classList.remove("modal-open");
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = "";
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  // Added .modal-backdrop for DaisyUI structure
  (
    document.querySelectorAll(
      '.modal-background, .modal-backdrop, .modal-close, .modal-card-head .delete, .modal-card-foot .button, button[aria-label="close"]',
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      // Re-enable scrolling when all modals are closed via Escape key
      document.body.style.overflow = "";
    }
  });
});
