# DemoContru - Sitio Web de Construcción

Sitio web profesional para servicios de construcción en Angol, Chile.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Compilar CSS de Tailwind:**
   ```bash
   npm run build
   ```

3. **Para desarrollo (modo watch):**
   ```bash
   npm run build
   ```
   Esto compilará automáticamente los cambios en el CSS.

4. **Para producción (CSS minificado):**
   ```bash
   npm run build:prod
   ```

## 📁 Estructura del Proyecto

```
DemoContru/
├── 📄 Archivos principales
│   ├── index.html             # Página principal
│   ├── trabajos.html          # Página de trabajos
│   ├── package.json           # Dependencias y scripts
│   ├── package-lock.json      # Lock de dependencias
│   └── README.md             # Documentación
│
       ├── 📄 Archivos de configuración
       │   ├── tailwind.config.js     # Configuración de Tailwind CSS
       │   └── postcss.config.js      # Configuración de PostCSS
│
├── 📁 src/                   # Código fuente
│   └── input.css             # Archivo CSS de entrada con directivas de Tailwind
│
├── 📁 dist/                  # Archivos compilados
│   └── output.css            # CSS compilado de Tailwind (generado automáticamente)
│
├── 📁 images/                # Imágenes del sitio
│   ├── *.png                 # Imágenes PNG
│   └── *.jpg                 # Imágenes JPG
│
├── 📁 icons/                 # Iconos SVG
│   └── *.svg                 # Iconos del sitio
│
├── 📁 galeria/               # Galería de trabajos
│   ├── empaste,yeso y pintura/
│   ├── Postacion y cableado aéreo para instalaciones ele trica domiciliarias/
│   └── WhatsApp Unknown 2025-07-31 at 3.01.54 AM/
│
├── 📁 assets/                # Recursos multimedia
│   └── videos/               # Videos del sitio
│
└── 📁 node_modules/          # Dependencias de Node.js
```

## 🎨 Personalización de Tailwind

### Colores Personalizados
El proyecto incluye colores personalizados:
- `primary`: Paleta de azules
- `secondary`: Paleta de púrpuras

### Componentes Personalizados
- `.btn-primary`: Botón principal con gradiente
- `.btn-secondary`: Botón secundario
- `.card`: Tarjeta con efectos hover
- `.section-padding`: Padding estándar para secciones
- `.container-custom`: Contenedor personalizado

### Utilidades Personalizadas
- `.text-gradient`: Texto con gradiente
- `.bg-gradient-primary`: Fondo con gradiente primario
- `.bg-gradient-secondary`: Fondo con gradiente secundario

## 🔧 Scripts Disponibles

- `npm run build`: Compila CSS en modo desarrollo con watch
- `npm run build:prod`: Compila CSS minificado para producción

## 📱 Características

- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Optimización SEO
- ✅ Integración con WhatsApp
- ✅ Galería de trabajos con Swiper
- ✅ Formulario de contacto
- ✅ Mapa de ubicación

## 🚀 Despliegue

Para desplegar el sitio:

1. Ejecuta `npm run build:prod` para generar el CSS optimizado
2. Sube todos los archivos al servidor web
3. Asegúrate de que la carpeta `dist/` esté incluida

## 📞 Contacto

- **Teléfono:** +56 9 3517 2731
- **Email:** mauricioeazocar@gmail.com
- **Ubicación:** Cerro Negro #1388, Angol, Araucanía, Chile

---

Desarrollado con ❤️ para Soluciones Integrales 