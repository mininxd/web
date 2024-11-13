let body = document.getElementById('bodyEl')
let windows = document.getElementById('windowEl')
  
if(!navigator.userAgent.includes("Mobile")) {
    body.classList.add("desktop")
}

maximize.addEventListener("click", () => {
  if(!navigator.userAgent.includes("Mobile")) {
    windows.classList.toggle("full-w-h-desktop");
} else {
    body.classList.toggle("no-padding");
    windows.classList.toggle("no-padding")
    windows.classList.toggle("full-w-h");
    footer.classList.toggle("hidden");
}
})