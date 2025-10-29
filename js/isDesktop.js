if(!navigator.userAgent.includes("Mobile")) {
  body.style.paddingTop = "5vh"
  gridCanvas.classList.remove("has-3-cols");
  gridCanvas.classList.add("has-5-cols");
  listQrisCanvas.style.padding = "1em 8vw 1em 8vw";
  navbar.style.paddingLeft = "2%"
  const buttons = document.querySelectorAll('#canvasBtn .button');
  buttons.forEach(button => {
    button.style.width = "50%"
  });
  document.querySelectorAll('.modal-content').forEach(div => {
   div.style.width = "40%"
});
loginFirst.style.marginLeft = "25%"
loginWrapper.style.width = "50vw"

// Add desktop-specific styles
document.querySelectorAll('.item').forEach(item => {
  item.style.width = "100px";
  item.style.gap = "2px";
});
document.querySelectorAll('.qrisCanvas canvas').forEach(canvas => {
  canvas.style.width = "90px";
  canvas.style.height = "90px";
});
} else {
  downloadAll.classList.add("is-fullwidth")
  hapusItem.classList.add("is-fullwidth")
}
