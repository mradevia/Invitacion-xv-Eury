import { useEffect, useRef } from "react"

/**
 * Hook que usa requestAnimationFrame para ejecutar un callback
 * de forma más eficiente que setInterval
 */
export function useAnimationFrame(
    callback: (deltaTime: number) => void,
    interval: number = 1000,
    enabled: boolean = true
) {
    const requestRef = useRef<number | undefined>(undefined)
    const previousTimeRef = useRef<number | undefined>(undefined)
    const accumulatedTimeRef = useRef<number>(0)

    useEffect(() => {
        if (!enabled) return

        const animate = (time: number) => {
            if (previousTimeRef.current !== undefined) {
                const deltaTime = time - previousTimeRef.current
                accumulatedTimeRef.current += deltaTime

                // Solo ejecutar el callback cuando se alcance el intervalo
                if (accumulatedTimeRef.current >= interval) {
                    callback(accumulatedTimeRef.current)
                    accumulatedTimeRef.current = 0
                }
            }

            previousTimeRef.current = time
            requestRef.current = requestAnimationFrame(animate)
        }

        requestRef.current = requestAnimationFrame(animate)

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current)
            }
        }
    }, [callback, interval, enabled])
}
