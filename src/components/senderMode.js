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
      this.selectedFiles = Array.from(event.target.files);
      this.showSelectedFiles();
      this.selectedFilesInfo.classList.remove('hidden');
    }
  }

  showSelectedFiles() {
    this.selectedFilesList.innerHTML = '';

    this.selectedFiles.forEach((file) => {
      const li = DOMUtils.createElement('li', 'py-1 border-b border-gray-200 last:border-0');
      li.innerHTML = `
        <div class="flex justify-between">
          <span class="truncate max-w-xs">${file.name}</span>
          <span class="text-sm text-gray-500">${FileOperations.formatFileSize(file.size)}</span>
        </div>
      `;
      this.selectedFilesList.appendChild(li);
    });
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
      this.statusText.textContent = 'Connected! Sending files...';
      this.connectionSection.classList.add('hidden');
      this.progressSection.classList.remove('hidden');
      this.sendNextFile();
    });

    conn.on('close', () => {
      this.statusText.textContent = 'Connection closed.';
    });
  }

  async sendNextFile() {
    if (this.currentFileIndex >= this.selectedFiles.length) {
      console.log('File transfer completed!');
      return;
    }

    const file = this.selectedFiles[this.currentFileIndex];
    this.statusText.textContent = `Sending: ${file.name}`;

    try {
      await FileOperations.sendFileInChunks(
        this.peerManager.conn,
        file,
        (sentBytes) => {
          this.sentBytes = sentBytes;
          const safeSentBytes = Math.min(this.sentBytes, this.totalFilesSize);
          const progress = Math.round((safeSentBytes / this.totalFilesSize) * 100);
          this.transferProgress.value = progress;
          this.progressPercent.textContent = `${progress}%`;
        }
      );

      this.currentFileIndex++;
      setTimeout(() => this.sendNextFile(), 100);
    } catch (error) {
      console.error('Error sending file:', error);
      this.statusText.textContent = 'Error sending file';
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
