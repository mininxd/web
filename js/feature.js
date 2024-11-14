let body = document.getElementById('bodyEl')
let windows = document.getElementById('windowEl')
let img = document.getElementById('bratImg')
let imgWrapper = document.getElementById('imgWrapper')
  
if(!navigator.userAgent.includes("Mobile")) {
    body.classList.add("desktop")
    img.classList.add("desktop")
    imgWrapper.classList.add("desktop")
}

maximize.addEventListener("click", () => {
  if(!navigator.userAgent.includes("Mobile")) {
    windows.classList.toggle("full-w-h-desktop");
} else {
    body.classList.toggle("no-padding");
    windows.classList.toggle("no-padding")
    windows.classList.toggle("full-w-h");
    footer.classList.toggle("hidden");
    maximize.ariaLabel = maximize.ariaLabel === "Maximize" ? "Restore" : "Maximize"
}
})


// disable resize when in desktop
if(navigator.userAgent.includes("Mobile")) {
inputText.addEventListener('focus', () => {
  bratImg.style.width = "10%"
})
inputText.addEventListener('blur', () => {
  bratImg.style.width = "inherit"
})
img.classList.add("desktop")
}


if(localStorage.getItem("changelogs") == "closed") {
  changelogs.classList.add("hidden")
}

closeChangelog.addEventListener('click', () => {
  changelogs.classList.add("hidden")
  localStorage.setItem("changelogs", "closed")
})