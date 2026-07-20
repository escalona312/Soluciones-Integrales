# Soluciones Integrales — sitio web

Sitio estático de Soluciones Integrales, empresa de construcción, electricidad, mantenimiento y renovaciones en Angol, La Araucanía.

## Desarrollo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

El modo de desarrollo recompila `dist/output.css` cuando cambian los HTML, `site.js` o `src/input.css`. Para visualizar el sitio se puede usar cualquier servidor estático local.

## Producción

```bash
npm run build
```

El proceso genera el CSS minificado y valida automáticamente:

- recursos locales y anclas;
- identificadores duplicados;
- texto alternativo y dimensiones de imágenes;
- seguridad básica de enlaces externos.

## Estructura

- `index.html`: portada, servicios, proyectos destacados, clientes, empresa y contacto.
- `trabajos.html`: portafolio filtrable y galería de construcción de casas.
- `site.js`: navegación, animaciones, galerías, filtros, diálogo y formulario de WhatsApp.
- `src/input.css`: sistema visual responsive y accesible.
- `images/optimized`: derivados WebP de las fotografías originales más pesadas.
- `galeria`: archivo fotográfico de trabajos realizados.
- `scripts/check-site.mjs`: verificación previa a publicación.

## Contacto

- Teléfono: +56 9 3517 2731
- Correo: mauricioeazocar@gmail.com
- Dirección: Cerro Negro #1388, Angol, Araucanía, Chile
