import "./lib";
import 'remixicon/fonts/remixicon.css'
import axios from "axios";
import { queryLogs, stats } from "./lib/socket.ts";
import { copyText } from "./lib/index.ts";

copyText(dotUrl);
copyText(dohUrl);
copyText(familyDohUrl);







async function main() {
let ip = await axios.get("https://api-mininxd.vercel.app/ip");
const ipv4 = ip.data.ip.ipv4
// const ipv6 = ip.data.ip.ipv6

let ipAddr = document.querySelectorAll(".ipv4");
ipAddr.forEach(el => {
  el.innerHTML = ipv4;
})


ConnectionStatus.innerHTML = "Checking DNS Connection..."

queryLogs(ipv4, 10, 0).then(response => 
{
  const data = response.data; 
  if(data.length <= 1) {
    ConnectionStatus.innerHTML = "Not Connected";
    return;
  }
  let client_proto = data[0].client_proto;
  if(client_proto == "doh") client_proto = "DoH";
  if(client_proto == "dot") client_proto = "DoT";
  
    ConnectionStatus.innerHTML = `Connected to DNS (${client_proto})`;

for (let i = 0; i < data.length; i++) {
  if (data[i].client_whois) {
    isConnected.innerHTML += `
    <div class="flex justify-between w-full mb-1">
      <span>Network</span>
      <span>${data[i].client_whois}</span>
    </div>
    `
    break;
  }
}
})






stats().then(response => {
  topBlockedWrapper.classList.remove("h-0", "max-h-0", "hidden")
  const blockedDomains = response.top_blocked_domains
    .slice(0, 5)
    .map(item => Object.keys(item)[0]);
  
const blockedCounts = response.top_blocked_domains.slice(0, 5).map(item => Object.values(item)[0]);

for(let i = 0; i<5; i++) {
  topBlocked.innerHTML += `
  <div class="flex border-b-1 w-full justify-between">
  <span>${blockedDomains[i]}</span>
  <span>${blockedCounts[i]}</span>
  </div>
  `
}
})
}


main();