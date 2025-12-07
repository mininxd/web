// src/main.js
import { FileTransferApp } from './components/fileTransferApp.js';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new FileTransferApp();
  app.init();
});