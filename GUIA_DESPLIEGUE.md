# 🚀 Guía de Despliegue: GitHub Pages & Vercel

Tu proyecto ya está optimizado y configurado. Elige tu plataforma preferida:

---

## Opción A: GitHub Pages (Listo para usar YA)

Como configuramos el proyecto para **Exportación Estática**, está listo para GitHub Pages.

### Pasos para subir:

1. **Crea un repositorio en GitHub.**
   - Ve a github.com -> New Repository.
   - Ponle nombre (ej: `invitacion-eury`).

2. **Sube tu código:**
   Abre tu terminal en la carpeta del proyecto y ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Invitación lista con optimización 200%"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Ve a tu repositorio en GitHub -> **Settings** -> **Pages**.
   - En "Build and deployment", selecciona **GitHub Actions** como fuente (Source).
   - ¡Listo! En unos minutos aparecerá el link de tu página.

---

## Opción B: Vercel (Recomendado para Máxima Calidad)

Si decides usar Vercel (ahora o después), obtendrás mejor rendimiento de imágenes porque Vercel sí soporta la optimización de servidor.

### Pasos para cambiar a Vercel:

1. **Edita el archivo `next.config.mjs`:**
   - Comenta las líneas de GitHub Pages (output: 'export' y unoptimized: true).
   - Descomenta la configuración de Vercel que ya dejé preparada en el archivo.

   ```javascript
   // ASI DEBE QUEDAR PARA VERCEL:
   /*
   output: 'export',
   images: { unoptimized: true },
   */
   
   images: {
     formats: ['image/webp'],
     // ... resto de config
   }
   ```

2. **Dile a Vercel:**
   - Ve a vercel.com -> Add New Project.
   - Importa tu repositorio de GitHub.
   - Dale a **Deploy**. ¡Detectará todo automáticamente!

---

## 👑 Sobre el Panel Nancy

He actualizado el **Panel Nancy** (`panel-nancy.html`) para que funcione mágicamente en ambos lados.
Detectará automáticamente si estás en `usuario.github.io/repo` o en `tu-proyecto.vercel.app` y generará los links correctos sin que tú hagas nada.

- URL del Panel: `tudominio.com/panel-nancy.html`
- URL Generada: `tudominio.com/?n=Familia+Perez&c=2`

¡Todo listo! 🚀
