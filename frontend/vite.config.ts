import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    sveltekit(),
    basicSsl(),
    Icons({
      compiler: 'svelte'
    })
  ],
  server: {
    fs: {
      allow: ['..']
    }
  }
});
