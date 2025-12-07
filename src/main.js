// src/main.js
import { FileTransferApp } from './components/fileTransfer.js';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new FileTransferApp();
  app.init();
});