import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Base URL para los archivos estáticos
  build: {
    outDir: "dist", // Directorio de salida
  },
})
