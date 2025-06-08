advancedToggle.addEventListener('change', () => {
  advancedLabel.classList.toggle("hidden");

  if (advancedToggle.checked) {
    advancedInput.classList.toggle("hidden");
  } else {
    advancedInput.classList.add("hidden");
  }
});
