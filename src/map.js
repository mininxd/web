import "/leaflet/leaflet-src.js";
import axios from "axios";
import { getIP } from "./ip.js"


// ISP map
export async function map(name) {
  const ipAddr = await getIP();
  let {data} = await axios.get(`https://api-mininxd.vercel.app/ip/${ipAddr}`);
  let lat = data.data.latitude;
  let lon = data.data.longitude;
  
  let map = L.map("map", { zoomControl: false }).setView([lat, lon], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
  
    var circle = L.circle([lat, lon], {
    color: '#f00',
    fillColor: '#f00',
    fillOpacity: 1,
    radius: 10
}).addTo(map);
    
    var popup = L.popup()
    .setLatLng([lat, lon])
    .setContent(name)
    .openOn(map);
}