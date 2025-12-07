import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Base directory for file downloads
const BASE_DOWNLOAD_DIR = '/sdcard/Download/ADM';

// Route to download files based on :file_direction parameter
app.get('/:file_direction', (req, res) => {
  const fileDirection = req.params.file_direction;

  // Construct the file path by joining the base directory with the parameter
  const filePath = path.join(BASE_DOWNLOAD_DIR, fileDirection);

  // Resolve the path to prevent directory traversal attacks
  const resolvedFilePath = path.resolve(filePath);
  const resolvedBaseDir = path.resolve(BASE_DOWNLOAD_DIR);

  // Check if the resolved file path is within the allowed directory
  if (!resolvedFilePath.startsWith(resolvedBaseDir + path.sep) && resolvedFilePath !== resolvedBaseDir) {
    return res.status(403).send('Access forbidden');
  }

  // Check if file exists
  if (fs.existsSync(resolvedFilePath) && fs.lstatSync(resolvedFilePath).isFile()) {
    const fileName = path.basename(resolvedFilePath);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = fs.createReadStream(resolvedFilePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('File not found');
  }
});

// Handle errors during file streaming
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Downloads allowed only from: ${BASE_DOWNLOAD_DIR}`);
});