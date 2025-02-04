import axios from "axios";
import { ipv4, ipv6 } from "./ip.js"
import {map} from "./map.js";
import "./desktop.js";
import theme from '@egstad/detect-theme'


 function validateIP(ip) {
  return /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/.test(ip);
 } 
 
ipButton.addEventListener('click', (e) => {
  e.preventDefault()
if(validateIP(ipInput.value)) {
 window.location.href = `?ip=${ipInput.value}`
  } else { 
    ipInput.setCustomValidity("Invalid IP address!");
    ipInput.reportValidity();
  };
});


(async() => {
let urlIP = window.location.href.split("?ip=")[1];
let ipAddr = await ipv4();
if (urlIP) {
  ipAddr = await urlIP;
}

let ipAddr6 = await ipv6();

let {data} = await axios.get(`https://api-mininxd.vercel.app/ip/${ipAddr}`);

if(data) {
  document.querySelectorAll('.skeleton').forEach(el => {
  el.classList.add("hidden");
})
}
// body.append(JSON.stringify(data))
if(data.data.version == "IPv6") {
  pubIp.classList.replace("text-4xl", "text-3xl");
}
map(data.data.org, data.data.latitude, data.data.longitude);


pubIp.append(data.data.ip|| "-");
pubIp6.append(ipAddr6 || "");
networkIp.append(data.data.network|| "-");
ipv.append(data.data.version|| "-");
org.append(data.data.org|| "-");
asn.append(data.data.asn|| "-");
city.append(data.data.city|| "-");
region.append(`${data.data.region} - ${data.data.region_code}`|| "-");
country.append(`${data.data.country_name} - ${data.data.country}`|| "-");
lat.append(data.data.latitude|| "-");
lon.append(data.data.longitude|| "-");


aka.append(data.data.info.aka|| "-");
irr.append(data.data.info.irr_as_set|| "-");
lname.append(data.data.info.name_long|| "-");
notes.append(data.data.info.notes|| "-");
ip6.append(data.data.info.info_ipv6|| "-");
multicast.append(data.data.info.info_multicast||false);
unicast.append(data.data.info.info_unicast||false);
prefixes4.append(data.data.info.info_prefixes4|| "-");
prefixes6.append(data.data.info.info_prefixes6|| "-");
ratio.append(data.data.info.info_ratio|| "-");
scope.append(data.data.info.info_scope|| "-");
traffic.append(data.data.info.info_traffic|| "-");



orgAddr.append(`${data.data.organization.address1} ${data.data.organization.address2}`|| "-");
orgCity.append(data.data.organization.city|| "-");
orgZip.append(data.data.organization.zipcode|| "-");
orgNotes.innerHTML = data.data.organization.notes.replaceAll("\n", "<br>") || "-";



})();






// watch for `colorSchemeUpdated` events
window.addEventListener('colorSchemeUpdated', (e) => {
  switch (e.detail.theme) {
    case 'light':
      root.setAttribute("data-theme", "light");
      contentTheme.setAttribute("content", "#ffffff");

    break;
    default:
      root.setAttribute("data-theme", "dark");
    break;
  }
})
theme.watch()