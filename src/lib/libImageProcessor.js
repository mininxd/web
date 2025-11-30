import { loadImage, createCanvas } from 'canvas';
import sharp from 'sharp';

export async function computeAndVisualize(imageSource, originalFormat, gradientMax) {
    const img = await loadImage(imageSource);
    const width = img.width;
    const height = img.height;

    // Canvas dasar
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, width, height).data;

    // Canvas untuk edge map
    const fullResCanvas = createCanvas(width, height);
    const fullResCtx = fullResCanvas.getContext('2d');
    const fullResImgData = fullResCtx.createImageData(width, height);
    const outputData = fullResImgData.data;

    // Luminance
    const luma = new Float32Array(width * height);

    // Alpha opaque
    for (let i = 0; i < outputData.length; i += 4) {
        outputData[i + 3] = 255;
    }

    // Compute luminance
    for (let i = 0; i < data.length; i += 4) {
        luma[i / 4] =
            0.2126 * data[i] +
            0.7152 * data[i + 1] +
            0.0722 * data[i + 2];
    }

    // Use Sharp to resize image to gradientMax x gradientMax for gradient calculation
    const resizedBuffer = await sharp(imageSource)
        .resize(gradientMax, gradientMax, { fit: 'fill' })
        .ensureAlpha()
        .raw()
        .toBuffer();

    const resizedWidth = gradientMax;
    const resizedHeight = gradientMax;
    const expectedLength = resizedWidth * resizedHeight * 4; // RGBA

    if (resizedBuffer.length !== expectedLength) {
        console.warn(`Expected buffer length ${expectedLength}, got ${resizedBuffer.length}`);
    }

    // Luminance for resized image (for gradient calculation)
    const resizedLuma = new Float32Array(resizedWidth * resizedHeight);

    // Compute luminance for resized image
    for (let i = 0; i < resizedBuffer.length; i += 4) {
        const pixelIndex = i / 4;
        if (pixelIndex >= resizedLuma.length) break; // Safety check

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

    // Batasi ke 100 sampel atau kurangi dari gradientMax*gradientMax jika lebih besar
    const maxSamples = Math.min(100, M.length);
    const limitedM = M.slice(0, maxSamples);

    // === FULL RESOLUTION GRADIENTS (kovarians + visualisasi) ===
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

        const resizeCanvas = createCanvas(finalWidth, finalHeight);
        const resizeCtx = resizeCanvas.getContext('2d');

        resizeCtx.drawImage(fullResCanvas, 0, 0, finalWidth, finalHeight);
        finalCanvas = resizeCanvas;
    }

    // Encoding
    const isJpeg =
        originalFormat.toLowerCase().endsWith('jpg') ||
        originalFormat.toLowerCase().endsWith('jpeg');

    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const buffer = finalCanvas.toBuffer(mimeType);
    const base64 = finalCanvas.toDataURL(mimeType);

    return {
        stats: {
            width,
            height,
            N: validPixels,

            covarianceMatrix: [
                [sumGx2 / validPixels, sumGxGy / validPixels],
                [sumGxGy / validPixels, sumGy2 / validPixels]
            ],

            gradientMatrixSampled: limitedM,      // <= 100 vektor
            gradientGridSize: [resizedWidth, resizedHeight],       // <= grid size used for gradient computation
            gradientRawCount: M.length           // <= total before limit
        },

        visual: {
            width: finalWidth,
            height: finalHeight,
            imageBuffer: buffer,
            base64: base64,
            ext: isJpeg ? 'jpg' : 'png'
        }
    };
}