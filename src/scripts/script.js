import QRCode from "qrcode";
import { qris } from "../lib/qris.js";
import "../lib/modal.js";
import "./login.js";
import "./localStorage.js";
import "./canvas.js";
import "./isDesktop.js";
import "./deleteList.js";
import "./settings.js";
import "./debug.js";
import "./fontLoader.js";
import "remixicon/fonts/remixicon.css";

import "../styles/navbar.css";
import "../styles/canvas.css";
import "../styles/fonts.css";
import "../styles/settings.css";
import "../styles/theme.css";

// Define global variables for elements used in imported modules
const submitTambahItem = document.getElementById("submitTambahItem");
const inputNamaItem = document.getElementById("inputNamaItem");
const inputHargaItem = document.getElementById("inputHargaItem");
const namaMerchant = document.getElementById("namaMerchant");
const buatStikerMsg = document.getElementById("buatStikerMsg");
const submitLogout = document.getElementById("submitLogout");
const submitLogoutHapus = document.getElementById("submitLogoutHapus");
const submitLogoutCancel = document.getElementById("submitLogoutCancel");
const submitGantiQris = document.getElementById("submitGantiQris");
const inputGantiQris = document.getElementById("inputGantiQris");
const gantiQrisMsg = document.getElementById("gantiQrisMsg");
const uploadGantiQris = document.getElementById("uploadGantiQris");
const uploadGantiQrisMsg = document.getElementById("uploadGantiQrisMsg");
const downloadAll = document.getElementById("downloadAll");
const source = document.getElementById("source");
const donate = document.getElementById("donate");
const listQrisCanvas = document.getElementById("listQrisCanvas");

// Get Header
downloadAll.disabled = true;
downloadAll.classList.add("is-loading");

if (localStorage.getItem("QRIS_Utama")) {
  qris(localStorage.getItem("QRIS_Utama"), 0).then((data) => {
    downloadAll.disabled = false;
    downloadAll.classList.remove("is-loading");

    const savedMerchantName = localStorage.getItem("stickerMerchantName");
    namaMerchant.innerHTML = savedMerchantName || data.merchant;
    namaMerchant.classList.remove("skeleton");

    // Check if merchant should be hidden based on saved setting
    const savedShowMerchant = localStorage.getItem("stickerShowMerchant");
    const isMerchantEnabled =
      savedShowMerchant === null ? true : savedShowMerchant === "true";

    if (!isMerchantEnabled) {
      document.documentElement.classList.add("hide-merchant");
    }

    downloadAll.addEventListener("click", () => {
      downloadAll.classList.add("is-loading");
      try {
        htmlToImage
          .toPng(listQrisCanvas, {
            pixelRatio: 3,
          })
          .then(function (blob) {
            if (window.saveAs) {
              window.saveAs(blob, `${data.merchant}.png`);
            } else {
              FileSaver.saveAs(blob, `${data.merchant}.png`);
            }
          });
        setTimeout(() => {
          downloadAll.classList.remove("is-loading");
        }, 1500);
      } catch (e) {
        alert(e);
      }
    });
  });
}

submitLogout.addEventListener("click", () => {
  try {
    localStorage.removeItem("QRIS_Utama");
    //  localStorage.removeItem("stickerStorage");
    window.location.reload();
  } catch (e) {}
});
submitLogoutHapus.addEventListener("click", () => {
  try {
    localStorage.removeItem("QRIS_Utama");
    localStorage.removeItem("stickerStorage");
    localStorage.removeItem("stickerMerchantName");
    window.location.reload();
  } catch (e) {}
});

submitLogoutCancel.addEventListener("click", () => {
  // Close the logout modal by removing the 'is-active' class
  const logoutModal = document.getElementById("modalLogout");
  logoutModal.classList.remove("modal-open");
});

submitGantiQris.addEventListener("click", () => {
  submitGantiQris.classList.add("is-loading");
  if (inputGantiQris.value.length < 1) {
    gantiQrisMsg.innerHTML = "Field masih kosong";
    submitGantiQris.classList.remove("is-loading");
    gantiQrisMsg.classList.remove("text-error");
  } else {
    setTimeout(() => {
      localStorage.setItem("QRIS_Utama", inputGantiQris.value);
      //  localStorage.removeItem("stickerStorage");
      submitGantiQris.classList.remove("is-loading");
      window.location.reload();
    }, 500);
  }
});

uploadGantiQris.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        inputGantiQris.value = code.data;
        uploadGantiQrisMsg.innerHTML = "QRIS berhasil di-scan";
      } else {
        uploadGantiQrisMsg.innerHTML = "Tidak dapat menemukan kode QR";
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

/*
source.addEventListener("click", () => {
  window.open("https://github.com/mininxd/web/tree/qris", "_blank");
});
donate.addEventListener("click", () => {
  window.open("https://saweria.co/mininxd", "_blank");
});

*/
