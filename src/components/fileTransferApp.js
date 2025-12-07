import { DOMUtils } from '../utils/dom.js';
import { PeerManager } from '../utils/peerManager.js';
import { SenderMode } from './senderMode.js';
import { ReceiverMode } from './receiverMode.js';

export class FileTransferApp {
  constructor() {
    this.peerManager = new PeerManager();
    this.senderMode = new SenderMode(this.peerManager);
    this.receiverMode = new ReceiverMode(this.peerManager);

    this.initializeElements();
    this.senderMode.initializeElements();
    this.receiverMode.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.modeSelector = DOMUtils.getElement('#mode-selector');
    this.senderModeBtn = DOMUtils.getElement('#sender-mode-btn');
    this.receiverModeBtn = DOMUtils.getElement('#receiver-mode-btn');
    this.senderHomeBtn = DOMUtils.getElement('#sender-home-btn');
    this.receiverHomeBtn = DOMUtils.getElement('#receiver-home-btn');
  }

  bindEvents() {
    if (this.senderModeBtn) {
      this.senderModeBtn.addEventListener('click', this.showSenderMode.bind(this));
    }
    if (this.receiverModeBtn) {
      this.receiverModeBtn.addEventListener('click', this.showReceiverMode.bind(this));
    }
    if (this.senderHomeBtn) {
      this.senderHomeBtn.addEventListener('click', this.resetApp.bind(this));
    }
    if (this.receiverHomeBtn) {
      this.receiverHomeBtn.addEventListener('click', this.resetApp.bind(this));
    }

    this.senderMode.bindEvents(
      this.senderMode.handleFileSelection.bind(this.senderMode),
      this.senderMode.startTransfer.bind(this.senderMode),
      this.senderMode.copySenderId.bind(this.senderMode),
      () => {
        this.senderMode.connectionSection.classList.add('hidden');
        this.senderMode.progressSection.classList.remove('hidden');
      }
    );

    this.receiverMode.bindEvents(
      () => this.receiverMode.connect(),
      () => this.receiverMode.scanQRCode(),
      () => this.receiverMode.downloadAllFiles()
    );
  }

  showSenderMode() {
    this.modeSelector.classList.add('hidden');
    this.senderMode.show();
    this.receiverMode.hide();
  }

  showReceiverMode() {
    this.modeSelector.classList.add('hidden');
    this.senderMode.hide();
    this.receiverMode.show();
  }

  resetApp() {
    this.senderMode.reset();
    this.receiverMode.reset();
    this.modeSelector.classList.remove('hidden');
    this.senderMode.hide();
    this.receiverMode.hide();

    this.peerManager.destroy();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const senderId = urlParams.get('connect');

    if (senderId) {
      this.receiverMode.receiverInput.value = senderId;
      this.modeSelector.classList.add('hidden');
      this.senderMode.hide();
      this.receiverMode.show();

      setTimeout(() => {
        this.receiverMode.connect();
      }, 1000);
    }
  }
}
