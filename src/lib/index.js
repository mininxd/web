import "./gsap.js"
import "./api.js"


export function copyText(e) {
  e.addEventListener("click", () => {
    navigator.clipboard.writeText(e.textContent);
  });
}

export { getDnsStats, getClientDnsInfo } from './api';