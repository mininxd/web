import axios from "axios";
import "./js/feature.js";
import "./js/gsap.js";
import "./js/utils.js";
import { checkLogs } from "./js/utils.js";
import {brat} from "./js/brat.js";
// reset filename each enter websites
if(localStorage.getItem("filename")) {
  localStorage.removeItem("filename");
}



generateBtn.addEventListener('click', () => {
    if(!inputText.value) {
      msg.innerHTML = "Masukan teks dulu";
      msgBar.classList.remove("hidden")
    } else {
      downBtn.classList.add("hidden")
      msgBar.classList.add("hidden")
      imgWrapper.style.background = "transparent";
      bratImg.style.opacity = 1;
      generateBtn.disabled = false ? false : true;
      bratImg.src = "./assets/Program_wait.ico";
    
    brat(inputText.value).then(data => {
     generateBtn.disabled = false;
     console.log(data)
        if(!data) {
         bratImg.style.opacity = 0;
         msgBar.classList.remove("hidden")
         msg.innerHTML = "<strong style='color:red'>Error, kesalahan server atau koneksi error</strong>"
         generateBtn.disabled = false;
        } else if(data.message) {
         bratImg.style.opacity = 0;
         logs.value = JSON.stringify(data, null, 2);
         checkLogs();
        } else {
         localStorage.setItem("filename", data.path);
          bratImg.src = data;
          bratImg.addEventListener('load', () => {
            if(bratImg.src.includes("https://")) {
              downBtn.classList.remove("hidden")
              imgWrapper.style.background = "#fff";
              msg.innerHTML = `<marquee>Cara simpan gambar cukup di hold lalu <strong>Simpan Gambar</strong>, &nbsp; untuk desktop klik kanan lalu <strong>Save As</strong>, &nbsp; atau pencet tombol <strong>Download</strong></marquee>`
              }
          })
        }
      }).catch(e => {
        logs.value = JSON.stringify(e, null, 2);
        checkLogs();
        bratImg.style.opacity = 0;
      }).finally(() => {
        bratImg.addEventListener('load', () => {
         if(bratImg.src.includes("https://")) {
           msgBar.classList.remove("hidden")
           generateBtn.disabled = false;
         }
        })
      })
  }
})



closeErrLogs.addEventListener('click', () => {
  errLogs.classList.add("hidden");
})
