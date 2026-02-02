'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, AlertTriangle } from 'lucide-react'

// Declaración de tipos para model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

export const GuardianAR = () => {
  const modelViewerRef = useRef<any>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // States
  const [shouldLoadModel, setShouldLoadModel] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [showLoadedMessage, setShowLoadedMessage] = useState(false)
  const [hasError, setHasError] = useState(false)

  // 1. Intersection Observer to trigger loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !shouldLoadModel) {
          setShouldLoadModel(true)
        }
      },
      { rootMargin: '200px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [shouldLoadModel])

  // 2. Load model-viewer script
  useEffect(() => {
    if (shouldLoadModel && !document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
      document.head.appendChild(script)
    }
  }, [shouldLoadModel])

  // 3. Event Listeners for Model Viewer (Progress, Load, Error)
  useEffect(() => {
    const modelViewer = modelViewerRef.current
    if (!modelViewer) return

    const handleProgress = (event: any) => {
      const progress = event.detail.totalProgress * 100
      setLoadingProgress(Math.round(progress))
    }

    const handleLoad = () => {
      setIsModelLoaded(true)
      setShowLoadedMessage(true)
      setLoadingProgress(100)
      setHasError(false)

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setShowLoadedMessage(false)
      }, 3000)
    }

    const handleError = (error: any) => {
      console.error("Error cargando modelo AR (listener):", error)
      setHasError(true)
      setLoadingProgress(0)
    }

    modelViewer.addEventListener('progress', handleProgress)
    modelViewer.addEventListener('load', handleLoad)
    modelViewer.addEventListener('error', handleError)

    return () => {
      modelViewer.removeEventListener('progress', handleProgress)
      modelViewer.removeEventListener('load', handleLoad)
      modelViewer.removeEventListener('error', handleError)
    }
  }, [shouldLoadModel, isModelLoaded]) // Dependencies updated

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gold-400" />
            </div>
          </motion.div>

          <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-gold-400 mb-4">
            ¡Mira quién se escapó del álbum de fotos!
          </h2>
          <p className="font-serif text-base sm:text-lg text-gold-200/70 max-w-2xl mx-auto">
            Colócala en tu mesa para traer a la versión pequeña de Eury a tu realidad
          </p>
        </motion.div>

        {/* 3D Model Viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative mb-8"
        >
          <div className="glass-royal rounded-2xl overflow-hidden border border-gold-500/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative min-h-[400px]">
            {shouldLoadModel ? (
              <>
                <model-viewer
                  ref={modelViewerRef}
                  src="/perrito.glb"
                  ios-src="/perrito.usdz"
                  ar
                  ar-modes="scene-viewer quick-look webxr"
                  id="reveal"
                  loading="eager"
                  camera-controls
                  auto-rotate
                  rotation="0 0 0"
                  shadow-intensity="1"
                  ar-placement="floor"
                  camera-orbit="auto"
                  min-camera-orbit="auto auto auto"
                  max-camera-orbit="auto auto auto"
                  field-of-view="30deg"
                  reveal="auto"
                  style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: 'transparent',
                  }}
                >
                  <button
                    slot="ar-button"
                    id="ar-button"
                    style={{
                      backgroundColor: '#d4af37',
                      borderRadius: '50px',
                      border: 'none',
                      position: 'absolute',
                      bottom: '16px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#000',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    📱 Ver en Realidad Aumentada
                  </button>

                  {/* Visual States Overlays */}

                  {/* Loading Progress Bar */}
                  {!isModelLoaded && !hasError && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        right: '16px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '8px',
                        padding: '12px',
                        backdropFilter: 'blur(10px)',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <Camera className="w-5 h-5 text-gold-400 animate-pulse" />
                        <span style={{
                          color: '#d4af37',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          Cargando modelo 3D...
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${loadingProgress}%`,
                          height: '100%',
                          backgroundColor: '#d4af37',
                          transition: 'width 0.3s ease',
                          boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                        }} />
                      </div>
                      <div style={{
                        color: '#d4af37',
                        fontSize: '12px',
                        marginTop: '4px',
                        textAlign: 'right'
                      }}>
                        {loadingProgress}%
                      </div>
                    </div>
                  )}

                  {/* Loaded Success Message */}
                  {showLoadedMessage && !hasError && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderRadius: '50px',
                        padding: '12px 24px',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid #d4af37',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        pointerEvents: 'none',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>✅</span>
                      <span style={{
                        color: '#d4af37',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        ¡Modelo cargado!
                      </span>
                    </motion.div>
                  )}
                </model-viewer>

                {/* ERROR STATE OVERLAY */}
                {hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-royal-900/80 backdrop-blur-sm z-20">
                    <div className="text-center p-6 border border-red-500/30 rounded-xl bg-red-500/10 max-w-xs mx-auto">
                      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                      <p className="text-red-400 font-bold mb-2">Error cargando el modelo</p>
                      <p className="text-red-300/70 text-sm mb-4">
                        No se pudo descargar el archivo 3D. Verifica tu conexión.
                      </p>
                      <button
                        onClick={() => {
                          setHasError(false);
                          setShouldLoadModel(false);
                          setTimeout(() => setShouldLoadModel(true), 100);
                        }}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-b from-royal-900/50 to-royal-950/50">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <Camera className="w-16 h-16 text-gold-400/50 mx-auto mb-4" />
                  <p className="text-gold-400/70 text-sm">Iniciando experiencia AR...</p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Decorative corners */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold-500/30 rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-gold-500/30 rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-gold-500/30 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold-500/30 rounded-br-lg" />
        </motion.div>

        {/* Simple Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-royal p-6 rounded-xl border border-gold-500/10 max-w-2xl mx-auto">
            <p className="text-gold-400/80 text-sm leading-relaxed">
              <strong className="text-gold-300">📱 Para usar AR:</strong> Abre esta página en tu celular (Safari en iPhone o Chrome en Android),
              toca el botón dorado, permite el acceso a la cámara y apunta a una mesa o piso.
              ¡La pequeña festejada aparecerá mágicamente en tu cámara!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
