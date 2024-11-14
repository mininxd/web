import "./js/feature.js";
import "./js/gsap.js"
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
      fetch(`https://api-mininxd.vercel.app/brat?txt=${inputText.value}`)
        .then(res => {
         return res.json() 
      }).then(data => {
     //   console.log(data)
        if(!data.url) {
         bratImg.style.opacity = 0;
         msgBar.classList.remove("hidden")
         msg.innerHTML = "<strong style='color:red'>Error, kesalahan server atau koneksi error</strong>"
         generateBtn.disabled = false;
        } else {
         localStorage.setItem("filename", data.path);
         bratImg.src = data.url;
          bratImg.addEventListener('load', () => {
            if(bratImg.src.includes("https://")) {
              downBtn.classList.remove("hidden")
              imgWrapper.style.background = "#fff";
              msg.innerHTML = `<marquee>Cara simpan gambar cukup di hold lalu <strong>Simpan Gambar</strong>, &nbsp; untuk desktop klik kanan lalu <strong>Save As</strong>, &nbsp; atau pencet tombol <strong>Download</strong></marquee>`
              }
          })
        }
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
