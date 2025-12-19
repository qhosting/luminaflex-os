import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del sistema (Easypanel) para que estén disponibles durante el build
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Inyecta process.env para compatibilidad con el código actual y el SDK de Gemini
      'process.env': env
    },
    server: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Optimización de chunks para producción industrial
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'icons': ['lucide-react'],
            'ai-engine': ['@google/genai']
          }
        }
      }
    }
  };
});