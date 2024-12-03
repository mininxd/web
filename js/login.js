if(localStorage.getItem("QRIS_Utama")) {
  loginFirst.style.display = "none";
} else {
  loginFirst.style.display = "block";
  content.style.display = "none";
submitLogin.addEventListener("click", () => {
  localStorage.setItem("QRIS_Utama", inputLogin.value);
  submitLogin.classList.add("is-loading");
  setTimeout(() => {
    window.location.reload();
    },1000)
})
}