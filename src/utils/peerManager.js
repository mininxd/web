export class PeerManager {
  constructor() {
    this.peer = null;
    this.conn = null;
  }

  initializeSenderPeer(transferId, onOpen, onConnection, onError) {
    const peerId = `file-transfer-app-${transferId}`;
    this.peer = new Peer(peerId);

    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      onOpen(id);
    });

    this.peer.on('connection', (conn) => {
      this.conn = conn;
      onConnection(conn);
    });

    this.peer.on('error', (err) => {
      console.error('Peer error:', err);
      onError(err);
    });
  }

  initializeReceiverPeer(onOpen, onError) {
    if (this.peer) {
      this.peer.destroy();
    }

    this.peer = new Peer();

    this.peer.on('open', onOpen);
    this.peer.on('error', (err) => {
      console.error('Peer error:', err);
      onError(err);
    });
  }

  connectToSender(senderId, onConnectionOpen, onError) {
    if (!this.peer) return;

    const connId = `file-transfer-app-${senderId}`;
    console.log(`Connecting to ${connId}...`);

    const conn = this.peer.connect(connId);
    this.conn = conn;

    conn.on('open', onConnectionOpen);
    conn.on('error', (err) => {
      console.error('Connection error:', err);
      onError(err);
    });

    return conn;
  }

  destroy() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.conn = null;
  }

  isConnected() {
    return this.conn && this.conn.open;
  }
}
