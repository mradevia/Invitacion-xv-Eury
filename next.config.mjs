/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Para GitHub Pages (Exportación Estática)
  // COMENTAR ESTAS DOS LINEAS SI USAS VERCEL PARA MEJOR OPTIMIZACION DE IMAGENES
  output: 'export',
  images: {
    unoptimized: true,
  },

  // Configuración normal (Vercel) - Descomentar abajo y comentar arriba para Vercel
  /*
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  */

  // Configuración para Turbopack (desarrollo) - webpack se usa en build
  turbopack: {},

  // Optimización de webpack
  webpack: (config, { isServer }) => {
    // Optimizar chunks
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk para librerías grandes
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Chunk separado para framer-motion (pesado)
            framer: {
              name: 'framer',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              priority: 30,
            },
            // Chunk separado para model-viewer
            modelViewer: {
              name: 'model-viewer',
              test: /[\\/]node_modules[\\/](@google[\\/]model-viewer)[\\/]/,
              priority: 30,
            },
            // Componentes comunes
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    return config
  },

  // Headers para caché
  async headers() {
    return [
      {
        source: '/perrito.glb',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/perrito.usdz',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
