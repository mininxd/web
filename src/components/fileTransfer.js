// src/components/fileTransfer.js
import { DOMUtils } from '../utils/dom.js';
import { QRCodeGenerator } from '../utils/qrcode.js';

export class FileTransferApp {
  constructor() {
    this.selectedFiles = [];
    this.transferId = null;
    this.totalFilesSize = 0;
    this.sentBytes = 0;
    this.currentFileIndex = 0;
    this.peer = null;
    this.conn = null;
    
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    // Mode selection
    this.modeSelector = DOMUtils.getElement('#mode-selector');
    this.senderApp = DOMUtils.getElement('#sender-app');
    this.receiverApp = DOMUtils.getElement('#receiver-app');

    // Sender elements
    this.senderModeBtn = DOMUtils.getElement('#sender-mode-btn');
    this.receiverModeBtn = DOMUtils.getElement('#receiver-mode-btn');
    this.senderHomeBtn = DOMUtils.getElement('#sender-home-btn');
    this.senderUploadInput = DOMUtils.getElement('#sender-upload-input');
    this.selectedFilesInfo = DOMUtils.getElement('#selected-files-info');
    this.selectedFilesList = DOMUtils.getElement('#selected-files-list');
    this.startSendBtn = DOMUtils.getElement('#start-send-btn');
    this.connectionSection = DOMUtils.getElement('#connection-section');
    this.senderIdInput = DOMUtils.getElement('#sender-id');
    this.copySenderIdBtn = DOMUtils.getElement('#copy-sender-id');
    this.createOfferBtn = DOMUtils.getElement('#create-offer-btn');
    this.qrcodeContainer = DOMUtils.getElement('#qrcode-container');
    this.progressSection = DOMUtils.getElement('#progress-section');
    this.transferProgress = DOMUtils.getElement('#transfer-progress');
    this.progressPercent = DOMUtils.getElement('#progress-percent');
    this.statusText = DOMUtils.getElement('#status-text');
    this.newTransferBtn = DOMUtils.getElement('#new-transfer-btn');

    // Receiver elements
    this.receiverHomeBtn = DOMUtils.getElement('#receiver-home-btn');
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

  bindEvents() {
    // Only bind events if elements exist - bind methods to preserve 'this'
    if (this.senderModeBtn) this.senderModeBtn.addEventListener('click', this.showSenderMode.bind(this));
    if (this.receiverModeBtn) this.receiverModeBtn.addEventListener('click', this.showReceiverMode.bind(this));
    if (this.senderHomeBtn) this.senderHomeBtn.addEventListener('click', this.resetApp.bind(this));
    if (this.receiverHomeBtn) this.receiverHomeBtn.addEventListener('click', this.resetApp.bind(this));

    if (this.senderUploadInput) this.senderUploadInput.addEventListener('change', this.handleFileSelection.bind(this));
    if (this.startSendBtn) this.startSendBtn.addEventListener('click', this.startFileTransfer.bind(this));
    if (this.copySenderIdBtn) this.copySenderIdBtn.addEventListener('click', this.copySenderId.bind(this));
    if (this.createOfferBtn) this.createOfferBtn.addEventListener('click', this.createWebRtcOffer.bind(this));
    if (this.newTransferBtn) this.newTransferBtn.addEventListener('click', this.resetApp.bind(this));

    if (this.connectBtn) this.connectBtn.addEventListener('click', () => this.connectToSender());
    if (this.scanQrBtn) this.scanQrBtn.addEventListener('click', this.scanQRCode.bind(this));
    if (this.downloadAllReceivedBtn) this.downloadAllReceivedBtn.addEventListener('click', this.downloadAllReceivedFiles.bind(this));
  }

  showSenderMode() {
    this.modeSelector.classList.add('hidden');
    this.senderApp.classList.remove('hidden');
    this.receiverApp.classList.add('hidden');
  }

  showReceiverMode() {
    this.modeSelector.classList.add('hidden');
    this.senderApp.classList.add('hidden');
    this.receiverApp.classList.remove('hidden');
  }

  handleFileSelection(e) {
    if (e && e.target && e.target.files && e.target.files.length > 0) {
      this.selectedFiles = Array.from(e.target.files);
      this.showSelectedFiles();
      this.selectedFilesInfo.classList.remove('hidden');
    }
  }

  showSelectedFiles() {
    this.selectedFilesList.innerHTML = '';
    
    this.selectedFiles.forEach((file, index) => {
      const li = DOMUtils.createElement('li', 'py-1 border-b border-gray-200 last:border-0');
      li.innerHTML = `
        <div class="flex justify-between">
          <span class="truncate max-w-xs">${file.name}</span>
          <span class="text-sm text-gray-500">${DOMUtils.formatFileSize(file.size)}</span>
        </div>
      `;
      this.selectedFilesList.appendChild(li);
    });
  }

  startFileTransfer() {
    if (this.selectedFiles.length === 0) {
      alert('Please select at least one file to send');
      return;
    }
    
    // Calculate total size
    this.totalFilesSize = this.selectedFiles.reduce((total, file) => total + file.size, 0);
    this.sentBytes = 0;
    this.currentFileIndex = 0;
    
    // Generate a unique ID for this sender
    this.transferId = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    this.senderIdInput.value = this.transferId;

    // Generate QR code for the connection ID
    QRCodeGenerator.createQRCode(this.qrcodeContainer, this.transferId);

    // Show connection section
    DOMUtils.getElement('#file-upload-section').classList.add('hidden');
    this.connectionSection.classList.remove('hidden');

    // Hide create offer button since we're using PeerJS
    if (this.createOfferBtn) {
        this.createOfferBtn.classList.add('hidden');
    }

    // Initialize Peer immediately
    this.initializeSenderPeer();
  }

  initializeSenderPeer() {
      // Use a fixed prefix + the 6 digit code for the Peer ID
      const peerId = `file-transfer-app-${this.transferId}`;
      this.peer = new Peer(peerId);

      this.peer.on('open', (id) => {
          console.log('My peer ID is: ' + id);
          this.statusText.textContent = 'Waiting for receiver to connect...';
      });

      this.peer.on('connection', (conn) => {
          this.conn = conn;
          this.statusText.textContent = 'Receiver connected!';
          this.setupSenderConnection(conn);
      });

      this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.statusText.textContent = 'Connection error: ' + err.type;
          alert('PeerJS Error: ' + err.type);
      });
  }

  setupSenderConnection(conn) {
      conn.on('open', () => {
          this.statusText.textContent = 'Connected! Sending files...';

          // Switch to progress view if not already there
           this.connectionSection.classList.add('hidden');
           this.progressSection.classList.remove('hidden');

          this.sendNextFile();
      });

      conn.on('close', () => {
         this.statusText.textContent = 'Connection closed.';
      });
  }

  copySenderId() {
    this.senderIdInput.select();
    document.execCommand('copy');
    alert('Connection ID copied to clipboard!');
  }

  // Deprecated but kept for UI binding compatibility, redirects to PeerJS logic if needed
  async createWebRtcOffer() {
      // With PeerJS, we don't need manual offer creation. The peer is initialized in startFileTransfer.
      // We can just show the progress section and wait.
      this.connectionSection.classList.add('hidden');
      this.progressSection.classList.remove('hidden');
  }

  sendNextFile() {
    if (this.currentFileIndex >= this.selectedFiles.length) {
      // All files sent
      if (this.conn) {
        // Keep connection open for a bit
        setTimeout(() => {
            alert('File transfer completed!');
        }, 500);
      }
      return;
    }

    const file = this.selectedFiles[this.currentFileIndex];
    this.statusText.textContent = `Sending: ${file.name}`;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Send file metadata
      this.conn.send({
        type: 'file_metadata',
        name: file.name,
        size: file.size,
        fileType: file.type
      });

      // Send actual file content in chunks
      const chunkSize = 16384; // 16KB chunks
      const content = event.target.result;
      let offset = 0;

      const sendChunk = () => {
        if (offset < content.byteLength) {
          const chunk = content.slice(offset, offset + chunkSize);
          this.conn.send({
              type: 'file_chunk',
              data: chunk
          });
          offset += chunkSize;

          // Update progress
          this.sentBytes += chunk.byteLength;
          // Guard against overflow if file size changed or logic error
          const safeSentBytes = Math.min(this.sentBytes, this.totalFilesSize);
          const progress = Math.round((safeSentBytes / this.totalFilesSize) * 100);
          this.transferProgress.value = progress;
          this.progressPercent.textContent = `${progress}%`;

          setTimeout(sendChunk, 0); // Yield to browser
        } else {
          // File completed, send delimiter
          this.conn.send({ type: 'file_end', name: file.name });
          this.currentFileIndex++;
          setTimeout(() => this.sendNextFile(), 100); // Small delay before next file
        }
      };

      sendChunk();
    };

    reader.readAsArrayBuffer(file);
  }

  connectToSender(senderId = null) {
    const id = senderId || this.receiverInput.value.trim();
    if (!id) {
      alert('Please enter a sender ID');
      return;
    }

    this.connectionStatus.textContent = 'Connecting to sender...';

    // Initialize Receiver Peer (random ID is fine)
    if (this.peer) {
        this.peer.destroy();
    }

    this.peer = new Peer(); // Auto-generate ID for receiver

    this.peer.on('open', () => {
        const connId = `file-transfer-app-${id}`;
        console.log(`Connecting to ${connId}...`);

        const conn = this.peer.connect(connId);
        this.conn = conn;

        conn.on('open', () => {
            console.log("Connected to sender");
            this.connectionStatus.textContent = 'Connected! Receiving files...';
             // Show reception section after a delay
            setTimeout(() => {
                this.receiverConnectionSection.classList.add('hidden');
                this.receptionSection.classList.remove('hidden');

                // Initialize progress
                this.receptionProgress.value = 0;
                this.receptionProgressPercent.textContent = '0%';
            }, 1000);
        });

        this.setupReceiverDataConnection(conn);

        conn.on('error', (err) => {
            console.error("Connection error:", err);
            this.connectionStatus.textContent = 'Connection failed. Check ID.';
        });
    });

    this.peer.on('error', (err) => {
        console.error('Peer error:', err);
        this.connectionStatus.textContent = 'Connection error: ' + err.type;
    });
  }

  setupReceiverDataConnection(conn) {
    let currentFileBuffer = [];
    let currentFileMetadata = null;
    let receivedBytes = 0;
    let totalExpectedBytes = 0;
    const receivedFiles = {}; // Store received file blobs by name

    conn.on('data', (data) => {
        // Check if data is an object (metadata/control) or chunk
        // PeerJS sends objects as JSON automatically if you send objects.
        // We structured our send to always be objects with 'type'

        if (data && data.type) {
            if (data.type === 'file_metadata') {
                // Start receiving a new file
                currentFileMetadata = {
                    name: data.name,
                    size: data.size,
                    type: data.fileType,
                    data: []
                };
                totalExpectedBytes = data.size;
                receivedBytes = 0;

                // Add to received files list
                const fileItem = DOMUtils.createElement('div', 'py-2 border-b border-gray-200 last:border-0');
                fileItem.id = `received-${data.name.replace(/[^a-zA-Z0-9]/g, '_')}`; // Sanitize ID
                fileItem.innerHTML = `
                    <div class="flex justify-between">
                    <span class="font-medium">${data.name}</span>
                    <span class="text-sm">${DOMUtils.formatFileSize(data.size)}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div class="file-progress bg-blue-600 h-1.5 rounded-full" style="width: 0%"></div>
                    </div>
                `;
                this.receivedFilesList.appendChild(fileItem);

            } else if (data.type === 'file_chunk') {
                 if (currentFileMetadata) {
                    currentFileMetadata.data.push(data.data);

                    // Update progress
                    receivedBytes += data.data.byteLength;
                    const progress = totalExpectedBytes > 0 ? Math.round((receivedBytes / totalExpectedBytes) * 100) : 0;

                    // Update overall progress (simplified for single file per visual, but works generally)
                    this.receptionProgress.value = progress;
                    this.receptionProgressPercent.textContent = `${progress}%`;

                    // Update file-specific progress
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
                // File reception completed
                if (currentFileMetadata) {
                    // Create file from accumulated data
                    const fileBlob = new Blob(currentFileMetadata.data);

                    // Store the blob for later download
                    receivedFiles[currentFileMetadata.name] = {
                        blob: fileBlob,
                        size: currentFileMetadata.size,
                        type: currentFileMetadata.type
                    };

                    // Finalize UI for this file
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

      // Store received files for later access
      window.receivedFiles = receivedFiles;
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
            this.connectToSender();
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

  downloadAllReceivedFiles() {
    if (!window.receivedFiles) {
      alert('No files received yet.');
      return;
    }

    // Download each received file
    Object.keys(window.receivedFiles).forEach(fileName => {
      const fileData = window.receivedFiles[fileName];
      const blob = fileData.blob;

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });

    alert('Files downloaded successfully!');
  }

  resetApp() {
    // Reset all states
    this.selectedFiles = [];
    this.transferId = null;
    this.senderUploadInput.value = '';
    this.selectedFilesInfo.classList.add('hidden');
    this.connectionSection.classList.add('hidden');
    this.progressSection.classList.add('hidden');
    DOMUtils.getElement('#file-upload-section').classList.remove('hidden');
    this.senderApp.classList.add('hidden');
    this.receiverApp.classList.add('hidden');
    this.modeSelector.classList.remove('hidden');

    // Reset receiver state
    this.receiverConnectionSection.classList.remove('hidden');
    this.receptionSection.classList.add('hidden');
    this.receivedFilesList.innerHTML = '';
    this.downloadAllReceivedBtn.classList.add('hidden');
    this.connectionStatus.textContent = '';

    // Clean up Peer connection
    if (this.peer) {
        this.peer.destroy();
        this.peer = null;
    }
    this.conn = null;
  }

  init() {
    // Check URL parameters for receiver mode
    const urlParams = new URLSearchParams(window.location.search);
    const senderId = urlParams.get('connect');

    if (senderId) {
        this.receiverInput.value = senderId;

        // Switch to receiver mode
        this.modeSelector.classList.add('hidden');
        this.senderApp.classList.add('hidden');
        this.receiverApp.classList.remove('hidden');

        // Auto connect after a short delay
        setTimeout(() => {
          this.connectToSender(senderId);
        }, 1000);
    }
  }
}
