import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

let masonryInstance = null;

export function initMasonry(containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    return null;
  }

  masonryInstance = new Masonry(container, {
    itemSelector: ".item",
    columnWidth: ".item",
    percentPosition: true,
    gutter: 8,
    horizontalOrder: true,
  });

  imagesLoaded(container, () => {
    masonryInstance.layout();
  });

  return masonryInstance;
}

export function updateMasonry() {
  if (masonryInstance) {
    imagesLoaded(masonryInstance.element, () => {
      masonryInstance.reloadItems();
      masonryInstance.layout();
    });
  }
}

export function destroyMasonry() {
  if (masonryInstance) {
    masonryInstance.destroy();
    masonryInstance = null;
  }
}
