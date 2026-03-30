import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'path';
 
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appUrl = env.APP_URL || env.VITE_APP_URL;
  let parsedAppUrl: URL | null = null;
 
  if (appUrl) {
    try {
      parsedAppUrl = new URL(appUrl);
    } catch {
      parsedAppUrl = null;
    }
  }
 
  const host = env.VITE_HOST || parsedAppUrl?.hostname || 'laboratorio-de-textil-uat.test';
  const devHttps =
    env.VITE_DEV_HTTPS === 'true' || parsedAppUrl?.protocol === 'https:';
 
  const valetKey = `${os.homedir()}/.config/valet/Certificates/${host}.key`;
  const valetCert = `${os.homedir()}/.config/valet/Certificates/${host}.crt`;
  const hasValetCert = fs.existsSync(valetKey) && fs.existsSync(valetCert);
 
  const useHttps = devHttps && hasValetCert;
  const httpsConfig = useHttps
    ? { key: fs.readFileSync(valetKey), cert: fs.readFileSync(valetCert) }
    : false;
  const protocol = useHttps ? 'https' : 'http';
 
  return {
    plugins: [
      laravel({
        input: ['resources/js/app.tsx'],
        ssr: 'resources/js/ssr.tsx',
        refresh: true,
      }),
      react(),
    ],
    server: {
      host,
      https: httpsConfig,
      cors: true,
      origin: `${protocol}://${host}:5173`,
      hmr: {
        host,
        protocol: useHttps ? 'wss' : 'ws',
      },
    },
    esbuild: {
      jsx: 'automatic',
    },
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, './resources/js'),
        '@/images': path.resolve(__dirname, 'resources/images'),
        '@/scss': path.resolve(__dirname, 'resources/scss'),
        '@/data': path.resolve(__dirname, 'resources/data'),
        'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
      },
    },
  };
});