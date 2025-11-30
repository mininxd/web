export async function computeAndVisualize(img, originalFormat = 'png', gradientMax = 256) {
    // img is expected to be an HTMLImageElement (loaded) or HTMLCanvasElement
    const width = img.width;
    const height = img.height;

    // Create a temporary canvas to extract pixel data
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Canvas for edge map (output)
    const fullResCanvas = document.createElement('canvas');
    fullResCanvas.width = width;
    fullResCanvas.height = height;
    const fullResCtx = fullResCanvas.getContext('2d');
    const fullResImgData = fullResCtx.createImageData(width, height);
    const outputData = fullResImgData.data;

    // Luminance
    const luma = new Float32Array(width * height);

    // Alpha opaque for output
    for (let i = 0; i < outputData.length; i += 4) {
        outputData[i + 3] = 255;
    }

    // Compute luminance
    for (let i = 0; i < data.length; i += 4) {
        // Simple luminance formula
        luma[i / 4] =
            0.2126 * data[i] +
            0.7152 * data[i + 1] +
            0.0722 * data[i + 2];
    }

    // Resize image to gradientMax x gradientMax for gradient calculation
    const resizeCanvas = document.createElement('canvas');
    resizeCanvas.width = gradientMax;
    resizeCanvas.height = gradientMax;
    const resizeCtx = resizeCanvas.getContext('2d');
    // Use 'fill' behavior (stretch) to match original sharp implementation
    resizeCtx.drawImage(img, 0, 0, gradientMax, gradientMax);
    const resizedImageData = resizeCtx.getImageData(0, 0, gradientMax, gradientMax);
    const resizedBuffer = resizedImageData.data;

    const resizedWidth = gradientMax;
    const resizedHeight = gradientMax;

    // Luminance for resized image (for gradient calculation)
    const resizedLuma = new Float32Array(resizedWidth * resizedHeight);

    // Compute luminance for resized image
    for (let i = 0; i < resizedBuffer.length; i += 4) {
        const pixelIndex = i / 4;
        if (pixelIndex >= resizedLuma.length) break;

        resizedLuma[pixelIndex] =
            0.2126 * resizedBuffer[i] +      // R
            0.7152 * resizedBuffer[i + 1] +  // G
            0.0722 * resizedBuffer[i + 2];   // B
    }

    // === MATRICS M FROM RESIZED IMAGE (gradientMax x gradientMax) ===
    const M = [];

    for (let y = 0; y < resizedHeight; y++) {
        for (let x = 0; x < resizedWidth; x++) {
            // Calculate gradients with boundary handling
            let gx = 0, gy = 0;

            if (x === 0) {
                // Forward difference for left edge
                gx = resizedLuma[y * resizedWidth + (x + 1)] - resizedLuma[y * resizedWidth + x];
            } else if (x === resizedWidth - 1) {
                // Backward difference for right edge
                gx = resizedLuma[y * resizedWidth + x] - resizedLuma[y * resizedWidth + (x - 1)];
            } else {
                // Central difference for middle columns
                gx = resizedLuma[y * resizedWidth + (x + 1)] - resizedLuma[y * resizedWidth + (x - 1)];
            }

            if (y === 0) {
                // Forward difference for top edge
                gy = resizedLuma[(y + 1) * resizedWidth + x] - resizedLuma[y * resizedWidth + x];
            } else if (y === resizedHeight - 1) {
                // Backward difference for bottom edge
                gy = resizedLuma[y * resizedWidth + x] - resizedLuma[(y - 1) * resizedWidth + x];
            } else {
                // Central difference for middle rows
                gy = resizedLuma[(y + 1) * resizedWidth + x] - resizedLuma[(y - 1) * resizedWidth + x];
            }

            M.push([gx, gy]);
        }
    }

    // Limit to 100 samples
    const maxSamples = Math.min(100, M.length);
    const limitedM = M.slice(0, maxSamples);

    // === FULL RESOLUTION GRADIENTS (covariance + visualization) ===
    let sumGx2 = 0, sumGy2 = 0, sumGxGy = 0, validPixels = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            if (x === 0 || x === width - 1 || y === 0 || y === height - 1)
                continue;

            const idx = y * width + x;
            const pIdx = idx * 4;

            // Use central differences for gradient calculation
            const leftIdx = y * width + (x - 1);
            const rightIdx = y * width + (x + 1);
            const topIdx = (y - 1) * width + x;
            const bottomIdx = (y + 1) * width + x;

            const gx = luma[rightIdx] - luma[leftIdx];
            const gy = luma[bottomIdx] - luma[topIdx];

            sumGx2 += gx * gx;
            sumGy2 += gy * gy;
            sumGxGy += gx * gy;
            validPixels++;

            // Visual edge
            let mag = (Math.abs(gx) + Math.abs(gy)) * 2;
            if (mag > 255) mag = 255;

            outputData[pIdx] = mag;
            outputData[pIdx + 1] = mag;
            outputData[pIdx + 2] = mag;
        }
    }

    fullResCtx.putImageData(fullResImgData, 0, 0);

    // Resize if too big for output
    const MAX_WIDTH = 4096;
    let finalWidth = width;
    let finalHeight = height;
    let finalCanvas = fullResCanvas;

    if (width > MAX_WIDTH) {
        const scale = MAX_WIDTH / width;
        finalWidth = MAX_WIDTH;
        finalHeight = Math.round(height * scale);

        const resizeCanvas2 = document.createElement('canvas');
        resizeCanvas2.width = finalWidth;
        resizeCanvas2.height = finalHeight;
        const resizeCtx2 = resizeCanvas2.getContext('2d');

        resizeCtx2.drawImage(fullResCanvas, 0, 0, finalWidth, finalHeight);
        finalCanvas = resizeCanvas2;
    }

    // Encoding
    // If originalFormat is passed (e.g., 'image/jpeg'), use it.
    let mimeType = 'image/png';
    if (originalFormat && (originalFormat.toLowerCase().includes('jpg') || originalFormat.toLowerCase().includes('jpeg'))) {
        mimeType = 'image/jpeg';
    }

    const base64 = finalCanvas.toDataURL(mimeType);

    // Generate Covariance Matrix HTML
    const covMatrix = [
        [sumGx2 / validPixels, sumGxGy / validPixels],
        [sumGxGy / validPixels, sumGy2 / validPixels]
    ];

    const labels = ['Gx', 'Gy'];
    let covarianceMatrixHTML = '';
    
    covMatrix.forEach((row, i) => {
        let rowHTML = `<tr><th>${labels[i]}</th>`;
        row.forEach(val => {
            rowHTML += `<td class="text-right">${val.toFixed(2)}</td>`;
        });
        rowHTML += '</tr>';
        covarianceMatrixHTML += rowHTML;
    });

    return {
        stats: {
            width,
            height,
            N: validPixels,

            covarianceMatrix: covMatrix,
            covarianceMatrixHTML,

            gradientMatrixSampled: limitedM,
            gradientGridSize: [resizedWidth, resizedHeight],
            gradientRawCount: M.length
        },

        visual: {
            width: finalWidth,
            height: finalHeight,
            base64: base64,
            ext: mimeType === 'image/jpeg' ? 'jpg' : 'png'
        }
    };
}
