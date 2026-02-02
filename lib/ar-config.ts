/**
 * Configuración de modelos 3D para Realidad Aumentada
 * 
 * Para agregar un nuevo modelo:
 * 1. Coloca los archivos .glb y .usdz en la carpeta /public
 * 2. Agrega una nueva entrada en AR_MODELS con la configuración
 * 3. El sistema automáticamente lo detectará y mostrará
 */

export interface ARModel {
  id: string
  name: string
  description: string
  glb: string // Archivo GLB para Android
  usdz: string // Archivo USDZ para iOS
  scale?: string // Escala del modelo (formato: "x y z")
  placement?: 'floor' | 'wall' // Dónde se puede colocar el modelo
  autoRotate?: boolean
  cameraOrbit?: string // Órbita inicial de la cámara
  fieldOfView?: string // Campo de visión
  minCameraOrbit?: string
  maxCameraOrbit?: string
}

export const AR_MODELS: Record<string, ARModel> = {
  perrito: {
    id: 'perrito',
    name: 'Guardián',
    description: '¡Conoce a nuestro adorable guardián de la fiesta! Colócalo en tu mesa y mira cómo cobra vida.',
    glb: '/perrito.glb',
    usdz: '/perrito.usdz',
    scale: '1 1 1',
    placement: 'floor',
    autoRotate: true,
    cameraOrbit: '0deg 75deg 1.5m',
    fieldOfView: '30deg',
    minCameraOrbit: 'auto auto 0.5m',
    maxCameraOrbit: 'auto auto 3m',
  },
  // Ejemplo para agregar otro modelo en el futuro:
  // otroModelo: {
  //   id: 'otroModelo',
  //   name: 'Otro Modelo',
  //   description: 'Descripción del modelo',
  //   glb: '/otro-modelo.glb',
  //   usdz: '/otro-modelo.usdz',
  //   scale: '1 1 1',
  //   placement: 'floor',
  //   autoRotate: true,
  // },
}

// Modelo por defecto
export const DEFAULT_MODEL_ID = 'perrito'

// Obtener un modelo específico
export function getARModel(id: string): ARModel | undefined {
  return AR_MODELS[id]
}

// Obtener todos los modelos disponibles
export function getAllARModels(): ARModel[] {
  return Object.values(AR_MODELS)
}

// Verificar si un modelo existe
export function hasARModel(id: string): boolean {
  return id in AR_MODELS
}
