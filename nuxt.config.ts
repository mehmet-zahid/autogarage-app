// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false ,// SSR must be turned off,
    telemetry: false,
    modules: [
      '@element-plus/nuxt',
      '@nuxt/ui',
      '@vueuse/nuxt'
    ],
    colorMode: {
      preference: 'dark'
  },
  elementPlus: {
    themes: ['dark']
  },
    vite: {
        // Better support for Tauri CLI output
        clearScreen: false,
        // Enable environment variables
        // Additional environment variables can be found at
        // https://tauri.app/2/reference/environment-variables/
        envPrefix: ['VITE_', 'TAURI_'],
        server: {
          // Tauri requires a consistent port
          strictPort: true,
          // Enables the development server to be discoverable by other devices for mobile development
          host: '0.0.0.0',
          hmr: {
            // Use websocket for mobile hot reloading
            protocol: 'ws',
            // Make sure it's available on the network
            host: '0.0.0.0',
            // Use a specific port for hmr
            port: 5183,
          },
        },
      },
})
