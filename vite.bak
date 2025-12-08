import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  server: {
    https: {
      cert: '/etc/letsencrypt/live/dns.mininxd.xyz/fullchain.pem',
      key: '/etc/letsencrypt/live/dns.mininxd.xyz/privkey.pem'
    },
    host: true,
    port: 443
  }
});
