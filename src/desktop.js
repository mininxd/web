if(!navigator.userAgent.includes("Mobile")) {
document.querySelectorAll('.fieldset').forEach(el => {
  el.classList.add("col-span", "p-4");
  el.classList.replace("w-xs", "w-full");

})


document.querySelectorAll('.content').forEach(el => {
  el.classList.add("px-10", "grid", "gap-5", "grid-cols-2", "grid-rows");
})
}