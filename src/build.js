import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const projectRoot = path.resolve(__dirname, '..');

const swaggerDir = path.join(projectRoot, 'swagger');
const basePath = path.join(swaggerDir, 'index.json');
const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

const allPaths = {};

fs.readdirSync(swaggerDir).forEach((file) => {
  const filePath = path.join(swaggerDir, file);
  if (
    fs.statSync(filePath).isFile() &&
    file.endsWith('.json') &&
    file !== 'index.json'
  ) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    Object.assign(allPaths, jsonData);
  }
});

base.paths = allPaths;

console.log(base);

const distDir = path.join(projectRoot, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(
  path.join(distDir, 'openapi-min.json'),
  JSON.stringify(base)
);
