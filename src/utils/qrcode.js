// src/utils/qrcode.js
export class QRCodeGenerator {
  static createQRCode(container, text) {
    // Clear any existing content
    container.innerHTML = '';

    // Create a div to hold the QR code
    const qrDiv = document.createElement('div');
    qrDiv.id = 'qrcode';
    container.appendChild(qrDiv);

    // Generate QR code
    new QRCode(qrDiv, {
      text: text,
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}