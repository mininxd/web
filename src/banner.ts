import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const isDev = !fs.existsSync(path.join(__dirname, '../dist'));

const line = '───────────────────────────────────────────────────────';

// ANSI helpers
const bold = '\u001b[1m';
const reset = '\u001b[0m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const cyan = '\u001b[36m';

export const dev = `
${cyan}${line}${reset}
${red}${bold}${'🚀 [ IN DEVELOPMENT MODE ]'.padStart(37)}${reset}

${yellow}${'Build to enter Production Mode'.padStart(39)}${reset}
${cyan}${line}${reset}
`;

export const prod = `
${cyan}${line}${reset}
${green}${bold}${'✅ [ IN PRODUCTION MODE ]'.padStart(37)}${reset}

${yellow}${'Delete dist/ folder to enter Development Mode'.padStart(48)}${reset}
${cyan}${line}${reset}
`;
