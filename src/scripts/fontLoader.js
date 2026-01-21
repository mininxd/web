const selectFont = document.getElementById("selectFont");
const fontStyleInputs = document.querySelectorAll('input[name="fontStyle"]');
const inputFontWeight = document.getElementById("inputFontWeight");
const valueFontWeight = document.getElementById("valueFontWeight");

const defaultFonts = [{ name: "Poppins (Default)", value: "Poppins" }];

const savedFont = localStorage.getItem("stickerFont") || "Poppins";
const savedFontStyle = localStorage.getItem("stickerFontStyle") || "normal";

function extractFontName(filename) {
  const name = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\[.*?\]/g, "")
    .replace(/VariableFont/gi, "")
    .trim();

  return name
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function loadFontsFromDirectory() {
  try {
    const response = await fetch("/fonts/fonts.json");
    if (response.ok) {
      const fontList = await response.json();
      return fontList.map((font) => {
        const parsed = font.name || extractFontName(font.file);
        return { name: parsed, value: parsed, file: font.file };
      });
    }
  } catch (error) {
    console.log("[v0] fonts.json not found, using default fonts");
  }
  return [];
}

async function registerCustomFonts(fonts) {
  for (const font of fonts) {
    try {
      const fontFace = new FontFace(font.value, `url(/fonts/${font.file})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      console.log(`[v0] Font loaded: ${font.name}`);
    } catch (error) {
      console.error(`[v0] Failed to load font: ${font.name}`, error);
    }
  }
}

function populateFontSelect(customFonts) {
  if (!selectFont) return;

  selectFont.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.textContent = "Pilih Font";
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = !savedFont;
  selectFont.appendChild(placeholder);

  const allFonts = [...defaultFonts, ...customFonts];

  allFonts.forEach((font) => {
    const option = document.createElement("option");
    option.value = font.value;
    option.textContent = font.name;
    if (font.value === savedFont) option.selected = true;
    selectFont.appendChild(option);
  });
}

function setActiveFontStyle(style) {
  fontStyleInputs.forEach((input) => {
    if (input.value === style && input.getAttribute("aria-label") !== "Reset") {
      input.checked = true;
    }
  });
}

function applyFont(fontFamily, fontStyle) {
  const root = document.documentElement;

  root.style.setProperty(
    "--sticker-font-family",
    `"${fontFamily}", sans-serif`,
  );
  root.style.setProperty("--sticker-font-style", fontStyle);

  if (window.updateMasonryLayout) {
    window.updateMasonryLayout();
  }
}

function initFontWeightSlider() {
  if (!inputFontWeight || !valueFontWeight) return;

  const update = (val) => {
    const root = document.documentElement;
    root.style.setProperty("--sticker-font-weight", val);

    let name = "";
    switch (String(val)) {
      case "400":
        name = "Normal";
        break;
      case "500":
        name = "Medium";
        break;
      case "600":
        name = "Semi Bold";
        break;
      case "700":
        name = "Bold";
        break;
      case "800":
        name = "Extra Bold";
        break;
      case "900":
        name = "Black";
        break;
      default:
        name = String(val);
    }
    valueFontWeight.textContent = name;
  };

  update(inputFontWeight.value);

  inputFontWeight.addEventListener("input", (e) => {
    update(e.target.value);
  });
}

async function initFontLoader() {
  const customFonts = await loadFontsFromDirectory();

  if (customFonts.length > 0) {
    await registerCustomFonts(customFonts);
  }

  populateFontSelect(customFonts);
  setActiveFontStyle(savedFontStyle);
  applyFont(savedFont, savedFontStyle);
  initFontWeightSlider();

  if (selectFont) {
    selectFont.addEventListener("change", (e) => {
      const font = e.target.value;
      localStorage.setItem("stickerFont", font);
      const currentStyle = localStorage.getItem("stickerFontStyle") || "normal";
      applyFont(font, currentStyle);
    });
  }

  fontStyleInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const style = e.target.value;
      localStorage.setItem("stickerFontStyle", style);
      const currentFont = localStorage.getItem("stickerFont") || "Poppins";
      applyFont(currentFont, style);
    });
  });
}

export { initFontLoader, applyFont };

initFontLoader();
