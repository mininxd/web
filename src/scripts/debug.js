const isDebug = import.meta.env.VITE_DEBUG === "true";

if(isDebug && localStorage.getItem("QRIS_Utama")) {
  debug_element.classList.remove("hidden")
}

setDebugData.addEventListener("click", () => {
  localStorage.setItem("stickerStorage", inputDebugData.value)
  window.location.reload()
})
copyDebugData.addEventListener("click", () => {
  navigator.clipboard.writeText(localStorage.getItem("stickerStorage"))
})

resetDebugData.addEventListener("click", () => {
  localStorage.removeItem("stickerStorage");
  localStorage.removeItem("QRIS_Utama");
  
})
