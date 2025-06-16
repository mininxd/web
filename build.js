import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const swaggerDir = path.join(__dirname, 'swagger')
const basePath = new URL('./swagger/index.json', import.meta.url)
const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'))

const allPaths = {}

fs.readdirSync(swaggerDir).forEach(file => {
  const filePath = path.join(swaggerDir, file)
  if (
    fs.statSync(filePath).isFile() &&
    file.endsWith('.json') &&
    file !== 'index.json'
  ) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    Object.assign(allPaths, jsonData)
  }
})

base.paths = allPaths

console.log(base)
fs.mkdirSync('./dist', { recursive: true })
fs.writeFileSync(
  './dist/openapi-min.json',
  JSON.stringify(base)
)