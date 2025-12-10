import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 關鍵：強制綁定到 IPv4 的 127.0.0.1
    port: 5173,        // 指定 Port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 後端的真實位置 (雲端內部)
        changeOrigin: true,
        secure: false,
      },
    },
  },
})