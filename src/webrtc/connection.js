// src/webrtc/connection.js
export class WebRTCConnection {
  constructor(config) {
    this.config = config || {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    this.peerConnection = null;
    this.dataChannel = null;
  }

  createConnection() {
    this.peerConnection = new RTCPeerConnection(this.config);
    return this.peerConnection;
  }

  createDataChannel(label, options = { ordered: true }) {
    if (!this.peerConnection) {
      this.createConnection();
    }
    this.dataChannel = this.peerConnection.createDataChannel(label, options);
    return this.dataChannel;
  }

  async createOffer() {
    if (!this.peerConnection) {
      this.createConnection();
    }

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(offer) {
    if (!this.peerConnection) {
      this.createConnection();
    }
    
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  close() {
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }

  getPeerConnection() {
    return this.peerConnection;
  }

  getDataChannel() {
    return this.dataChannel;
  }
}