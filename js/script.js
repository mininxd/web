import QRCode from "qrcode";
import {qris} from "/lib/qris.js";
import "/lib/modal.js";
import "./login.js";
import "./localStorage.js";
import "./canvas.js";
import "./isDesktop.js";


// Get Header
downloadAll.disabled = true;
downloadAll.classList.add("is-loading");

if(localStorage.getItem("QRIS_Utama")) {
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
    },1500)
    } catch (e) {
      alert(e);
    }
})
})
}

submitLogout.addEventListener('click', () => {
  try {
  localStorage.removeItem("QRIS_Utama");
//  localStorage.removeItem("stickerStorage");
  window.location.reload();
  } catch(e) {
  }
})
submitLogoutHapus.addEventListener('click', () => {
  try {
  localStorage.removeItem("QRIS_Utama");
  localStorage.removeItem("stickerStorage");
  window.location.reload();
  } catch(e) {
  }
})

submitGantiQris.addEventListener("click", () => {
  submitGantiQris.classList.add("is-loading")
  if(inputGantiQris.value.length < 1) {
  gantiQrisMsg.innerHTML = "Field masih kosong"
  submitGantiQris.classList.remove("is-loading")
  gantiQrisMsg.classList.remove("is-danger")
  } else {
  setTimeout(() => {
  localStorage.setItem("QRIS_Utama", inputGantiQris.value);
//  localStorage.removeItem("stickerStorage");
  submitGantiQris.classList.remove("is-loading")
  window.location.reload();
}, 500)
}
})


source.addEventListener("click", () => {
  window.open("https://github.com/mininxd/web/tree/qris", "_blank")
})
donate.addEventListener("click", () => {
  window.open("https://saweria.co/mininxd", "_blank")
})
