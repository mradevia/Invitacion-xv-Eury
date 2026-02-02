# 📋 Sistema de Confirmación de Asistencia (1-9 Asientos)

## Descripción General

Sistema completo de confirmación de asistencia para la invitación de XV años de Eury. Permite generar invitaciones personalizadas con número de asientos limitado (1-9) y capturar los nombres de los asistentes.

## Arquitectura del Sistema

### 1. **Hook: `useInvitationParams`** 
Ubicación: `hooks/use-invitation-params.ts`

Captura los parámetros de la URL:
- `n`: Nombre del invitado/familia
- `c`: Cantidad máxima de asientos (1-9)

```typescript
const { guestName, maxSeats, isLoaded } = useInvitationParams()
```

### 2. **Componente: `RSVPSection`**
Ubicación: `components/sections/rsvp-section.tsx`

**Funcionalidades:**
- Captura de parámetros URL
- Selección visual de 1-9 asientos
- Generación dinámica de campos de nombres
- Validación de entrada (nombres requeridos)
- Envío a WhatsApp con formato especializado

**Estado Interno:**
```typescript
- selectedSeats: número de asientos seleccionados (1-9)
- attendeeNames: array de nombres de asistentes
- validationError: mensaje de error de validación
- isSubmitting: estado de envío
```

### 3. **Componente: `InvitationLinkGenerator`**
Ubicación: `components/invitation-link-generator.tsx`

Panel para generar URLs de invitación personalizadas. Útil para:
- Nancy o administrador para crear invitaciones
- Copiar links
- Enviar por WhatsApp automáticamente

## Flujo de Uso

### Para Nancy (Generación de Invitaciones):

1. Accede al panel de generador (importa `InvitationLinkGenerator` en donde sea necesario)
2. Ingresa el nombre de la familia/invitado
3. Selecciona cantidad de boletos (1-9)
4. Copia el link o envía por WhatsApp
5. El link se vería así: `https://tudominio.com/invitacion?n=Familia%20Rivera&c=5`

### Para el Invitado (Confirmación):

1. Recibe el link personalizado
2. Ve el saludo: "¡Hola Familia Rivera!"
3. Selecciona cuántos asientos confirma (1-5 en este ejemplo)
4. Ingresa los nombres de los asistentes
5. Presiona "Confirmar Asistencia"
6. Se abre WhatsApp con el mensaje preformateado y listo para enviar

## Formato del Mensaje de WhatsApp

```
¡Confirmación de Asistencia! 🏰

Invitado: [Nombre del Invitado]
Lugares: [Cantidad Seleccionada] de [Total Reservado]

Asistentes:
1. [Nombre 1]
2. [Nombre 2]
3. [Nombre 3]
```

**Características:**
- Codificación correcta de caracteres especiales (ñ, acentos)
- Formato legible con saltos de línea
- Compatible con el API de WhatsApp Web

## Especificaciones Técnicas

### Validaciones:
✅ Parámetro `c` validado entre 1-9
✅ URL decodificada correctamente
✅ Nombres requeridos (no pueden estar vacíos)
✅ Selección de asientos limitada al máximo reservado

### Estilos Visuales:
- Colores: Oro (#d4af37) y tonos oscuros (#020a18)
- Efecto glassmorphism con bordes y transparencias
- Animaciones Framer Motion suave
- Responsive: Mobile-first design

### Seguridad & Optimización:
- `encodeURIComponent` para caracteres especiales
- Validación en cliente
- Caché de parámetros cargado una sola vez
- Estado local (sin backend requerido)

## Instalación

1. **Hook ya está creado:** `hooks/use-invitation-params.ts`

2. **RSVP Section actualizado:** `components/sections/rsvp-section.tsx`

3. **Componente generador (opcional):** `components/invitation-link-generator.tsx`

## Ejemplos de URLs Generadas

```
✅ Sin parámetros (por defecto):
https://tudominio.com/invitacion
→ Muestra estado de carga

✅ Con 1 asiento:
https://tudominio.com/invitacion?n=Juan&c=1

✅ Con múltiples palabras:
https://tudominio.com/invitacion?n=Familia%20Rodriguez%20Lopez&c=5

✅ Con caracteres especiales:
https://tudominio.com/invitacion?n=Fam%C3%ADlia%20Ni%C3%B1o&c=3
```

## Integración en page.tsx

La RSVPSection ya está incluida en `app/page.tsx`. No requiere cambios adicionales. Solo asegúrate de que el componente esté importado:

```tsx
import { RSVPSection } from "@/components/sections/rsvp-section"
```

## Testing

Para probar en desarrollo:

```
Caso 1: Con parámetros
http://localhost:3000?n=Familia%20Test&c=3

Caso 2: Sin parámetros
http://localhost:3000

Caso 3: Con máximo asientos
http://localhost:3000?n=VIP&c=9

Caso 4: Caracteres especiales
http://localhost:3000?n=Fam%C3%ADlia%20Se%C3%B1or&c=5
```

## Cambios Realizados

### ✅ Completado:

1. **`use-invitation-params.ts`** - Hook personalizado para capturar parámetros
2. **`rsvp-section.tsx`** - Reemplazo completo con nueva lógica funcional:
   - Captura de parámetros URL
   - Selección visual de 1-9 asientos
   - Generación dinámica de inputs
   - Validación de nombres
   - Construcción de mensaje WhatsApp

3. **`invitation-link-generator.tsx`** - Panel administrativo para generar invitaciones

4. **Estilos visuales** - Mantiene el diseño original (gold, dark, glassmorphism)

## Notas Importantes

⚠️ **No se alteró el diseño visual existente**
- Los nuevos elementos heredan los estilos dorados, oscuros y glassmorphism
- Animaciones Framer Motion coherentes con el resto

⚠️ **URL Base**
- Actualiza `invitation-link-generator.tsx` si el dominio cambia
- La RSVPSection captura dinámicamente desde `window.location`

⚠️ **Número de WhatsApp**
- El enlace actual usa `https://wa.me/` que abre WhatsApp Web
- Para número específico: `https://wa.me/5491234567890/?text=mensaje`

## Soporte & Debugging

Si los nombres no se generan:
1. Abre DevTools (F12)
2. Verifica `?n=Nombre&c=X` en la URL
3. Revisa la consola para errores

Si WhatsApp no abre:
1. Verifica que tengas WhatsApp Web disponible
2. El mensaje está en la variable `message`
