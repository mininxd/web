import "./gsap.js"
import "./api.js"
import "./translate.js"

export function copyText(e) {
  e.addEventListener("click", () => {
    navigator.clipboard.writeText(e.textContent);
  });
}

export { getDnsStats, getClientDnsInfo } from './api';