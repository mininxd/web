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

  static async downloadMultipleFilesAsZip(filesMap) {
    const zip = new JSZip();

    // Add each file to the zip
    Object.keys(filesMap).forEach(fileName => {
      const fileData = filesMap[fileName];
      zip.file(fileName, fileData.blob);
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Download the zip file
    this.downloadFile(content, 'received_files.zip');
  }

  static downloadMultipleFiles(filesMap) {
    Object.keys(filesMap).forEach(fileName => {
      const fileData = filesMap[fileName];
      this.downloadFile(fileData.blob, fileName);
    });
  }
}
