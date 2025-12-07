// src/components/fileTransfer.js
import { DOMUtils } from '../utils/dom.js';
import { WebRTCConnection } from '../webrtc/connection.js';
import { QRCodeGenerator } from '../utils/qrcode.js';

export class FileTransferApp {
  constructor() {
    this.selectedFiles = [];
    this.transferId = null;
    this.totalFilesSize = 0;
    this.sentBytes = 0;
    this.currentFileIndex = 0;
    this.peerConnection = null;
    this.dataChannel = null;
    
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

    if (this.connectBtn) this.connectBtn.addEventListener('click', this.connectToSender.bind(this));
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
  }

  copySenderId() {
    this.senderIdInput.select();
    document.execCommand('copy');
    alert('Connection ID copied to clipboard!');
  }

  async createWebRtcOffer() {
    const webrtc = new WebRTCConnection();

    try {
      // Create the connection first
      webrtc.createConnection();

      // Then create data channel
      const dataChannel = webrtc.createDataChannel('fileTransfer', { ordered: true });
      this.setupDataChannel(dataChannel);

      // Store the connections
      this.peerConnection = webrtc.getPeerConnection();
      this.dataChannel = webrtc.getDataChannel();

      // Create offer
      const offer = await webrtc.createOffer();

      // Prepare connection info to share
      const connectionInfo = {
        offer: this.peerConnection.localDescription,
        senderId: this.transferId,
        fileInfo: this.selectedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };

      // Store in localStorage for receiver to access
      localStorage.setItem(`connection_${this.transferId}`, JSON.stringify(connectionInfo));

      // Show progress section and start waiting for connection
      this.connectionSection.classList.add('hidden');
      this.progressSection.classList.remove('hidden');

      // Update status
      this.statusText.textContent = 'Connection created! Waiting for receiver to connect...';
    } catch (err) {
      console.error('Error creating offer:', err);
      alert('Error creating connection offer. Check console for details.');
    }
  }

  setupDataChannel(channel) {
    channel.onopen = () => {
      this.statusText.textContent = 'Connected! Sending files...';
      this.sendNextFile();
    };

    channel.onclose = () => {
      this.statusText.textContent = 'Connection closed.';
      setTimeout(() => {
        alert('File transfer completed!');
      }, 500);
    };

    channel.onerror = (err) => {
      console.error('Data channel error:', err);
      this.statusText.textContent = 'Error occurred during transfer.';
    };
  }

  sendNextFile() {
    if (this.currentFileIndex >= this.selectedFiles.length) {
      // All files sent
      if (this.dataChannel) {
        this.dataChannel.close();
      }
      return;
    }

    const file = this.selectedFiles[this.currentFileIndex];
    this.statusText.textContent = `Sending: ${file.name}`;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Send file metadata
      this.dataChannel.send(JSON.stringify({
        type: 'file_metadata',
        name: file.name,
        size: file.size,
        type: file.type
      }));

      // Send actual file content in chunks
      const chunkSize = 16384; // 16KB chunks
      const content = event.target.result;
      let offset = 0;

      const sendChunk = () => {
        if (offset < content.byteLength) {
          const chunk = content.slice(offset, offset + chunkSize);
          this.dataChannel.send(chunk);
          offset += chunkSize;

          // Update progress
          this.sentBytes += chunk.byteLength;
          const progress = Math.round((this.sentBytes / this.totalFilesSize) * 100);
          this.transferProgress.value = progress;
          this.progressPercent.textContent = `${progress}%`;

          setTimeout(sendChunk, 0); // Yield to browser
        } else {
          // File completed, send delimiter
          this.dataChannel.send(JSON.stringify({ type: 'file_end', name: file.name }));
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

    // Try to get connection info from localStorage (simulating signaling server)
    const connectionInfoStr = localStorage.getItem(`connection_${id}`);
    if (!connectionInfoStr) {
      this.connectionStatus.textContent = 'Connection not found or expired';
      return;
    }

    const connectionInfo = JSON.parse(connectionInfoStr);
    if (!connectionInfo.offer) {
      this.connectionStatus.textContent = 'Invalid connection information';
      return;
    }

    // Initialize WebRTC connection
    const webrtc = new WebRTCConnection();
    this.peerConnection = webrtc.getPeerConnection();

    // Setup data channel event handlers
    this.peerConnection.ondatachannel = (event) => {
      this.setupReceiverDataChannel(event.channel);
    };

    try {
      // Set remote description
      webrtc.createAnswer(connectionInfo.offer)
        .then(() => {
          this.connectionStatus.textContent = 'Connected! Receiving files...';

          // Show reception section after a delay
          setTimeout(() => {
            this.receiverConnectionSection.classList.add('hidden');
            this.receptionSection.classList.remove('hidden');

            // Initialize progress
            this.receptionProgress.value = 0;
            this.receptionProgressPercent.textContent = '0%';
          }, 1000);
        })
        .catch(err => {
          console.error('Error connecting:', err);
          this.connectionStatus.textContent = 'Connection error';
        });
    } catch (err) {
      console.error('Error connecting:', err);
      this.connectionStatus.textContent = 'Connection error';
    }
  }

  setupReceiverDataChannel(channel) {
    let currentFileBuffer = [];
    let currentFileMetadata = null;
    let receivedBytes = 0;
    let totalExpectedBytes = 0;
    const receivedFiles = {}; // Store received file blobs by name

    channel.onopen = () => {
      this.connectionStatus.textContent = 'Connected! Receiving files...';
    };

    channel.onmessage = (event) => {
      if (typeof event.data === 'string') {
        // It's metadata or control message
        const message = JSON.parse(event.data);

        if (message.type === 'file_metadata') {
          // Start receiving a new file
          currentFileMetadata = {
            name: message.name,
            size: message.size,
            type: message.type,
            data: []
          };
          totalExpectedBytes = message.size;
          receivedBytes = 0;

          // Add to received files list
          const fileItem = DOMUtils.createElement('div', 'py-2 border-b border-gray-200 last:border-0');
          fileItem.id = `received-${message.name}`;
          fileItem.innerHTML = `
            <div class="flex justify-between">
              <span class="font-medium">${message.name}</span>
              <span class="text-sm">${DOMUtils.formatFileSize(message.size)}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div class="file-progress bg-blue-600 h-1.5 rounded-full" style="width: 0%"></div>
            </div>
          `;
          this.receivedFilesList.appendChild(fileItem);
        } else if (message.type === 'file_end') {
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

            // Update progress for this file to 100%
            const fileItem = DOMUtils.getElement(`#received-${currentFileMetadata.name}`);
            if (fileItem) {
              const progressBar = fileItem.querySelector('.file-progress');
              if (progressBar) {
                progressBar.style.width = '100%';
              }
            }

            currentFileMetadata = null;
            currentFileBuffer = [];
          }
        }
      } else {
        // It's binary data
        const chunk = event.data;
        if (currentFileMetadata) {
          currentFileMetadata.data.push(chunk);

          // Update progress
          receivedBytes += chunk.byteLength;
          const progress = Math.round((receivedBytes / totalExpectedBytes) * 100);

          // Update overall progress
          const overallProgress = Math.round((receivedBytes / totalExpectedBytes) * 100);
          this.receptionProgress.value = overallProgress;
          this.receptionProgressPercent.textContent = `${overallProgress}%`;

          // Update file-specific progress
          const fileItem = DOMUtils.getElement(`#received-${currentFileMetadata.name}`);
          if (fileItem) {
            const progressBar = fileItem.querySelector('.file-progress');
            if (progressBar) {
              progressBar.style.width = `${progress}%`;
            }
          }
        }
      }
    };

    channel.onclose = () => {
      this.connectionStatus.textContent = 'Transfer completed.';
      this.downloadAllReceivedBtn.classList.remove('hidden');

      // Store received files for later access
      window.receivedFiles = receivedFiles;
    };

    channel.onerror = (err) => {
      console.error('Data channel error:', err);
      this.connectionStatus.textContent = 'Error occurred during transfer.';
    };
  }

  scanQRCode() {
    // Simulated QR scanner - in a real app, this would use a camera
    const qrCodeContent = prompt('Enter the text from the QR code (sender ID):');
    if (qrCodeContent) {
      this.receiverInput.value = qrCodeContent.trim();
      this.connectToSender(qrCodeContent.trim());
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

    // Clean up WebRTC connections if they exist
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
  }

  init() {
    // Check URL for receiver mode
    const path = window.location.pathname;
    if (path.startsWith('/connect/')) {
      // Extract sender ID from URL
      const pathParts = path.split('/');
      if (pathParts.length >= 3 && pathParts[2]) {
        const senderId = pathParts[2];
        this.receiverInput.value = senderId;

        // Switch to receiver mode and connect
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
}