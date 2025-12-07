import { DOMUtils } from './dom.js';

export class FileOperations {
  static formatFileSize(size) {
    return DOMUtils.formatFileSize(size);
  }

  static sendFileInChunks(conn, file, onProgress) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        conn.send({
          type: 'file_metadata',
          name: file.name,
          size: file.size,
          fileType: file.type
        });

        const chunkSize = 16384;
        const content = event.target.result;
        let offset = 0;
        let sentBytes = 0;

        const sendChunk = () => {
          if (offset < content.byteLength) {
            const chunk = content.slice(offset, offset + chunkSize);
            conn.send({
              type: 'file_chunk',
              data: chunk
            });
            offset += chunkSize;
            sentBytes += chunk.byteLength;

            if (onProgress) {
              onProgress(sentBytes);
            }

            setTimeout(sendChunk, 0);
          } else {
            conn.send({ type: 'file_end', name: file.name });
            resolve();
          }
        };

        sendChunk();
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  static downloadFile(blob, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  static generateUUID() {
    // Generate a UUID using the crypto API or fallback to a simple string
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Use crypto API for better randomness
      const buffer = new Uint8Array(16);
      crypto.getRandomValues(buffer);

      // Set version (4) and variant bits
      buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
      buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10

      // Convert to hex string with proper formatting
      const hex = Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      return [
        hex.substr(0, 8),
        hex.substr(8, 4),
        hex.substr(12, 4),
        hex.substr(16, 4),
        hex.substr(20, 12)
      ].join('-');
    } else {
      // Fallback to Math.random if crypto API is not available
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

  static async downloadMultipleFilesAsZip(filesMap) {
    // Check if JSZip is available
    if (typeof JSZip === 'undefined') {
      console.error('JSZip library not loaded. Please ensure it is included in the HTML.');
      alert('Error: JSZip library not loaded. Cannot create zip file.');
      return;
    }

    try {
      const zip = new JSZip();

      // Add each file to the zip
      Object.keys(filesMap).forEach(fileName => {
        const fileData = filesMap[fileName];
        zip.file(fileName, fileData.blob);
      });

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });

      // Create a unique filename using UUID
      const uuid = this.generateUUID();
      const zipFilename = `received_files_${uuid}.zip`;

      // Download the zip file
      this.downloadFile(content, zipFilename);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Error: Could not create zip file. Please try again.');
    }
  }

  static downloadMultipleFiles(filesMap) {
    Object.keys(filesMap).forEach(fileName => {
      const fileData = filesMap[fileName];
      this.downloadFile(fileData.blob, fileName);
    });
  }
}
