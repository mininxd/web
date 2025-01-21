if(!navigator.userAgent.includes("Mobile")) {
  body.style.padding = "0 12em 0 12em"
}

sendBtn.addEventListener('click', () => {
  location.href = `https://wa.me/6283898772118/?text=${inputMsg.value}`
})

const referrer = document.referrer;
if (referrer) {
  referMsg.innerHTML = referrer;
} else {
}
