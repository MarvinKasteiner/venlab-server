import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base:"/insy5-informationssysteme-vue-pwa-insy_vue-pwa_erdsieck_kasteiner_soukup/",
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
            },
            includeAssets: ['favicon.ico'],
            manifest: {
                name: 'VenLab PWA',
                short_name: 'VenLab',
                description: 'VenLab PWA Application',
                theme_color: '#112d4e',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/insy5-informationssysteme-vue-pwa-insy_vue-pwa_erdsieck_kasteiner_soukup/',
                start_url: '/insy5-informationssysteme-vue-pwa-insy_vue-pwa_erdsieck_kasteiner_soukup/',
                icons: [
                    {
                        src: '/favicon.ico',
                        sizes: '48x48',
                        type: 'image/x-icon'
                    },
                    {
                        src: '/favicon.ico',
                        sizes: '192x192',
                        type: 'image/x-icon',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    server: {
        port: 8082,
        proxy: {
            '/api': {
                target: 'https://139.59.214.45/api',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
});