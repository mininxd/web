import QRCode from "qrcode";
const qrisData = import.meta.env.VITE_QRIS;

export default async function generateQR(element) {
  try {
    await QRCode.toCanvas(element, qrisData);
  } catch (err) {
    console.error("QR generation error");
    return "";
  }
}
