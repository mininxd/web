import "/leaflet/leaflet-src.js";
import axios from "axios";
import { getIP } from "./ip.js"



(async() => {
  let ipAddr = await getIP();
  let {data} = await axios.get(`https://api-mininxd.vercel.app/ip/${ipAddr}`);
  
  let lat = data.data.latitude;
  let lon = data.data.longitude;
  let map = L.map("map", { zoomControl: false }).setView([lat, lon], 13);


  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
   
   
   var marker = L.icon({
    iconUrl: '/images/map-marker-48.png',
    shadowUrl: '',
    iconSize:    [41, 41],
  	iconAnchor:  [4, 36],
  	popupAnchor: [15, -25],
  	tooltipAnchor: [16, -28],
  	shadowSize:  [0,0]
});

L.marker([lat, lon]).addTo(map);
map.fitBounds(L.latLngBounds([lat, lon]));

})()
