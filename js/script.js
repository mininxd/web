import QRCode from "qrcode";
// import QrCode from "qrcode-reader";
// const qr = new QrCode();
import {qris} from "/lib/qris.js";
import "/lib/modal.js";
import "./login.js";
import "./localStorage.js";
import "./canvas.js";
import "./isDesktop.js";


// Get Header
downloadAll.disabled = true;
downloadAll.classList.add("is-loading");

qris(localStorage.getItem("QRIS_Utama"), 0)
.then(data => {
downloadAll.disabled = false;
downloadAll.classList.remove("is-loading");

dataQris.innerHTML = data.QR;
QRCode.toCanvas(merchantQRIScanvas, data.QR);
namaMerchant.innerHTML = data.merchant;
namaMerchant.classList.remove("is-skeleton");

downloadAll.addEventListener("click", () => {
  downloadAll.classList.add("is-loading");
  try {
      htmlToImage.toPng(listQrisCanvas).then(function (blob) {
        if (window.saveAs) {
          window.saveAs(blob, `${data.merchant}.png`);
        } else {
          FileSaver.saveAs(blob, `${data.merchant}.png`);
        }
      });
    setTimeout(() => {
  downloadAll.classList.remove("is-loading");
    },500)
    } catch (e) {
      alert(e);
    }
})
})


submitGantiQris.addEventListener("click", () => {
  submitGantiQris.classList.add("is-loading")
  setTimeout(() => {
  localStorage.setItem("QRIS_Utama", inputGantiQris.value);
  localStorage.removeItem("stickerStorage");
  submitGantiQris.classList.remove("is-loading")
  window.location.reload();
}, 500)
})
