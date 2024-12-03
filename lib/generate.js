import axios from "axios";

export async function qris(id, harga) {
try {
  let {data} = await axios.get(`https://api-mininxd.vercel.app/qris?qris=${id}&nominal=${harga}`)
  
dataQris.innerHTML = data.QR;
namaMerchant.innerHTML = data.merchant;
return JSON.stringify(data);
} catch(e) {
  return e;
}
}