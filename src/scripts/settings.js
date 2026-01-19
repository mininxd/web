const inputFontSize = document.getElementById("inputFontSize");
const valueFontSize = document.getElementById("valueFontSize");
const inputShowCurrency = document.getElementById("inputShowCurrency");
const inputShowMerchant = document.getElementById("inputShowMerchant");

// Load from localStorage or use default
const savedFontSize = localStorage.getItem("stickerFontSize") || 16;
const savedShowCurrency = localStorage.getItem("stickerShowCurrency");
const savedShowMerchant = localStorage.getItem("stickerShowMerchant");

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