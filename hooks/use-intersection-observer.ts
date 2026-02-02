import { useEffect, useRef, useState } from "react"

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
    freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
    options: UseIntersectionObserverOptions = {}
) {
    const { freezeOnceVisible = false, ...observerOptions } = options
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [hasIntersected, setHasIntersected] = useState(false)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        // Si ya intersectó y está congelado, no hacer nada
        if (freezeOnceVisible && hasIntersected) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isElementIntersecting = entry.isIntersecting

                setIsIntersecting(isElementIntersecting)

                if (isElementIntersecting) {
                    setHasIntersected(true)

                    // Si está congelado, desconectar el observer
                    if (freezeOnceVisible) {
                        observer.disconnect()
                    }
                }
            },
            {
                rootMargin: "100px", // Cargar con anticipación
                threshold: 0.1,
                ...observerOptions,
            }
        )

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [freezeOnceVisible, hasIntersected, observerOptions])

    return { ref, isIntersecting, hasIntersected }
}
