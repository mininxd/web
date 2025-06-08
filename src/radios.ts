const radios = document.querySelectorAll('.filter input[name="filter"]');
const label = document.getElementById('filterLabel');

radios.forEach(radio => {
radio.addEventListener('change', () => {
const selected = document.querySelector('.filter input[name="filter"]:checked');
if (!selected) return;

const mode = selected.getAttribute('aria-label') || "";
if (mode === "easy") {
  label.textContent = "Easy contains number filters";
} else if (mode === "medium") {
  label.textContent = "Medium contains symbol and number filters";
} else if (mode === "hard") {
  label.textContent = "Hard contains accented, symbol, and number filters"
} else {
  label.textContent = "";
}
});
});