import { DOMUtils } from '../utils/dom.js';
import { FileOperations } from '../utils/fileOperations.js';

export class ReceiverMode {
  constructor(peerManager) {
    this.peerManager = peerManager;
    this.receivedFiles = {};
  }

  initializeElements() {
    this.receiverApp = DOMUtils.getElement('#receiver-app');
    this.receiverInput = DOMUtils.getElement('#receiver-input');
    this.connectBtn = DOMUtils.getElement('#connect-btn');
    this.scanQrBtn = DOMUtils.getElement('#scan-qr-btn');
    this.connectionStatus = DOMUtils.getElement('#connection-status');
    this.receiverConnectionSection = DOMUtils.getElement('#receiver-connection-section');
    this.receptionSection = DOMUtils.getElement('#reception-section');
    this.receptionProgress = DOMUtils.getElement('#reception-progress');
    this.receptionProgressPercent = DOMUtils.getElement('#reception-progress-percent');
    this.receivedFilesList = DOMUtils.getElement('#received-files-list');
    this.downloadAllReceivedBtn = DOMUtils.getElement('#download-all-received-btn');
  }

  bindEvents(onConnect, onScanQr, onDownloadAll) {
    if (this.connectBtn) {
      this.connectBtn.addEventListener('click', onConnect);
    }
    if (this.scanQrBtn) {
      this.scanQrBtn.addEventListener('click', onScanQr);
    }
    if (this.downloadAllReceivedBtn) {
      this.downloadAllReceivedBtn.addEventListener('click', onDownloadAll);
    }
  }

  connect() {
    let id = this.receiverInput.value.trim();
    if (!id) {
      console.log('Please enter a sender ID');
      return;
    }

    // Convert to uppercase to match sender IDs
    id = id.toUpperCase();

    this.connectionStatus.textContent = 'Connecting to sender...';

    this.peerManager.initializeReceiverPeer(
      () => {
        const conn = this.peerManager.connectToSender(
          id,
          () => {
            console.log('Connected to sender');
            this.connectionStatus.textContent = 'Connected! Receiving files...';
            setTimeout(() => {
              this.receiverConnectionSection.classList.add('hidden');
              this.receptionSection.classList.remove('hidden');
              this.receptionProgress.value = 0;
              this.receptionProgressPercent.textContent = '0%';
            }, 1000);
          },
          (err) => {
            this.connectionStatus.textContent = 'Connection failed. Check ID.';
          }
        );

        this.setupDataConnection(conn);
      },
      (err) => {
        this.connectionStatus.textContent = 'Connection error: ' + err.type;
      }
    );
  }

  setupDataConnection(conn) {
    let currentFileBuffer = [];
    let currentFileMetadata = null;
    let receivedBytes = 0;
    let totalExpectedBytes = 0;

    conn.on('data', (data) => {
      if (data && data.type) {
        if (data.type === 'file_metadata') {
          currentFileMetadata = {
            name: data.name,
            size: data.size,
            type: data.fileType,
            data: []
          };
          totalExpectedBytes = data.size;
          receivedBytes = 0;

          const sanitizedId = `received-${data.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
          const fileItem = DOMUtils.createElement('div', 'py-2 border-b border-gray-200 last:border-0');
          fileItem.id = sanitizedId;
          fileItem.innerHTML = `
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <span class="font-medium">${data.name}</span>
                <div class="text-sm text-gray-500">${FileOperations.formatFileSize(data.size)}</div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1 w-32">
                  <div class="file-progress bg-blue-600 h-1.5 rounded-full" style="width: 0%"></div>
                </div>
                <button class="download-btn btn btn-xs btn-outline hidden" data-filename="${data.name}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>
              </div>
            </div>
          `;
          this.receivedFilesList.appendChild(fileItem);

          // Add event listener for individual download button
          const downloadBtn = fileItem.querySelector('.download-btn');
          downloadBtn.addEventListener('click', () => {
            const fileName = downloadBtn.getAttribute('data-filename');
            const fileData = this.receivedFiles[fileName];
            if (fileData) {
              FileOperations.downloadFile(fileData.blob, fileName);
              console.log('Downloaded file:', fileName);
            }
          });
        } else if (data.type === 'file_chunk') {
          if (currentFileMetadata) {
            currentFileMetadata.data.push(data.data);
            receivedBytes += data.data.byteLength;
            const progress = totalExpectedBytes > 0 ? Math.round((receivedBytes / totalExpectedBytes) * 100) : 0;

            this.receptionProgress.value = progress;
            this.receptionProgressPercent.textContent = `${progress}%`;

            const sanitizedId = `received-${currentFileMetadata.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const fileItem = document.getElementById(sanitizedId);
            if (fileItem) {
              const progressBar = fileItem.querySelector('.file-progress');
              if (progressBar) {
                progressBar.style.width = `${progress}%`;
              }
            }
          }
        } else if (data.type === 'file_end') {
          if (currentFileMetadata) {
            const fileBlob = new Blob(currentFileMetadata.data);
            this.receivedFiles[currentFileMetadata.name] = {
              blob: fileBlob,
              size: currentFileMetadata.size,
              type: currentFileMetadata.type
            };

            const sanitizedId = `received-${currentFileMetadata.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const fileItem = document.getElementById(sanitizedId);
            if (fileItem) {
              const progressBar = fileItem.querySelector('.file-progress');
              if (progressBar) {
                progressBar.style.width = '100%';
              }

              // Show the download button for this file
              const downloadBtn = fileItem.querySelector('.download-btn');
              if (downloadBtn) {
                downloadBtn.classList.remove('hidden');
              }
            }

            currentFileMetadata = null;
          }
        }
      }
    });

    conn.on('close', () => {
      this.connectionStatus.textContent = 'Transfer completed.';
      this.downloadAllReceivedBtn.classList.remove('hidden');
      console.log('Transfer completed. All files received.');
    });

    conn.on('error', (err) => {
      console.error('Data connection error:', err);
      this.connectionStatus.textContent = 'Error occurred during transfer.';
    });
  }

  async scanQRCode() {
    const modal = DOMUtils.createElement('div', 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50');
    modal.innerHTML = `
      <div class="bg-base-100 rounded-lg p-6 max-w-lg w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Scan QR Code</h3>
          <button id="close-scanner" class="btn btn-sm btn-circle">✕</button>
        </div>
        <div class="relative">
          <video id="qr-video" class="w-full rounded-lg bg-black" autoplay playsinline></video>
          <canvas id="qr-canvas" class="hidden"></canvas>
        </div>
        <p class="text-center mt-4 text-sm">Position the QR code within the camera view</p>
      </div>
    `;
    document.body.appendChild(modal);

    const video = modal.querySelector('#qr-video');
    const canvas = modal.querySelector('#qr-canvas');
    const context = canvas.getContext('2d');
    const closeBtn = modal.querySelector('#close-scanner');

    let stream = null;
    let scanning = true;

    const cleanup = () => {
      scanning = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      document.body.removeChild(modal);
    };

    closeBtn.addEventListener('click', cleanup);

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      video.srcObject = stream;

      const scanFrame = () => {
        if (!scanning) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            cleanup();
            this.receiverInput.value = code.data.trim();
            this.connect();
            return;
          }
        }

        requestAnimationFrame(scanFrame);
      };

      video.addEventListener('loadedmetadata', () => {
        scanFrame();
      });
    } catch (err) {
      console.error('Camera error:', err);
      cleanup();
      console.log('Unable to access camera. Please check permissions or enter the ID manually.');
    }
  }

  async downloadAllFiles() {
    if (Object.keys(this.receivedFiles).length === 0) {
      console.log('No files received yet.');
      return;
    }

    try {
      await FileOperations.downloadMultipleFilesAsZip(this.receivedFiles);
      console.log('Files downloaded as a zip archive successfully!');
    } catch (error) {
      console.error('Error downloading files as zip:', error);
    }
  }

  show() {
    this.receiverApp.classList.remove('hidden');
  }

  hide() {
    this.receiverApp.classList.add('hidden');
  }

  reset() {
    this.receiverConnectionSection.classList.remove('hidden');
    this.receptionSection.classList.add('hidden');
    this.receivedFilesList.innerHTML = '';
    this.downloadAllReceivedBtn.classList.add('hidden');
    this.connectionStatus.textContent = '';
    this.receivedFiles = {};
  }
}
