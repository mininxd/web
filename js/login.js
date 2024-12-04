import QrcodeDecoder from 'qrcode-decoder';
import {qris} from '/lib/qris';

const qr = new QrcodeDecoder();

if(localStorage.getItem("QRIS_Utama")) {
  loginFirst.style.display = "none";
  content.style.display = "block";
} else {
  loginFirst.style.display = "block";
  content.style.display = "none";
  
    submitLogin.addEventListener("click", () => {
      try {
        submitLogin.classList.add("is-loading");
        qris(inputLogin.value, 0).then(data => {
          if(data.merchant === undefined) {
            submitLoginMsg.innerHTML = "Login Gagal, Periksa kode QRIS"
            submitLogin.classList.remove("is-loading");
          } else {
            localStorage.setItem("QRIS_Utama", inputLogin.value);
            setTimeout(() => {
              window.location.reload();
            },1000)
          }
        })
      } catch(e) {
        console.log(e)
      }
    })
  }



fileInput.addEventListener("input", (e) => {
  const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        qr.decodeFromImage(dataURL).then((decoded) => {
        if(decoded == null) {
         fileInputMsg.innerHTML = "QR Tidak Valid"
        } else {
        inputLogin.value = decoded.data;
        }
        });
      };
      reader.readAsDataURL(file);
    }
})