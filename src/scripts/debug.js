const isDebug = import.meta.env.VITE_DEBUG === "true";
const debugElement = document.getElementById("debug_element");
const setDebugData = document.getElementById("setDebugData");
const inputDebugData = document.getElementById("inputDebugData");
const copyDebugData = document.getElementById("copyDebugData");
const resetDebugData = document.getElementById("resetDebugData");

if (isDebug && localStorage.getItem("QRIS_Utama") && debugElement) {
  debugElement.classList.remove("hidden");
}

if (setDebugData && inputDebugData) {
  setDebugData.addEventListener("click", () => {
    localStorage.setItem("stickerStorage", inputDebugData.value);
    window.location.reload();
  });
}

if (copyDebugData) {
  copyDebugData.addEventListener("click", () => {
    navigator.clipboard.writeText(localStorage.getItem("stickerStorage"));
  });
}

if (resetDebugData) {
  resetDebugData.addEventListener("click", () => {
    localStorage.removeItem("stickerStorage");
    localStorage.removeItem("QRIS_Utama");
  });
}
