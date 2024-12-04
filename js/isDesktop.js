if(!navigator.userAgent.includes("Mobile")) {
  gridCanvas.classList.remove("has-3-cols");
  gridCanvas.classList.add("has-5-cols");
  listQrisCanvas.style.padding = "1em 8vw 1em 8vw";
  const buttons = document.querySelectorAll('#canvasBtn .button');
  buttons.forEach(button => {
    button.style.width = "75%"
  });

}
