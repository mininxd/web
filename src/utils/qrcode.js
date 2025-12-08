import QRCode from 'qrcode';

export class QRCodeGenerator {
  static createQRCode(container, text) {
    // Clear any existing content
    container.innerHTML = '';

    // Create a canvas to hold the QR code
    const canvas = document.createElement('canvas');
    canvas.id = 'qrcode-canvas';
    container.appendChild(canvas);

    // Generate QR code
    QRCode.toCanvas(canvas, text, {
      width: 150,
      color: {
        dark: "#000000",
        light: "#ffffff"
      },
      errorCorrectionLevel: 'H'
    }, function (error) {
      if (error) console.error('QR Code generation error:', error);
    });
  }
}
