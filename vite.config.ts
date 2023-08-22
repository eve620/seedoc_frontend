import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api': "https://seedoc.xidian.edu.cn/"
      '/api': "http://localhost:9090"
    }
  }
})
