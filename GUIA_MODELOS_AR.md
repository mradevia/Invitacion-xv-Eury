# Guía: Cómo Agregar Nuevos Modelos 3D AR

Esta guía te muestra cómo agregar fácilmente nuevos modelos 3D a tu invitación.

## Paso 1: Preparar tus Archivos 3D

Necesitas dos versiones de tu modelo:

1. **Archivo GLB** (para Android)
   - Formato: `.glb`
   - Recomendación: Comprime el modelo para web
   - Herramientas: [glTF-Transform](https://gltf-transform.donmccurdy.com/)

2. **Archivo USDZ** (para iOS)
   - Formato: `.usdz`
   - Recomendación: Optimiza para AR
   - Herramientas: [Reality Converter](https://developer.apple.com/augmented-reality/tools/) (Mac)

## Paso 2: Colocar los Archivos

1. Coloca ambos archivos en la carpeta `/public` de tu proyecto
2. Ejemplo:
   ```
   /public
     ├── perrito.glb
     ├── perrito.usdz
     ├── tu-nuevo-modelo.glb    ← Aquí
     └── tu-nuevo-modelo.usdz   ← Aquí
   ```

## Paso 3: Configurar el Modelo

Abre el archivo `lib/ar-config.ts` y agrega tu modelo:

```typescript
export const AR_MODELS: Record<string, ARModel> = {
  perrito: {
    id: 'perrito',
    name: 'DONDE TODO EMPEZÓ',
    description: '¡Conoce a nuestro adorable guardián de la fiesta!',
    glb: '/perrito.glb',
    usdz: '/perrito.usdz',
    scale: '1 1 1',
    placement: 'floor',
    autoRotate: true,
  },
  
  // ⬇️ AGREGA TU NUEVO MODELO AQUÍ ⬇️
  tuModelo: {
    id: 'tuModelo',
    name: 'Nombre del Modelo',
    description: 'Descripción que verán los usuarios',
    glb: '/tu-nuevo-modelo.glb',
    usdz: '/tu-nuevo-modelo.usdz',
    scale: '1 1 1',              // Ajusta el tamaño si es necesario
    placement: 'floor',          // 'floor' o 'wall'
    autoRotate: true,            // true o false
    cameraOrbit: '0deg 75deg 1.5m',  // Opcional: posición inicial
    fieldOfView: '30deg',        // Opcional: zoom
  },
}
```

## Paso 4: Usar el Modelo

### Opción A: Cambiar el Modelo por Defecto

En `lib/ar-config.ts`, cambia:

```typescript
export const DEFAULT_MODEL_ID = 'tuModelo'  // Cambia 'perrito' por tu modelo
```

### Opción B: Usar Múltiples Modelos

En `app/page.tsx`, puedes especificar qué modelo usar:

```typescript
<GuardianAR modelId="tuModelo" />
```

O crear múltiples secciones AR:

```typescript
<GuardianAR modelId="perrito" />
<GuardianAR modelId="tuModelo" />
<GuardianAR modelId="otroModelo" />
```

## Configuración Avanzada

### Ajustar el Tamaño del Modelo

Si tu modelo aparece muy grande o pequeño:

```typescript
scale: '0.5 0.5 0.5'  // Más pequeño (50%)
scale: '2 2 2'        // Más grande (200%)
```

### Cambiar la Posición de la Cámara

```typescript
cameraOrbit: '45deg 60deg 2m'
// Formato: 'rotación-horizontal rotación-vertical distancia'
```

### Limitar el Zoom

```typescript
minCameraOrbit: 'auto auto 0.5m'  // Mínimo acercamiento
maxCameraOrbit: 'auto auto 5m'    // Máximo alejamiento
```

### Colocación en Pared

```typescript
placement: 'wall'  // Para cuadros, pósters, etc.
```

## Optimización de Modelos

### Para GLB:
1. Usa [glTF-Transform](https://gltf-transform.donmccurdy.com/)
2. Aplica compresión Draco
3. Reduce texturas a 1024x1024 o menos
4. Objetivo: < 2MB

### Para USDZ:
1. Usa Reality Converter (Mac)
2. Reduce polígonos si es necesario
3. Optimiza texturas
4. Objetivo: < 5MB

## Solución de Problemas

### El modelo no aparece
- ✅ Verifica que los archivos estén en `/public`
- ✅ Confirma que los nombres coincidan en `ar-config.ts`
- ✅ Revisa la consola del navegador para errores

### El modelo es muy grande/pequeño
- Ajusta el parámetro `scale`

### El modelo está rotado incorrectamente
- Ajusta `cameraOrbit` o rota el modelo en tu software 3D

### AR no funciona en mi dispositivo
- iOS: Requiere iOS 12+ y Safari
- Android: Requiere ARCore y Chrome

## Ejemplo Completo

```typescript
// lib/ar-config.ts
export const AR_MODELS: Record<string, ARModel> = {
  mascota: {
    id: 'mascota',
    name: 'Nuestra Mascota',
    description: 'El mejor amigo de la quinceañera',
    glb: '/mascota.glb',
    usdz: '/mascota.usdz',
    scale: '1.5 1.5 1.5',
    placement: 'floor',
    autoRotate: true,
    cameraOrbit: '0deg 70deg 1.8m',
    fieldOfView: '25deg',
  },
  
  decoracion: {
    id: 'decoracion',
    name: 'Decoración Especial',
    description: 'Un recuerdo de la fiesta',
    glb: '/decoracion.glb',
    usdz: '/decoracion.usdz',
    scale: '0.8 0.8 0.8',
    placement: 'floor',
    autoRotate: false,
  },
}

export const DEFAULT_MODEL_ID = 'mascota'
```

## Recursos Útiles

- [Model Viewer Documentation](https://modelviewer.dev/)
- [glTF-Transform](https://gltf-transform.donmccurdy.com/) - Optimizar GLB
- [Sketchfab](https://sketchfab.com/) - Descargar modelos 3D
- [Reality Converter](https://developer.apple.com/augmented-reality/tools/) - Convertir a USDZ

---

¿Necesitas ayuda? Revisa la consola del navegador (F12) para ver mensajes de error.
