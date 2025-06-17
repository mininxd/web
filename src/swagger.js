import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDir = path.join(__dirname, "../swagger");
const basePath = new URL("../swagger/index.json", import.meta.url);
const base = JSON.parse(fs.readFileSync(basePath, "utf-8"));

const allPaths = {};

fs.readdirSync(swaggerDir).forEach((file) => {
  const filePath = path.join(swaggerDir, file);
  if (
    fs.statSync(filePath).isFile() &&
    file.endsWith(".json") &&
    file !== "index.json"
  ) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    Object.assign(allPaths, jsonData);
  }
});

base.paths = allPaths;

export default base;
