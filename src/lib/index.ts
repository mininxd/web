import "./gsap.ts"
import "./socket.ts"


export function copyText(e) {
  e.addEventListener("click", () => {
    navigator.clipboard.writeText(e.textContent);
  });
}