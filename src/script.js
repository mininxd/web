import axios from "axios";
import { getIP } from "./ip.js"
import {map} from "./map.js";
import "./desktop.js";


(async() => {
let ipAddr = await getIP();
let {data} = await axios.get(`https://api-mininxd.vercel.app/ip/${ipAddr}`);

if(data) {
  document.querySelectorAll('.skeleton').forEach(el => {
  el.classList.add("hidden");
})
}
// body.append(JSON.stringify(data))


pubIp.append(data.data.ip|| "-");
networkIp.append(data.data.network|| "-");
ipv.append(data.data.version|| "-");
org.append(data.data.org|| "-");
map(data.data.org)
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