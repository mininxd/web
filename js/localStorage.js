import {qris} from "/lib/qris.js";


function addSticker(nama, QR, harga, merchant) {
  const obj = JSON.parse(localStorage.getItem("stickerStorage")) || {};
  const itemKey = Object.keys(obj).length || 0;
  obj[itemKey] = { nama, QR, harga, merchant };
  localStorage.setItem("stickerStorage", JSON.stringify(obj));
}
function deleteSticker(item) {
  const obj = JSON.parse(localStorage.getItem("stickerStorage")) || {};
  for (const key in obj) {
    if (obj[key].name === item) {
      delete obj[key];
      break;
    }
  }
  localStorage.setItem("stickerStorage", JSON.stringify(obj));
}
function generateQris(nama, harga, merchant) {
  qris(localStorage.getItem("QRIS_Utama"), harga)
.then(data => {
  addSticker(nama, data.QR, harga, merchant);
}).catch(e => {alert(e)})
}


submitTambahItem.addEventListener("click", (e) => {
  e.preventDefault();
  submitTambahItem.classList.add("is-loading")

if(inputHargaItem.value.length < 1 || inputNamaItem.value.length < 1) {
  setTimeout(() => {
    submitTambahItem.classList.remove("is-loading")
    buatStikerMsg.innerHTML = "input field masih kosong"
    },500)
} else {
  try {
  generateQris(inputNamaItem.value, inputHargaItem.value, namaMerchant.textContent)
  setTimeout(() => {
    window.location.reload();
    submitTambahItem.classList.remove("is-loading")
    },1300)
  } catch(e) {
    console.log(e)
  }
}
})
  
