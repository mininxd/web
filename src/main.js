import {proxyTable} from "./proxy.js";
import "./download.js";

let count = Math.round(Number(localStorage.getItem("count"))) || 25;
let type = localStorage.getItem("type") || "all";
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
    navigator.clipboard.writeText(
  el.textContent.replace(/\s+/g, "")
);
  })
})
}

proxyTable(count, type);