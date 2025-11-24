import "./lib";
import "./blocked.js";
import 'remixicon/fonts/remixicon.css'
import axios from "axios";
import { getDnsStats, getIpInfo, getClientDnsInfo } from "./lib/api";

async function copyToClipboard(element, text) {
  try {
    await navigator.clipboard.writeText(text);

    const originalTip = element.getAttribute('data-tip');
    element.setAttribute('data-tip', 'Copied!');

    // Add a class to show the update
    element.classList.add('tooltip');

    // Reset the tooltip after a short delay
    setTimeout(() => {
      element.setAttribute('data-tip', originalTip);
      element.classList.remove('tooltip');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

async function main() {
const ipEndpoint = import.meta.env.VITE_IP_ENDPOINT || "https://api-mininxd.vercel.app/ip";
let ip = await axios.get(ipEndpoint);
const ipv4 = ip.data.ip.ipv4

let ipAddr = document.querySelectorAll(".ipv4");
ipAddr.forEach(el => {
  el.innerHTML = ipv4;
})

ConnectionStatus.innerHTML = "Checking DNS Connection...";

// Get client DNS info to determine connection protocol
getClientDnsInfo(ipv4).then(async (clientInfo) => {
  let client_proto = clientInfo.client_proto;
  let client_name = clientInfo.client_info?.name?.trim();

  if (client_proto == "doh") client_proto = "DoH";
  if (client_proto == "dot") client_proto = "DoT";

  if (!client_proto) {
    ConnectionStatus.innerHTML = `Not Connected to DNS`;
  } else if (client_name && client_name.length > 0) {
    ConnectionStatus.innerHTML = `Connected to DNS (${client_proto} — ${client_name})`;
  } else {
    ConnectionStatus.innerHTML = `Connected to DNS (${client_proto})`;
  }

  // Add network information if available
  if (clientInfo.client_info?.whois) {
  let orgname = clientInfo.client_info.whois.orgname;

  // If whois is empty or has no orgname, fall back to API
  if (!orgname && Object.keys(clientInfo.client_info.whois).length === 0) {
    const ipInfo = await getIpInfo(ipv4);
    orgname = ipInfo?.org.toUpperCase() || "Unknown";
  }

if(navigator.userAgent.includes("Mobile") && orgname.length >= 18) {
  orgname = `
  ${orgname.slice(0, 16)}...
  <div class="font-jetbrains tooltip tooltip-left" data-tip="${orgname}">
  <i class="ri-information-fill"></i>
</div>`
}
  isConnected.innerHTML += `
    <div class="flex justify-between w-full mb-1">
      <span>Network</span>
      <span>${orgname}</span>
    </div>
  `;
}

}).catch(error => {
  ConnectionStatus.innerHTML = "Connection status unknown";
});

// Get DNS stats from API
getDnsStats().then(response => {
  topBlockedWrapper.classList.remove("h-0", "max-h-0", "hidden")

  // Display top blocked domains
  const blockedDomains = response.top_blocked_domains
    .slice(0, 5)
    .map(item => Object.keys(item)[0]);

  const blockedCounts = response.top_blocked_domains.slice(0, 5).map(item => Object.values(item)[0]);

  for(let i = 0; i<5; i++) {
    if (blockedDomains[i]) { // Check if domain exists to avoid errors
      topBlocked.innerHTML += `
      <div class="flex border-b-1 w-full justify-between">
      <span>${blockedDomains[i]}</span>
      <span>${blockedCounts[i]}</span>
      </div>
      `
    }
  }
}).catch(error => {
  ConnectionStatus.innerHTML = "Failed to load DNS stats";
});

// Add click event listeners to DNS URL elements to enable copy functionality
document.getElementById('dohUrl')?.addEventListener('click', function() {
  copyToClipboard(this, this.textContent);
});

document.getElementById('familyDohUrl')?.addEventListener('click', function() {
  copyToClipboard(this, this.textContent);
});

document.getElementById('dotUrl')?.addEventListener('click', function() {
  copyToClipboard(this, this.textContent);
});
document.getElementById('familyDotUrl')?.addEventListener('click', function() {
  copyToClipboard(this, this.textContent);
});
}


main();



if(!navigator.userAgent.includes("Mobile")) {
  html.classList.add("flex","justify-center")
  wrapper.classList.add("px-[15%]")
  document.querySelectorAll('.field').forEach(field => {
    field.classList.add("w-full", "text-center", "px-4", "pb-[3px]")
    dohUrl.classList.add("text-xl");
    familyDohUrl.classList.add("text-xl");
  })
}