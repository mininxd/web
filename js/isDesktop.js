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
}
