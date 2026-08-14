# jorgepalaciot.github.io

Sitio web personal de Jorge Palacio — Ingeniero Industrial.

## Cómo publicarlo en GitHub Pages

1. En tu repositorio `jorgepalaciot.github.io`, reemplaza el contenido actual con este `index.html` (en la raíz del repo).
2. Sube la carpeta `assets/` junto con el archivo.
3. Coloca tu CV actualizado en `assets/CV_Jorge_Palacio.pdf` — el botón "Descargar CV" de la sección Experiencia ya apunta a esa ruta.
4. Haz commit y push a la rama `main`. GitHub Pages publicará automáticamente en `https://jorgepalaciot.github.io`.

## Qué falta antes de publicar

- [ ] Subir `assets/CV_Jorge_Palacio.pdf` (el enlace de descarga está listo, solo falta el archivo).
- [ ] Foto de perfil para la sección "Sobre mí" / Hero: fondo neutro, luz de ventana, business casual, encuadre hombros hacia arriba, mínimo 1200×1200px. Reemplaza el bloque `.hero-photo` en el HTML por un `<img>` cuando la tengas.
- [ ] Redactar el primer artículo del blog (sección 8) — hoy los tres bloques dicen "Próximamente" a propósito, para no inventar contenido.
- [ ] Revisión de consistencia entre esta web y el CV en PDF descargable: ambos deben decir exactamente lo mismo en fechas y logros.

## Estructura técnica

- Un solo archivo `index.html` (HTML + CSS + JS inline, sin dependencias externas salvo Google Fonts).
- Toggle de idioma ES/EN (detecta `navigator.language`, persiste en `localStorage`).
- Toggle de tema claro/oscuro (detecta `prefers-color-scheme`, persiste en `localStorage`).
- Identidad visual "blueprint": paleta azul profundo + teal, tipografía Space Grotesk / IBM Plex Sans / IBM Plex Mono, motivo de "marcas de esquina" técnicas, diagramas SVG propios por caso real.
- Formulario de contacto con respaldo `mailto:` (sin backend). Formspree queda como mejora futura.
- Ningún dato o métrica no verificada — todo el contenido proviene de `Contenido_Web_Jorge_Palacio.docx` y el CV.
