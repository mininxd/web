import QRCode from "qrcode";

if(!JSON.parse(localStorage.getItem("stickerStorage"))) {
  downloadAll.style.display = "none";
listQrisCanvas.innerHTML = `
<div class="item">
      <div class="qrisCanvas">
        <span class="namaBarang">Masih Kosong</span>
        <canvas id="dummyQR"></canvas><br>
        <span class="hargaBarang">---</span>
      </div>
    </div>`
    QRCode.toCanvas(dummyQR, "mininxd");
}  else {
  let stickerData = JSON.parse(localStorage.getItem("stickerStorage"));
  let stickerLength = JSON.stringify(Object.keys(stickerData).length);

for (let i = 0; i < Number(stickerLength); i++) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item","pointer");

  const qrisCanvasDiv = document.createElement("div");
  qrisCanvasDiv.classList.add("qrisCanvas");

  const namaBarangSpan = document.createElement("span");
  namaBarangSpan.classList.add("namaBarang");
  namaBarangSpan.textContent = stickerData[i].nama;

  const canvasElement = document.createElement("canvas");
  canvasElement.id = `s${i}`;

  const hargaBarangSpan = document.createElement("span");
  hargaBarangSpan.classList.add("hargaBarang");
  hargaBarangSpan.textContent = `Rp.${stickerData[i].harga}`;

  qrisCanvasDiv.appendChild(namaBarangSpan);
  qrisCanvasDiv.appendChild(canvasElement);
  qrisCanvasDiv.appendChild(hargaBarangSpan);
  itemDiv.appendChild(qrisCanvasDiv);

  listQrisCanvas.appendChild(itemDiv);

  setTimeout(() => {
    QRCode.toCanvas(document.getElementById(`s${i}`), stickerData[i].QR);
  }, 0);

  itemDiv.addEventListener("click", () => {
    try {
      htmlToImage.toPng(itemDiv).then(function (blob) {
        if (window.saveAs) {
          window.saveAs(blob, `${stickerData[i].nama}.png`);
        } else {
          FileSaver.saveAs(blob, `${stickerData[i].nama}.png`);
        }
      });
    } catch (e) {
      alert(e);
    }
  });
}
}


