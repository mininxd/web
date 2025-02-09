import {proxyTable} from "./proxy.js";

let count = Math.round(Number(localStorage.getItem("count"))) || 10;
let type = localStorage.getItem("type") || "http";
let countInput = document.getElementById("countInput");
countInput.value = count;

selectProtocol.addEventListener("change", function () {
  localStorage.setItem("type", this.value);
  window.location.reload();
});

countInput.addEventListener("blur", function() {
  localStorage.setItem("count", this.value);
  window.location.reload();
})

export function copyText(id) { 
document.querySelectorAll(id).forEach((el) => {
  el.addEventListener('click', () => {
    navigator.clipboard.writeText(el.textContent)
  })
})
}

proxyTable(count, type);