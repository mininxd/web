import axios from "axios";
import { copyText } from "./main.js";
import{ checkProxy } from "./checkProxy.js";
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
        <td>
          <span class="status hidden wip status-success"></span> 
           ${data[i].proxy}
        </td>
        <td><span class="proxyIp">${data[i].ip}</span></td>
        <td><span class="proxyPort">${data[i].port}</span></td>
        <td>${data[i].protocol}</td>
        <td>${data[i].anonymity}</td>
        <td>${data[i].score}</td>
        <td>${data[i].geolocation.country}</td>
      </tr>`
  }
    copyText("td")
    
    
/*WIP
    const proxyStatus = await [...document.querySelectorAll(".status")]; 
    const proxyIp = await [...document.querySelectorAll(".proxyIp")]; 
    const proxyPort = await [...document.querySelectorAll(".proxyPort")]; 
    
    for(let i = 0; i < proxyStatus.length; i++) {
      console.log(proxyIp[i].textContent)
      checkProxy(proxyIp[i].textContent, proxyPort[i].textContent)
    }
    
*/
    
} catch(e) {
  proxFound.classList.replace("badge-info", "badge-error")
  if(count > 100) {
    proxFound.innerHTML = "403 Forbidden - can't exceed 100"
  } else {
  proxFound.innerHTML = "429 Too Many Request"
  }
}
}