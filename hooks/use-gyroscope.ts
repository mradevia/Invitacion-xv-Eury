"use client"

import { useEffect, useState, useCallback } from "react"

interface GyroscopeState {
  beta: number | null  // front/back tilt (-180 to 180)
  gamma: number | null // left/right tilt (-90 to 90)
  alpha: number | null // compass direction (0 to 360)
  isSupported: boolean
  isPermissionGranted: boolean
}

export function useGyroscope() {
  const [state, setState] = useState<GyroscopeState>({
    beta: null,
    gamma: null,
    alpha: null,
    isSupported: false,
    isPermissionGranted: false,
  })

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && 
        typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === "granted") {
          setState(prev => ({ ...prev, isPermissionGranted: true }))
          return true
        }
      } catch (e) {
        console.error("Gyroscope permission denied:", e)
        return false
      }
    } else {
      // Non-iOS devices don't need permission
      setState(prev => ({ ...prev, isPermissionGranted: true }))
      return true
    }
    return false
  }, [])

  useEffect(() => {
    const isSupported = typeof window !== "undefined" && "DeviceOrientationEvent" in window
    setState(prev => ({ ...prev, isSupported }))

    if (!isSupported) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setState(prev => ({
        ...prev,
        beta: event.beta,
        gamma: event.gamma,
        alpha: event.alpha,
      }))
    }

    // Check if we need to request permission (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission !== "function") {
      // Non-iOS or older iOS, permission not needed
      setState(prev => ({ ...prev, isPermissionGranted: true }))
      window.addEventListener("deviceorientation", handleOrientation, { passive: true })
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  useEffect(() => {
    if (!state.isPermissionGranted || !state.isSupported) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      setState(prev => ({
        ...prev,
        beta: event.beta,
        gamma: event.gamma,
        alpha: event.alpha,
      }))
    }

    window.addEventListener("deviceorientation", handleOrientation, { passive: true })
    return () => window.removeEventListener("deviceorientation", handleOrientation)
  }, [state.isPermissionGranted, state.isSupported])

  // Convert to normalized values (-1 to 1)
  const normalized = {
    x: state.gamma !== null ? Math.max(-1, Math.min(1, state.gamma / 45)) : 0,
    y: state.beta !== null ? Math.max(-1, Math.min(1, (state.beta - 45) / 45)) : 0,
  }

  return {
    ...state,
    normalized,
    requestPermission,
  }
}
