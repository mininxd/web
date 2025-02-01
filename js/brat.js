import axios from "axios";


export async function brat(text) {
  try {
    const { data } = await axios.get(
      `https://api-mininxd.vercel.app/brat?txt=${encodeURIComponent(text)}`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        }
      }
    );
    const blob = new Blob([data], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
 
 downBtn.classList.remove("hidden"); 
downBtn.addEventListener('click', () => {
  let filename = url + ".png";
  try { 
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert(e);
    window.open(bratImg.src, "_blank");
  }
});



//  console.log(data, blob, url)
    return url;
  } catch (e) {
    throw new Error(e);
    return e;
  }
}
