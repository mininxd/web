import QrcodeDecoder from "qrcode-decoder";
import qrcodeParser from "qrcode-parser";
import { qris } from "../lib/qris.js";

const qr = new QrcodeDecoder();

if (localStorage.getItem("QRIS_Utama")) {
  loginFirst.style.display = "none";
  content.style.display = "block";
} else {
  loginFirst.style.display = "block";
  content.style.display = "none";

  submitLogin.addEventListener("click", async () => {
    submitLogin.classList.add("btn-disabled");
    const qrisData = await qris(inputLogin.value, 0);
    console.log(qrisData);
    if (!qrisData) {
      submitLoginMsg.innerHTML = "Login Gagal, Periksa kode QRIS";
      submitLogin.classList.remove("btn-disabled");
    } else {
      localStorage.setItem("QRIS_Utama", inputLogin.value);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
}

fileInput.addEventListener("input", (e) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;

      qrcodeParser(dataURL)
        .then((decoded) => {
          //  console.log(decoded)
          fileInputMsg.innerHTML = "QR Berhasil Di scan";
          inputLogin.value = decoded;
        })
        .catch((err) => {
          fileInputMsg.innerHTML = "QR Tidak Valid";
          fileInput.value = "";
          console.log(err);
        });
    };
    reader.readAsDataURL(file);
  }
});
