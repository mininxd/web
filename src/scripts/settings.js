import { initMasonry, destroyMasonry } from "./masonry.js";

const inputProductSize = document.getElementById("inputProductSize");
const valueProductSize = document.getElementById("valueProductSize");
const inputPriceSize = document.getElementById("inputPriceSize");
const valuePriceSize = document.getElementById("valuePriceSize");
const inputFontWeight = document.getElementById("inputFontWeight");
const valueFontWeight = document.getElementById("valueFontWeight");
const inputSortHeight = document.getElementById("inputSortHeight");
const inputShowCurrency = document.getElementById("inputShowCurrency");
const inputShowMerchant = document.getElementById("inputShowMerchant");
const inputCustomMerchant = document.getElementById("inputCustomMerchant");
const btnSaveMerchant = document.getElementById("btnSaveMerchant");
const inputUseMasonry = document.getElementById("inputUseMasonry");

// Load from localStorage or use default
const savedFontSize = localStorage.getItem("stickerFontSize") || 16;
const savedProductSize =
  localStorage.getItem("stickerProductSize") || savedFontSize;
const savedPriceSize =
  localStorage.getItem("stickerPriceSize") || savedFontSize;
const savedFontWeight = localStorage.getItem("stickerFontWeight") || 600;
const savedSortHeight = localStorage.getItem("stickerSortHeight");
const savedShowCurrency = localStorage.getItem("stickerShowCurrency");
const savedShowMerchant = localStorage.getItem("stickerShowMerchant");
const savedMerchantName = localStorage.getItem("stickerMerchantName");
const savedUseMasonry = localStorage.getItem("stickerUseMasonry");

// Custom Merchant Logic
if (inputCustomMerchant && btnSaveMerchant) {
  if (savedMerchantName) {
    inputCustomMerchant.value = savedMerchantName;
  }

  btnSaveMerchant.addEventListener("click", () => {
    const value = inputCustomMerchant.value.trim();
    if (value) {
      localStorage.setItem("stickerMerchantName", value);
    } else {
      localStorage.removeItem("stickerMerchantName");
    }
    window.location.reload();
  });
}

// Masonry Checkbox Logic
if (inputUseMasonry) {
  const isMasonryEnabled =
    savedUseMasonry === null ? true : savedUseMasonry === "true";
  inputUseMasonry.checked = isMasonryEnabled;

  inputUseMasonry.addEventListener("change", (e) => {
    const checked = e.target.checked;
    localStorage.setItem("stickerUseMasonry", checked);

    if (checked) {
      initMasonry("#listQrisCanvas");
    } else {
      destroyMasonry();
    }
  });
}

// Product Size Logic
if (inputProductSize) {
  inputProductSize.value = savedProductSize;
  valueProductSize.textContent = `${savedProductSize}px`;
  document.documentElement.style.setProperty(
    "--sticker-product-size",
    `${savedProductSize}px`,
  );

  inputProductSize.addEventListener("input", (e) => {
    const size = e.target.value;
    valueProductSize.textContent = `${size}px`;
    document.documentElement.style.setProperty(
      "--sticker-product-size",
      `${size}px`,
    );
    localStorage.setItem("stickerProductSize", size);

    // Update masonry layout when font size changes
    if (window.updateMasonryLayout) {
      window.updateMasonryLayout();
    }
  });
}

// Price Size Logic
if (inputPriceSize) {
  inputPriceSize.value = savedPriceSize;
  valuePriceSize.textContent = `${savedPriceSize}px`;
  document.documentElement.style.setProperty(
    "--sticker-price-size",
    `${savedPriceSize}px`,
  );

  inputPriceSize.addEventListener("input", (e) => {
    const size = e.target.value;
    valuePriceSize.textContent = `${size}px`;
    document.documentElement.style.setProperty(
      "--sticker-price-size",
      `${size}px`,
    );
    localStorage.setItem("stickerPriceSize", size);

    // Update masonry layout when font size changes
    if (window.updateMasonryLayout) {
      window.updateMasonryLayout();
    }
  });
}

// Font Weight Logic
const getFontWeightLabel = (weight) => {
  const labels = {
    400: "Normal",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black",
  };
  return labels[weight] || weight;
};

if (inputFontWeight) {
  inputFontWeight.value = savedFontWeight;
  valueFontWeight.textContent = getFontWeightLabel(savedFontWeight);
  document.documentElement.style.setProperty(
    "--sticker-font-weight",
    savedFontWeight,
  );

  inputFontWeight.addEventListener("input", (e) => {
    const weight = e.target.value;
    valueFontWeight.textContent = getFontWeightLabel(weight);
    document.documentElement.style.setProperty("--sticker-font-weight", weight);
    localStorage.setItem("stickerFontWeight", weight);

    // Update masonry layout when font weight changes
    if (window.updateMasonryLayout) {
      window.updateMasonryLayout();
    }
  });
}

/*
// Sort Height Logic
if (inputSortHeight) {
  const isSortEnabled =
    savedSortHeight === null ? false : savedSortHeight === "true";
  inputSortHeight.checked = isSortEnabled;


  inputSortHeight.addEventListener("change", (e) => {
    const checked = e.target.checked;
    localStorage.setItem("stickerSortHeight", checked);

    if (window.renderStickers) {
      window.renderStickers();
    }
  });
}
*/

// Currency checkbox logic
if (inputShowCurrency) {
  const isCurrencyEnabled =
    savedShowCurrency === null ? true : savedShowCurrency === "true";

  inputShowCurrency.checked = isCurrencyEnabled;
  if (!isCurrencyEnabled) {
    document.documentElement.classList.add("hide-currency");
  }

  inputShowCurrency.addEventListener("change", (e) => {
    const checked = e.target.checked;
    localStorage.setItem("stickerShowCurrency", checked);
    if (checked) {
      document.documentElement.classList.remove("hide-currency");
    } else {
      document.documentElement.classList.add("hide-currency");
    }
    // Update masonry layout when currency visibility changes
    if (window.updateMasonryLayout) {
      window.updateMasonryLayout();
    }
  });
}

// Merchant checkbox logic
if (inputShowMerchant) {
  const isMerchantEnabled =
    savedShowMerchant === null ? true : savedShowMerchant === "true";

  inputShowMerchant.checked = isMerchantEnabled;
  if (!isMerchantEnabled) {
    document.documentElement.classList.add("hide-merchant");
  }

  inputShowMerchant.addEventListener("change", (e) => {
    const checked = e.target.checked;
    localStorage.setItem("stickerShowMerchant", checked);
    if (checked) {
      document.documentElement.classList.remove("hide-merchant");
    } else {
      document.documentElement.classList.add("hide-merchant");
    }
    // Update masonry layout when merchant visibility changes
    if (window.updateMasonryLayout) {
      window.updateMasonryLayout();
    }
  });
}
