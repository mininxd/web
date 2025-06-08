import './style.css';
import "remixicon/fonts/remixicon.css";

import "./radios.ts";
import "./toggle.ts";
import { easy, medium, hard } from "./lib/filters.ts";
import { variant, repeat } from "./lib/generator.ts";

const filterMap: Record<string, Record<string, string>> = {
  easy,
  medium,
  hard,
};

function copy(text) {
  navigator.clipboard.writeText(text);
}
result.addEventListener("click", () => {
  if (result.textContent.trim().length <= 1) return;
  copy(result.textContent)
})





generate.addEventListener("click", () => {
  if (!filterInput.value.trim()) return;
  const selected = document.querySelector('.filter input[name="filter"]:checked');
  const mode = selected.getAttribute('aria-label');
  if (!selected || !mode) {
    filterLabel.innerHTML = `
  <span class="text-red-400">Filters must be selected</span>`;
  return;
  }

const filterText = filterInput.value;
let modifiedFilterText = filterText.replace(/\(/g, "{(").replace(/\)/g, ")}");

result.classList.remove("hidden");
resultLabel.classList.remove("hidden");

if(advancedToggle.checked) {
let repeatFilterText = repeat(modifiedFilterText, advancedInputNum.value || 1)
result.textContent = variant(modifiedFilterText, filterMap[mode]).join(", ");
} else {
result.textContent = variant(filterText, filterMap[mode]).join(", ");
}
});






if(!navigator.userAgent.includes("Mobile")) {
  body.classList.replace("p-3", "p-5");
  body.classList.add("px-[25%]")
}