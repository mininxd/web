import { DOMUtils } from '../utils/dom.js';
import { QRCodeGenerator } from '../utils/qrcode.js';
import { FileOperations } from '../utils/fileOperations.js';

export class SenderMode {
  constructor(peerManager) {
    this.peerManager = peerManager;
    this.selectedFiles = [];
    this.transferId = null;
    this.totalFilesSize = 0;
    this.sentBytes = 0;
    this.currentFileIndex = 0;
    this.isConnectionActive = false;
  }

  initializeElements() {
    this.senderApp = DOMUtils.getElement('#sender-app');
    this.uploadInput = DOMUtils.getElement('#sender-upload-input');
    this.selectedFilesInfo = DOMUtils.getElement('#selected-files-info');
    this.selectedFilesList = DOMUtils.getElement('#selected-files-list');
    this.startSendBtn = DOMUtils.getElement('#start-send-btn');
    this.connectionSection = DOMUtils.getElement('#connection-section');
    this.senderIdInput = DOMUtils.getElement('#sender-id');
    this.copySenderIdBtn = DOMUtils.getElement('#copy-sender-id');
    this.qrcodeContainer = DOMUtils.getElement('#qrcode-container');
    this.progressSection = DOMUtils.getElement('#progress-section');
    this.transferProgress = DOMUtils.getElement('#transfer-progress');
    this.progressPercent = DOMUtils.getElement('#progress-percent');
    this.statusText = DOMUtils.getElement('#status-text');
    this.createOfferBtn = DOMUtils.getElement('#create-offer-btn');
  }

  bindEvents(onFileSelect, onStartTransfer, onCopyId, onCreateOffer) {
    if (this.uploadInput) {
      this.uploadInput.addEventListener('change', onFileSelect);
    }
    if (this.startSendBtn) {
      this.startSendBtn.addEventListener('click', onStartTransfer);
    }
    if (this.copySenderIdBtn) {
      this.copySenderIdBtn.addEventListener('click', onCopyId);
    }
    if (this.createOfferBtn) {
      this.createOfferBtn.addEventListener('click', onCreateOffer);
    }
  }

  handleFileSelection(event) {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      // Add new files to the existing selected files (don't replace them)
      const newFiles = Array.from(event.target.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.showSelectedFiles();
      this.selectedFilesInfo.classList.remove('hidden');
    }
    // Reset the input to allow re-selection of the same file
    event.target.value = '';
  }

  showSelectedFiles() {
    this.selectedFilesList.innerHTML = '';

    this.selectedFiles.forEach((file, index) => {
      const li = DOMUtils.createElement('li', 'py-1 border-b border-gray-200 last:border-0 flex justify-between items-center');
      li.innerHTML = `
        <div class="flex-1 truncate mr-2">
          <span class="truncate max-w-xs">${file.name}</span>
          <div class="text-sm text-gray-500">${FileOperations.formatFileSize(file.size)}</div>
        </div>
        <button class="remove-file-btn btn btn-xs btn-outline" data-index="${index}" title="Remove file">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      `;
      this.selectedFilesList.appendChild(li);
    });

    // Add event listeners to the remove buttons
    this.selectedFilesList.querySelectorAll('.remove-file-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const index = parseInt(event.currentTarget.getAttribute('data-index'));
        this.removeFile(index);
      });
    });
  }

  removeFile(index) {
    if (index >= 0 && index < this.selectedFiles.length) {
      // Remove the file from the selected files array
      this.selectedFiles.splice(index, 1);

      // Update the UI to reflect the change
      this.showSelectedFiles();

      // Hide the selected files info section if no files are left
      if (this.selectedFiles.length === 0) {
        this.selectedFilesInfo.classList.add('hidden');
      }
    }
  }

  startTransfer() {
    if (this.selectedFiles.length === 0) {
      console.log('Please select at least one file to send');
      return;
    }

    this.totalFilesSize = this.selectedFiles.reduce((total, file) => total + file.size, 0);
    this.sentBytes = 0;
    this.currentFileIndex = 0;

    this.transferId = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
    this.senderIdInput.value = this.transferId;

    QRCodeGenerator.createQRCode(this.qrcodeContainer, this.transferId);

    DOMUtils.getElement('#file-upload-section').classList.add('hidden');
    this.connectionSection.classList.remove('hidden');

    if (this.createOfferBtn) {
      this.createOfferBtn.classList.add('hidden');
    }

    this.initializePeer();
  }

  initializePeer() {
    this.peerManager.initializeSenderPeer(
      this.transferId,
      () => {
        this.statusText.textContent = 'Waiting for receiver to connect...';
      },
      (conn) => {
        this.statusText.textContent = 'Receiver connected!';
        this.setupConnection(conn);
      },
      (err) => {
        this.statusText.textContent = 'Connection error: ' + err.type;
        console.log('PeerJS Error: ' + err.type);
      }
    );
  }

  setupConnection(conn) {
    conn.on('open', () => {
      this.isConnectionActive = true;
      this.statusText.textContent = 'Connected! Sending files...';
      this.connectionSection.classList.add('hidden');
      this.progressSection.classList.remove('hidden');
      this.sendNextFile();
    });

    conn.on('close', () => {
      this.isConnectionActive = false;
      this.statusText.textContent = 'Connection closed.';
    });

    conn.on('error', (err) => {
      this.isConnectionActive = false;
      console.error('Connection error:', err);
      this.statusText.textContent = 'Connection error: ' + (err.message || 'Unknown error');
    });
  }

  async sendNextFile() {
    if (this.currentFileIndex >= this.selectedFiles.length) {
      console.log('File transfer completed!');
      // Ensure progress shows 100% when all files are sent
      this.transferProgress.value = 100;
      this.progressPercent.textContent = '100%';
      this.statusText.textContent = 'Transfer completed!';
      return;
    }

    const file = this.selectedFiles[this.currentFileIndex];
    this.statusText.textContent = `Sending: ${file.name}`;

    // Calculate the base offset (bytes from previously sent files)
    let baseOffset = 0;
    for (let i = 0; i < this.currentFileIndex; i++) {
      baseOffset += this.selectedFiles[i].size;
    }

    try {
      await FileOperations.sendFileInChunks(
        this.peerManager.conn,
        file,
        (bytesForCurrentFile) => {
          // Calculate total bytes sent across all files
          const totalBytesSent = baseOffset + bytesForCurrentFile;
          // Ensure we don't exceed the total file size
          const safeTotalBytes = Math.min(totalBytesSent, this.totalFilesSize);
          const progress = Math.round((safeTotalBytes / this.totalFilesSize) * 100);

          this.transferProgress.value = progress;
          this.progressPercent.textContent = `${progress}%`;
        },
        () => !this.isConnectionActive // Check if connection is cancelled
      );

      this.currentFileIndex++;
      setTimeout(() => this.sendNextFile(), 100);
    } catch (error) {
      console.error('Error sending file:', error);
      if (error.message === 'Connection closed' || error.message === 'Connection closed before finishing' || error.message === 'Transfer stopped') {
        this.statusText.textContent = 'Transfer stopped: Connection closed';
      } else {
        this.statusText.textContent = 'Error sending file: ' + error.message;
      }
      // Stop the transfer loop
      return;
    }
  }

  copySenderId() {
    this.senderIdInput.select();
    this.senderIdInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    console.log('Connection ID copied to clipboard!');
  }

  show() {
    this.senderApp.classList.remove('hidden');
  }

  hide() {
    this.senderApp.classList.add('hidden');
  }

  reset() {
    this.selectedFiles = [];
    this.transferId = null;
    this.uploadInput.value = '';
    this.selectedFilesInfo.classList.add('hidden');
    this.connectionSection.classList.add('hidden');
    this.progressSection.classList.add('hidden');
    DOMUtils.getElement('#file-upload-section').classList.remove('hidden');
  }
}
