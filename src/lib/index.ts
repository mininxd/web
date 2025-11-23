import "./gsap.ts"
import "./api.ts"


export function copyText(e) {
  e.addEventListener("click", () => {
    navigator.clipboard.writeText(e.textContent);
  });
}

export { getDnsStats, getClientDnsInfo } from './api';