import { useState, useEffect } from 'react'

interface InvitationParams {
  guestName: string | null
  maxSeats: number
  isLoaded: boolean
}

/**
 * Hook para capturar parámetros de URL de la invitación
 * ?n=NombreInvitado&c=5
 */
export function useInvitationParams(): InvitationParams {
  const [params, setParams] = useState<InvitationParams>({
    guestName: null,
    maxSeats: 1,
    isLoaded: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const searchParams = new URLSearchParams(window.location.search)
    const guestName = searchParams.get('n')
    const maxSeatsParam = searchParams.get('c')
    
    // Validar que maxSeats esté entre 1 y 9
    let maxSeats = 1
    if (maxSeatsParam) {
      const parsed = parseInt(maxSeatsParam, 10)
      maxSeats = Math.min(9, Math.max(1, isNaN(parsed) ? 1 : parsed))
    }

    setParams({
      guestName,
      maxSeats,
      isLoaded: true,
    })
  }, [])

  return params
}
