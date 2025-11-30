// Browser-compatible image processing function
export function computeAndVisualize(img) {
  return new Promise((resolve) => {
    const width = img.width;
    const height = img.height;

    // Create canvas elements for processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    const outputImageData = outputCtx.createImageData(width, height);
    const outputData = outputImageData.data;

    // Calculate luma (grayscale) values
    const luma = new Float32Array(width * height);

    for (let i = 0; i < outputData.length; i += 4) {
      outputData[i + 3] = 255; // Set alpha to 255
    }

    // Convert RGB to grayscale using luma formula
    for (let i = 0; i < data.length; i += 4) {
      luma[i / 4] = (0.2126 * data[i]) + (0.7152 * data[i + 1]) + (0.0722 * data[i + 2]);
    }

    // Calculate gradients
    let sumGx2 = 0, sumGy2 = 0, sumGxGy = 0, validPixels = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const pIdx = idx * 4;

        // Skip edge pixels
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) continue;

        // Calculate gradients
        const rightIdx = y * width + (x + 1);
        const leftIdx = y * width + (x - 1);
        const bottomIdx = (y + 1) * width + x;
        const topIdx = (y - 1) * width + x;

        const gx = luma[rightIdx] - luma[leftIdx];
        const gy = luma[bottomIdx] - luma[topIdx];

        sumGx2 += gx * gx;
        sumGy2 += gy * gy;
        sumGxGy += gx * gy;
        validPixels++;

        // Calculate magnitude
        let mag = (Math.abs(gx) + Math.abs(gy)) * 2;
        mag = mag > 255 ? 255 : mag;

        // Set RGB to the same value for grayscale gradient map
        outputData[pIdx] = mag;     // R
        outputData[pIdx + 1] = mag; // G
        outputData[pIdx + 2] = mag; // B
      }
    }

    // Put the processed data onto the output canvas
    outputCtx.putImageData(outputImageData, 0, 0);

    // Determine if the image is PNG or JPEG based on original
    // For simplicity, we'll use JPEG for the gradient result
    const mimeType = 'image/jpeg';

    // Use original dimensions for result
    let finalWidth = width;
    let finalHeight = height;
    let finalCanvas = outputCanvas;

    // Get the data URL for the result
    const base64 = finalCanvas.toDataURL(mimeType);

    const result = {
      stats: {
        width,
        height,
        N: validPixels,
        covarianceMatrix: [
          [sumGx2 / validPixels, sumGxGy / validPixels],
          [sumGxGy / validPixels, sumGy2 / validPixels]
        ]
      },
      visual: {
        width: finalWidth,
        height: finalHeight,
        base64: base64,
        ext: 'jpg'
      }
    };

    resolve(result);
  });
}