import { initMasonry, destroyMasonry } from "./masonry.js";

const inputFontSize = document.getElementById("inputFontSize");
const valueFontSize = document.getElementById("valueFontSize");
const inputShowCurrency = document.getElementById("inputShowCurrency");
const inputShowMerchant = document.getElementById("inputShowMerchant");
const inputCustomMerchant = document.getElementById("inputCustomMerchant");
const btnSaveMerchant = document.getElementById("btnSaveMerchant");
const inputUseMasonry = document.getElementById("inputUseMasonry");

// Load from localStorage or use default
const savedFontSize = localStorage.getItem("stickerFontSize") || 16;
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

// Set initial value
if (inputFontSize) {
  inputFontSize.value = savedFontSize;
  valueFontSize.textContent = `${savedFontSize}px`;
  document.documentElement.style.setProperty(
    "--sticker-font-size",
    `${savedFontSize}px`,
  );

  inputFontSize.addEventListener("input", (e) => {
    const size = e.target.value;
    valueFontSize.textContent = `${size}px`;
    document.documentElement.style.setProperty(
      "--sticker-font-size",
      `${size}px`,
    );
    localStorage.setItem("stickerFontSize", size);

    // Update masonry layout when font size changes
    if (window.updateMasonryLayout) {
      window.updateMasonryLayout();
    }
  });
}

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
