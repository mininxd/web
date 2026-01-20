import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

let masonryInstance = null;

export function initMasonry(containerSelector) {
  // Prevent multiple instances or memory leaks
  if (masonryInstance) {
    masonryInstance.destroy();
  }

  const container = document.querySelector(containerSelector);

  if (!container) {
    return null;
  }

  try {
    masonryInstance = new Masonry(container, {
      itemSelector: ".item",
      columnWidth: ".item",
      percentPosition: true,
      gutter: 8,
      horizontalOrder: true,
    });

    imagesLoaded(container, () => {
      if (masonryInstance) {
        masonryInstance.layout();
      }
    });
  } catch (e) {
    console.error("Masonry init failed:", e);
    return null;
  }

  return masonryInstance;
}

export function updateMasonry() {
  if (masonryInstance) {
    // Add a class to temporarily disable transitions during layout update
    document.body.classList.add("masonry-updating");

    // Force immediate layout update without waiting for images
    setTimeout(() => {
      masonryInstance.reloadItems();
      masonryInstance.layout();

      // Remove the class after layout settles to restore transitions
      setTimeout(() => {
        document.body.classList.remove("masonry-updating");
      }, 50); // Slightly longer delay to ensure layout is stable
    }, 100);
  }
}

export function destroyMasonry() {
  if (masonryInstance) {
    masonryInstance.destroy();
    masonryInstance = null;
  }
}

// Make updateMasonry globally available for use in other scripts
window.updateMasonryLayout = function () {
  if (masonryInstance) {
    // Add a class to temporarily disable transitions during layout update
    document.body.classList.add("masonry-updating");

    // Force immediate layout update without waiting for images
    setTimeout(() => {
      masonryInstance.reloadItems();
      masonryInstance.layout();

      // Remove the class after layout settles to restore transitions
      setTimeout(() => {
        document.body.classList.remove("masonry-updating");
      }, 30); // Slightly longer delay to ensure layout is stable
    }, 100);
  }
};
