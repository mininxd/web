import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'list-all-files',
      configureServer(server) {
        server.middlewares.use('/allFiles', (req, res, next) => {
          const root = path.resolve(__dirname);
          fs.readdir(root, (err, files) => {
            if (err) {
              res.statusCode = 500;
              res.end('Error reading files');
              return;
            }
            const filteredFiles = files.filter(file => !['node_modules', '.git'].includes(file));
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(filteredFiles));
          });
        });
      }
    }
  ],
})