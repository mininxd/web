export function copyText(e) {
  e.addEventListener("click", () => {
    navigator.clipboard.writeText(e.textContent);
  });
}