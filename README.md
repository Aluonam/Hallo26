# Hallo26 🎃

Web de la fiesta de Halloween de la comunidad (31/10/2026, 18:30).
HTML + CSS + JS nativo, sin dependencias ni compilación. Publicada con GitHub Pages.

## Mantenimiento

| Quiero…                                   | Edito                    |
|-------------------------------------------|--------------------------|
| Añadir una puerta participante            | `js/data/doors.js`       |
| Peques inscritos                          | automático (Google Form → hoja → web) |
| Emoji según el alias de cada peque        | `js/data/avatars.js`     |
| Cambiar horas, enlaces WhatsApp/formularios | `js/config.js`         |
| Cambiar un texto (ES/EN)                  | `js/i18n.js`             |
| Añadir, quitar o reordenar secciones      | `js/main.js`             |
| Cambiar colores o fuentes                 | `css/base.css`           |

Lo que esté vacío en `config.js` no se muestra o aparece como "Por confirmar".

## Inscripción de peques (automática)

1. Google Form de peques → pestaña **Respuestas** → icono de Hojas → crear hoja nueva.
2. En esa hoja, añade una pestaña llamada `web` y pega en A1:
   `=QUERY('Respuestas de formulario 1'!B:D; "select B, C, D where B is not null"; 1)`
   (solo alias, edad y alergias; observaciones y demás no se publican).
3. Archivo → Compartir → **Publicar en la web** → pestaña `web` → **CSV** → Publicar.
4. Pega ese enlace en `js/config.js` → `sheets.kids`.

Google refresca el CSV publicado cada ~5 min. Para quitar a alguien de la web, borra su fila en "Respuestas de formulario 1".

## Estructura

```
index.html          esqueleto
css/base.css        paleta, tipografía, botones
css/sections.css    estilos de cada sección
js/main.js          monta las secciones en orden
js/config.js        datos del evento
js/i18n.js          diccionario ES/EN + t()
js/data/doors.js    puertas participantes
js/sections/*.js    una sección por archivo: render() y, si hace falta, mount()
```

## Probar en local

Los módulos ES no funcionan con doble clic (`file://`). Lanza un servidor:

```
npx serve .
```
