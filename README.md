# Invitación Botánica · Martina & Federico

Versión limpia, responsive y lista para publicar en GitHub Pages.

## Qué incluye

- `index.html` — estructura completa de la invitación.
- `style.css` — diseño responsive, animaciones, modales y lightbox.
- `script.js` — cuenta regresiva, música, calendario, mapas, RSVP, sugerencia musical, modales y galería.
- `manifest.json` — metadatos básicos de la web app.
- `.nojekyll` — evita procesamiento innecesario de Jekyll en GitHub Pages.
- `assets/botanical/` — fondos y recortes botánicos.
- `assets/audio/track-01.mp3` — música incluida en esta versión.
- `assets/favicon.svg` — ícono del sitio.

## Publicar en GitHub Pages

1. Creá un repositorio nuevo en GitHub.
2. Subí **el contenido de esta carpeta** a la raíz del repositorio (no hace falta subir el ZIP).
3. En GitHub abrí `Settings` → `Pages`.
4. En `Build and deployment`, elegí `Deploy from a branch`.
5. Seleccioná la rama `main` y la carpeta `/ (root)`.
6. Guardá. GitHub mostrará la URL pública cuando termine el despliegue.

## Personalización rápida

### Nombres, textos y lugares
Editá `index.html`.

### Fecha, duración y datos de regalo
Al comienzo de `script.js` está el bloque `CONFIG`:

```js
const CONFIG = {
  couple: 'Martina & Federico',
  eventDateISO: '2026-11-22T19:00:00-03:00',
  durationHours: 6,
  location: 'Iglesia San Juan Bautista, Montevideo, Uruguay',
  timezone: 'America/Montevideo',
  giftAlias: 'NUESTRA.LUNA',
  giftBank: 'Banco Demo',
  giftAccount: 'Reemplazar por cuenta real antes de publicar'
};
```

### Colores
En la parte superior de `style.css`, modificá las variables `--forest`, `--sage`, `--gold`, `--ivory`, etc.

### Música
Reemplazá `assets/audio/track-01.mp3` por otro MP3 **con el mismo nombre**. Los navegadores no permiten iniciar audio automáticamente sin interacción; por eso el invitado debe tocar el botón de música.

### Fotos de la pareja
Las cuatro fotos de la sección “Nuestra historia” usan URLs externas de Unsplash como demostración. Si no cargan, la invitación muestra automáticamente fondos botánicos locales.

Para usar fotos propias:

1. Creá `assets/photos/`.
2. Copiá allí tus fotos, por ejemplo `foto-1.jpg`, `foto-2.jpg`, etc.
3. En `index.html`, reemplazá cada `src="https://images.unsplash.com/..."` por `src="assets/photos/foto-1.jpg"`.

## RSVP y sugerencias musicales

GitHub Pages es un sitio estático y no guarda respuestas en un servidor. Esta versión funciona sin backend: prepara el texto, usa la función “Compartir” del teléfono cuando está disponible y, como alternativa, permite copiarlo. También guarda una copia local en el navegador del invitado.

Si querés centralizar respuestas reales, conectá esos formularios a Formspree, Google Forms, Airtable, Supabase u otro backend.

## Funciones incluidas

- Cuenta regresiva con la hora fijada en UTC-3.
- Botón de música.
- Botones de ubicación con Google Maps.
- Agregar evento a Google Calendar.
- Descargar archivo `.ics`.
- Modal de regalo.
- RSVP interactivo.
- Sugerencia de canciones.
- Lightbox de fotos con teclado.
- Animaciones de entrada por scroll.
- Respeto de `prefers-reduced-motion`.
- Fallbacks locales para las imágenes de galería.
- Diseño adaptable a celular, tablet y escritorio.

## Archivos que no conviene renombrar sin actualizar el código

- `style.css`
- `script.js`
- `assets/audio/track-01.mp3`
- `assets/botanical/hero-desktop.jpg`
- `assets/botanical/hero-mobile.jpg`

