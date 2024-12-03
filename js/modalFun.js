submitGantiQris.addEventListener("click", () => {
 localStorage.setItem("QRIS_Utama", inputGantiQris.value);
  submitGantiQris.classList.add("is-loading");
  setTimeout(() => {
    window.location.reload();
    },1000)
})

submitTambahItem.addEventListener("click", () => {
    submitTambahItem.classList.add("is-loading")
  setTimeout(() => {
    submitTambahItem.classList.remove("is-loading")
    },1000)
})
  