import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    server: {
      open: true,
      // port: 88,
      // strictPort: true,
      // host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          secure: false, // 允许自签名证书
        },
        '/socket.io': {
          target: env.VITE_WS_BASE_URL,
          ws: true,
          changeOrigin: true,
          secure: false, // 允许自签名证书
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})