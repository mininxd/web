import axios from "axios";
import { copyText } from "./main.js";

let totalProxies = 0;
export async function proxyTable(count, type) {
try {
  let {data} = await axios.get(`https://api-mininxd.vercel.app/proxy?count=${count}&type=${type}`);
  
  loading.style.display = "none";
  downloadDiv.classList.remove("hidden");
  proxCount.innerHTML = data.length;
  proxType.innerHTML = data[0].protocol;
  
  let dataTxt = "";
  for(let i = 0; i < data.length; i++) {
    if(data[i] == null) {
    return
    }
    totalProxies++;
    proxFound.innerHTML = `Loaded Proxies: ${totalProxies}`;
    tBody.innerHTML += `
      <tr>
        <td><input type="checkbox" class="select checkbox checkbox-info"></td>
        <td>${data[i].proxy}</td>
        <td>${data[i].ip}</td>
        <td>${data[i].port}</td>
        <td>${data[i].protocol}</td>
        <td>${data[i].anonymity}</td>
        <td>${data[i].score}</td>
        <td>${data[i].geolocation.country}</td>
      </tr>`
  }
    copyText("td")
} catch(e) {
  proxFound.classList.replace("badge-info", "badge-error")
  if(count > 100) {
    proxFound.innerHTML = "403 Forbidden - can't exceed 100"
  } else {
  proxFound.innerHTML = "429 Too Many Request"
  }
}
}