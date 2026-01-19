const inputFontSize = document.getElementById("inputFontSize");
const valueFontSize = document.getElementById("valueFontSize");

// Load from localStorage or use default
const savedFontSize = localStorage.getItem("stickerFontSize") || 16;

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
