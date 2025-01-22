import "./referrer.js";
if(!navigator.userAgent.includes("Mobile")) {
  body.style.padding = "0 12em 0 12em"
}

sendBtn.addEventListener('click', (e) => {
  e.preventDefault(); 
  location.href = `https://wa.me/6283898772118/?text=${inputMsg.value}`
})

