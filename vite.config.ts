import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This maps both potential names to the app
    'process.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
    'process.env.VITEGEMINIAPIKEY': JSON.stringify(process.env.VITEGEMINIAPIKEY)
  }
});