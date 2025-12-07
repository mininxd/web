import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    https: {
      cert: readFileSync('/etc/letsencrypt/live/dns.mininxd.xyz/fullchain.pem'),
      key: readFileSync('/etc/letsencrypt/live/dns.mininxd.xyz/privkey.pem'),
    },
  },
});
