import { useEffect, useState } from "react"

export type PerformanceMode = "high" | "medium" | "low"

interface PerformanceSettings {
    mode: PerformanceMode
    particleCount: number
    enableBlur: boolean
    enableGlow: boolean
    enable3D: boolean
    reducedMotion: boolean
}

/**
 * Hook que detecta la capacidad del dispositivo y ajusta la calidad
 * de las animaciones y efectos automáticamente
 */
export function usePerformanceMode(): PerformanceSettings {
    const [mode, setMode] = useState<PerformanceMode>("high")

    useEffect(() => {
        // Detectar si el usuario prefiere movimiento reducido
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches

        if (prefersReducedMotion) {
            setMode("low")
            return
        }

        // Detectar capacidad del dispositivo
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const isLowEndDevice = navigator.hardwareConcurrency
            ? navigator.hardwareConcurrency <= 4
            : false

        // Detectar memoria disponible (si está disponible)
        const deviceMemory = (navigator as any).deviceMemory
        const isLowMemory = deviceMemory ? deviceMemory < 4 : false

        // Determinar modo de rendimiento
        if (isMobile || isLowEndDevice || isLowMemory) {
            setMode("medium")
        } else {
            setMode("high")
        }

        // Monitorear FPS (opcional, más avanzado)
        let frameCount = 0
        let lastTime = performance.now()
        let rafId: number

        const measureFPS = () => {
            frameCount++
            const currentTime = performance.now()

            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

                // Si el FPS es bajo, reducir calidad
                if (fps < 30 && mode === "high") {
                    setMode("medium")
                } else if (fps < 20 && mode === "medium") {
                    setMode("low")
                }

                frameCount = 0
                lastTime = currentTime
            }

            rafId = requestAnimationFrame(measureFPS)
        }

        // Medir FPS durante los primeros 3 segundos
        rafId = requestAnimationFrame(measureFPS)
        const timeout = setTimeout(() => {
            cancelAnimationFrame(rafId)
        }, 3000)

        return () => {
            cancelAnimationFrame(rafId)
            clearTimeout(timeout)
        }
    }, [])

    // Configuraciones basadas en el modo
    const settings: Record<PerformanceMode, PerformanceSettings> = {
        high: {
            mode: "high",
            particleCount: 15,
            enableBlur: true,
            enableGlow: true,
            enable3D: true,
            reducedMotion: false,
        },
        medium: {
            mode: "medium",
            particleCount: 8,
            enableBlur: true,
            enableGlow: true,
            enable3D: false,
            reducedMotion: false,
        },
        low: {
            mode: "low",
            particleCount: 4,
            enableBlur: false,
            enableGlow: false,
            enable3D: false,
            reducedMotion: true,
        },
    }

    return settings[mode]
}
