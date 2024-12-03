import {qris} from "../lib/generate.js";
import "./login.js";
import "./modal.js";
import QRCode from "qrcode";




// Test
(async() => {
if(localStorage.getItem("QRIS_Utama")) {
  let qrisData = await qris(localStorage.getItem("QRIS_Utama"), 1000)
  
QRCode.toCanvas(qrTest, qrisData);
QRCode.toCanvas(merchantQRIScanvas, localStorage.getItem("QRIS_Utama"));
}
})()