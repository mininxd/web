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
    const id = this.receiverInput.value.trim();
    if (!id) {
      alert('Please enter a sender ID');
      return;
    }

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

          const fileItem = DOMUtils.createElement('div', 'py-2 border-b border-gray-200 last:border-0');
          fileItem.id = `received-${data.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
          fileItem.innerHTML = `
            <div class="flex justify-between">
              <span class="font-medium">${data.name}</span>
              <span class="text-sm">${FileOperations.formatFileSize(data.size)}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div class="file-progress bg-blue-600 h-1.5 rounded-full" style="width: 0%"></div>
            </div>
          `;
          this.receivedFilesList.appendChild(fileItem);
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
            }

            currentFileMetadata = null;
          }
        }
      }
    });

    conn.on('close', () => {
      this.connectionStatus.textContent = 'Transfer completed.';
      this.downloadAllReceivedBtn.classList.remove('hidden');
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
      alert('Unable to access camera. Please check permissions or enter the ID manually.');
    }
  }

  downloadAllFiles() {
    if (Object.keys(this.receivedFiles).length === 0) {
      alert('No files received yet.');
      return;
    }

    FileOperations.downloadMultipleFiles(this.receivedFiles);
    alert('Files downloaded successfully!');
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
