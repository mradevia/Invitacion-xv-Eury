# 🚀 GUÍA RÁPIDA DE USO

## Para Nancy: Generar una Invitación en 3 pasos

### Opción 1: Panel HTML (Recomendado)
1. Abre: `public/panel-nancy.html` en el navegador
2. Ingresa nombre: ej. "Familia Rivera"
3. Selecciona boletos: ej. 5
4. Haz clic en "Copiar Link" o "WhatsApp"
5. ¡Listo! El invitado recibirá el link personalizado

### Opción 2: URL Manual
Reemplaza los valores y comparte:
```
https://tudominio.com?n=Familia%20Rivera&c=5
```

### Opción 3: Componente React
Importa en tu panel admin:
```tsx
import { InvitationLinkGenerator } from "@/components/invitation-link-generator"
```

---

## Para el Invitado: Confirmar Asistencia en 3 pasos

1. **Recibe el link** de Nancy
2. **Abre el link** en el navegador
3. **Selecciona asientos** y completa nombres
4. **Presiona "Confirmar"** 
5. **WhatsApp se abre** con el mensaje listo para enviar

---

## 📋 Estructura del Sistema

```
hooks/
  └─ use-invitation-params.ts          ← Captura ?n=x&c=x de la URL

components/
  ├─ invitation-link-generator.tsx     ← Panel para Nancy (React)
  └─ sections/
      └─ rsvp-section.tsx              ← Página del invitado (ACTUALIZADO)

public/
  └─ panel-nancy.html                  ← Panel para Nancy (HTML puro)

Documentación:
  ├─ IMPLEMENTACION_COMPLETA.md
  ├─ DOCUMENTACION_SISTEMA_CONFIRMACION.md
  └─ GUIA_RAPIDA.md (este archivo)
```

---

## 🔑 Variables de URL

| Variable | Uso | Ejemplo |
|----------|-----|---------|
| `n` | Nombre del invitado | `?n=Familia%20Rivera` |
| `c` | Boletos máximos (1-9) | `?c=5` |

---

## 🎯 URLs de Ejemplo

```
1 boleto para Juan:
https://tudominio.com?n=Juan&c=1

5 boletos para Familia Rivera:
https://tudominio.com?n=Familia%20Rivera&c=5

9 boletos para VIP:
https://tudominio.com?n=VIP&c=9

Con caracteres especiales:
https://tudominio.com?n=Fam%C3%ADlia%20Se%C3%B1or&c=3
```

---

## ⚙️ Configuraciones Necesarias

### 1. Actualizar Dominio (Panel HTML)
Edita `public/panel-nancy.html` línea ~217:
```javascript
const BASE_URL = "https://invitacion.tudominio.com"; // ← Tu dominio aquí
```

### 2. Opcionalmente: Número de WhatsApp
En `components/sections/rsvp-section.tsx` línea ~70:
```typescript
const whatsappUrl = `https://wa.me/5491234567890/?text=${message}`
```

---

## ✅ Checklist de Verificación

- [ ] El hook `use-invitation-params.ts` existe
- [ ] `rsvp-section.tsx` tiene la lógica nueva
- [ ] `panel-nancy.html` tiene tu dominio actualizado
- [ ] No hay errores en la consola (F12)
- [ ] El link genera correctamente parámetros URL
- [ ] Los nombres se generan dinámicamente
- [ ] El botón de confirmar abre WhatsApp
- [ ] El mensaje tiene formato correcto

---

## 🧪 Test Rápido

1. Abre: `http://localhost:3000?n=Test&c=3`
2. Deberías ver:
   - "¡Hola Test!" en el saludo
   - 3 botones de asientos (1, 2, 3)
   - 1 campo de nombre (por defecto)
3. Selecciona asiento 3
4. Deberían aparecer 3 campos de nombres
5. Completa los nombres
6. Presiona "Confirmar Asistencia"
7. Se abre WhatsApp con el mensaje

---

## 🆘 Solucionar Problemas

### Los nombres no se generan
- Verifica que la URL tenga `?n=Nombre&c=X`
- Abre DevTools (F12) → Console
- Busca errores rojos

### El contador de asientos está mal
- Revisa que `c` sea un número entre 1 y 9
- Si no tiene parámetro, por defecto es 1

### WhatsApp no abre
- Asegúrate de tener WhatsApp Web disponible
- Si usas móvil, abre el navegador con WhatsApp instalado
- El mensaje está en variable `message`

### Los estilos se ven raros
- Verifica que Tailwind CSS esté configurado
- Ejecuta `npm run dev`
- Limpia cache: Ctrl+Shift+Delete

---

## 📞 Contacto & Soporte

Si encuentras problemas:
1. Revisa la consola (F12)
2. Verifica la documentación completa
3. Comprueba que las URLs estén bien formadas
4. Reinicia el servidor

---

## 🎉 ¡Listo!

El sistema está completamente funcional. Solo:
1. Abre `panel-nancy.html`
2. Ingresa un nombre y boletos
3. Copia el link o envía por WhatsApp
4. ¡El invitado puede confirmar!

---

**Última actualización:** 31 de Enero de 2026
**Estado:** ✅ Completado y listo para usar
