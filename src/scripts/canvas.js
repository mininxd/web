import QRCode from "qrcode";
import { initMasonry } from "./masonry.js";

function renderEmptyState() {
  downloadAll.style.display = "none";
  hapusItem.style.display = "none";
  listQrisCanvas.innerHTML = `
    <div class="item">
      <div class="qrisCanvas">
        <span class="namaBarang">Masih Kosong</span>
        <canvas id="dummyQR"></canvas><br>
        <span class="hargaBarang">---</span>
        <p class="namaToko">merchant</p>
      </div>
    </div>`;
  QRCode.toCanvas(dummyQR, "mininxd", { width: 1080 });
}

function createStickerCard(stickerData, index) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item", "pointer");

  const qrisCanvasDiv = document.createElement("div");
  qrisCanvasDiv.classList.add("qrisCanvas");

  const namaBarangSpan = document.createElement("span");
  namaBarangSpan.classList.add("namaBarang");
  namaBarangSpan.textContent = stickerData.nama;

  const canvasElement = document.createElement("canvas");
  canvasElement.id = `s${index}`;

  const hargaBarangSpan = document.createElement("span");
  hargaBarangSpan.classList.add("hargaBarang");

  const currencySymbol = document.createElement("span");
  currencySymbol.classList.add("currency-symbol");
  currencySymbol.textContent = "Rp";

  hargaBarangSpan.appendChild(currencySymbol);
  hargaBarangSpan.appendChild(
    document.createTextNode(Number(stickerData.harga).toLocaleString("id-ID")),
  );

  const namaTokoP = document.createElement("p");
  namaTokoP.classList.add("namaToko");
  namaTokoP.textContent = stickerData.merchant;

  // Check if merchant should be shown based on saved setting
  const savedShowMerchant = localStorage.getItem("stickerShowMerchant");
  const isMerchantEnabled =
    savedShowMerchant === null ? true : savedShowMerchant === "true";

  if (!isMerchantEnabled) {
    namaTokoP.style.display = "none";
  }

  qrisCanvasDiv.appendChild(namaBarangSpan);
  qrisCanvasDiv.appendChild(canvasElement);
  qrisCanvasDiv.appendChild(hargaBarangSpan);
  qrisCanvasDiv.appendChild(namaTokoP);
  itemDiv.appendChild(qrisCanvasDiv);

  setTimeout(() => {
    QRCode.toCanvas(document.getElementById(`s${index}`), stickerData.QR, {
      width: 1080,
    });
  }, 0);

  itemDiv.addEventListener("click", () => {
    try {
      window.htmlToImage
        .toPng(itemDiv, {
          pixelRatio: 3,
        })
        .then(function (blob) {
          if (window.saveAs) {
            window.saveAs(blob, `${stickerData.nama}.png`);
          } else {
            window.FileSaver.saveAs(blob, `${stickerData.nama}.png`);
          }
        });
    } catch (e) {
      alert(e);
    }
  });

  return itemDiv;
}

function renderStickers() {
  const stickerStorage = localStorage.getItem("stickerStorage");

  if (!JSON.parse(stickerStorage) || stickerStorage === "{}") {
    renderEmptyState();
    return;
  }

  const stickerData = JSON.parse(stickerStorage);
  const stickerKeys = Object.keys(stickerData);
  console.log(stickerData);

  listQrisCanvas.innerHTML = "";

  stickerKeys.forEach((key, index) => {
    if (stickerData[key]) {
      const itemDiv = createStickerCard(stickerData[key], key);
      listQrisCanvas.appendChild(itemDiv);
    }
  });

  // Initialize masonry once after all items are added
  // The initMasonry function already handles the initial layout
  initMasonry("#listQrisCanvas");
}

renderStickers();
