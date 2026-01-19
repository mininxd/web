const inputFontSize = document.getElementById("inputFontSize");
const valueFontSize = document.getElementById("valueFontSize");
const inputShowCurrency = document.getElementById("inputShowCurrency");

// Load from localStorage or use default
const savedFontSize = localStorage.getItem("stickerFontSize") || 16;
const savedShowCurrency = localStorage.getItem("stickerShowCurrency");

// Set initial value
if (inputFontSize) {
  inputFontSize.value = savedFontSize;
  valueFontSize.textContent = `${savedFontSize}px`;
  document.documentElement.style.setProperty("--sticker-font-size", `${savedFontSize}px`);

  // Listen for changes
  inputFontSize.addEventListener("input", (e) => {
    const size = e.target.value;
    valueFontSize.textContent = `${size}px`;
    document.documentElement.style.setProperty("--sticker-font-size", `${size}px`);
    localStorage.setItem("stickerFontSize", size);
  });
}

// Currency checkbox logic
if (inputShowCurrency) {
  // Default is true, so if null, treat as true
  const isCurrencyEnabled = savedShowCurrency === null ? true : savedShowCurrency === "true";

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
  });
}
