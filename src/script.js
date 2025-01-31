import axios from "axios";
import { getIP } from "./ip.js"
import "./map.js";


(async() => {
let ipAddr = await getIP();
let {data} = await axios.get(`https://api-mininxd.vercel.app/ip/${ipAddr}`);

if(data) {
  document.querySelectorAll('.skeleton').forEach(el => {
  el.classList.add("hidden");
})
}
// body.append(JSON.stringify(data))


pubIp.append(data.data.ip);
networkIp.append(data.data.network);
ipv.append(data.data.version);
org.append(data.data.org);
city.append(data.data.city);
region.append(`${data.data.region} - ${data.data.region_code}`);
country.append(`${data.data.country_name} - ${data.data.country}`);
lat.append(data.data.latitude);
lon.append(data.data.longitude);
population.append(data.data.country_population)

})() 