// reset filename each enter websites
if(localStorage.getItem("filename")) {
  localStorage.removeItem("filename");
}



generateBtn.addEventListener('click', () => {
    if(!inputText.value) {
      msg.innerHTML = "Masukan teks dulu";
      msgBar.style.display = "block";
    } else {
      bratImg.style.opacity = 1;
      generateBtn.setAttribute('disabled', true);
      bratImg.src = "./assets/Program_wait.ico";
      fetch(`https://api.mininxd.my.id/brat?txt=${inputText.value}`)
        .then(res => {
         return res.json() 
      }).then(data => {
        if(!data.url) {
         bratImg.style.opacity = 0;
         msgBar.style.display = "block";
         msg.innerHTML = "<strong style='color:red'>Error, kesalahan server atau koneksi error</strong>"
         generateBtn.removeAttribute('disabled');
        } else {
         localStorage.setItem("filename", data.path);
         bratImg.src = data.url;
          bratImg.addEventListener('load', () => {
            downBtn.style.display = "block";
            imgWrapper.style.background = "#fff";
            msg.innerHTML = `<marquee>Cara simpan gambar cukup di hold lalu <strong>Simpan Gambar</strong>, &nbsp; untuk desktop klik kanan lalu <strong>Save As</strong>, &nbsp; atau pencet tombol <strong>Download</strong></marquee>`
          })
        }
      }).finally(() => {
        bratImg.addEventListener('load', () => {
           msgBar.style.display = "block";
           generateBtn.removeAttribute('disabled')
        })
      })
  }
})

inputText.addEventListener('focus', () => {
  bratImg.style.height = "8vh"
})
inputText.addEventListener('blur', () => {
  bratImg.style.height = "auto"
})