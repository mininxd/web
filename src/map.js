import "/leaflet/leaflet-src.js";
import axios from "axios";
import { ipv4 } from "./ip.js"


// ISP map
export async function map(name, lat, lon) {
  const ipAddr = await ipv4();
  
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