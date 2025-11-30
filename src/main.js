import './style.css';
import { computeAndVisualize } from './imageProcessor.js';

// DOM Elements
const imageUpload = document.getElementById('imageUpload');
const previewImg = document.getElementById('previewImg');
const imagePreview = document.getElementById('imagePreview');
const processBtn = document.getElementById('processBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const resultImg = document.getElementById('resultImg');
const downloadLink = document.getElementById('downloadLink');
const originalWidth = document.getElementById('originalWidth');
const originalHeight = document.getElementById('originalHeight');
const outputWidth = document.getElementById('outputWidth');
const outputHeight = document.getElementById('outputHeight');
const processingTime = document.getElementById('processingTime');
const pixelSamples = document.getElementById('pixelSamples');

let currentImage = null;

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
processBtn.addEventListener('click', processImage);

// Image Upload Handler
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Check if file is an image
  if (!file.type.match('image.*')) {
    alert('Please select an image file (JPG, PNG, GIF)');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    // Display preview
    previewImg.src = e.target.result;
    imagePreview.classList.remove('hidden');

    // Enable process button
    processBtn.disabled = false;

    // Store the image
    currentImage = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Process Image Function
async function processImage() {
  if (!currentImage) return;

  // Show loading indicator
  loadingIndicator.classList.remove('hidden');
  resultsSection.classList.add('hidden');

  try {
    // Create image element from the uploaded image
    const img = new Image();
    img.src = currentImage;

    // Wait for image to load
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Process the image to create a gradient map
    const startTime = performance.now();
    const result = await computeAndVisualize(img);
    const endTime = performance.now();

    // Hide loading, show results
    loadingIndicator.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Update UI with results
    resultImg.src = result.visual.base64;
    downloadLink.href = result.visual.base64;
    downloadLink.classList.remove('hidden');

    // Update stats table
    originalWidth.textContent = result.stats.width;
    originalHeight.textContent = result.stats.height;
    outputWidth.textContent = result.visual.width;
    outputHeight.textContent = result.visual.height;
    processingTime.textContent = `${(endTime - startTime).toFixed(2)} ms`;
    pixelSamples.textContent = result.stats.N;

  } catch (error) {
    console.error('Error processing image:', error);
    alert(`Error processing image: ${error.message}`);
    loadingIndicator.classList.add('hidden');
  }
}
