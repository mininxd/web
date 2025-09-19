import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_DIR = path.join(__dirname, 'img'); // folder img

const app = express();
app.use(cors());
const port = 3000;

// --- Rute untuk mengkompres dan men-download file PNG dari folder img ---
app.get('/download', (req, res) => {
  const archiveName = `${uuidv4().slice(0,8)}.zip`;
  res.attachment(archiveName);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.pipe(res);

  // Mengakses file di folder img
  fs.readdir(IMAGE_DIR, (err, files) => {
    if (err) {
      console.error('Gagal membaca direktori:', err);
      return res.status(500).send('Terjadi kesalahan pada server.');
    }

    // Filter hanya file .png (case-insensitive)
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

    if (pngFiles.length === 0) {
      return res.status(404).send('Tidak ada file .png yang ditemukan di folder img.');
    }

    pngFiles.forEach(file => {
      const filePath = path.join(IMAGE_DIR, file);
      archive.file(filePath, { name: file });
    });

    archive.finalize();
  });
});

// --- Rute list semua file PNG ---
app.get('/allFiles', (req, res) => {
  fs.readdir(IMAGE_DIR, (err, files) => {
    if (err) {
      console.error('Gagal membaca direktori:', err);
      return res.status(500).send('Terjadi kesalahan pada server.');
    }

    // Filter hanya file .png (case-insensitive)
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
    const result = pngFiles.length === 0 ? [] : [...pngFiles];

    res.json(result);
  });
});

// --- Rute download file PNG tunggal ---
app.get('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(IMAGE_DIR, filename);

  res.download(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).send('File tidak ditemukan.');
      } else {
        res.status(500).send('Terjadi kesalahan pada server.');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
