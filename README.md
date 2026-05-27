# ◆ Colorfly Studio — Generador de Paletas Interactivo

> Proyecto Integrador Módulo 1 · Desarrollador: Nicolás Rechimont

---

## 📋 Descripción

Herramienta web estática e interactiva que permite generar paletas de colores aleatorias de forma rápida e intuitiva. Diseñada para equipos creativos y diseñadores que necesitan inspiración cromática al instante.

**Demo en vivo:** [https://rechimonth.github.io/ProyectoM1_NicolasRechimont/](https://rechimonth.github.io/ProyectoM1_NicolasRechimont)

**Repositorio:** [https://github.com/rechimonth/ProyectoM1_NicolasRechimont](https://github.com/rechimonth/ProyectoM1_NicolasRechimont)

---

## ✨ Funcionalidades

| Feature | Estado |
|---|---|
| Generar paleta con botón | ✅ |
| Selector de tamaño (6 / 8 / 9 colores) | ✅ |
| Selector de formato (HEX / HSL) | ✅ |
| Colores en formato HSL | ✅ |
| Colores en formato HEX | ✅ |
| Visualización dinámica de códigos | ✅ |
| Copiar al portapapeles con clic | ✅ |
| Feedback visual en tarjeta (tooltip) | ✅ |
| Tooltip por tarjeta | ✅ |
| HTML semántico | ✅ |
| Accesibilidad (WCAG básico) | ✅ |
| Animaciones de entrada | ✅ |

---

## 🚀 Cómo ejecutar en local

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Git instalado
- (Opcional) VS Code con extensión **Live Server**

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/rechimonth/ProyectoM1_NicolasRechimont.git

# 2. Entrar al directorio
cd ProyectoM1_NicolasRechimont

# 3. Abrir en el navegador
# Opción A: abrir index.html directamente (doble clic)
# Opción B (recomendado): usar Live Server en VS Code
#   → Clic derecho en index.html → "Open with Live Server"
```

> ⚠️ Para que la API `navigator.clipboard` funcione correctamente, se recomienda servir el archivo desde un servidor local (Live Server) en lugar de abrirlo como `file://`.

---

## 🌐 Cómo desplegar en GitHub Pages

```bash
# 1. Asegurarse de que el código está subido a la rama main
git push origin main

# 2. Ir a Settings del repositorio en GitHub
# 3. → Pages → Source: "Deploy from a branch"
# 4. → Branch: main → / (root) → Save
# 5. Esperar ~1 minuto y visitar:
#    https://<tu-usuario>.github.io/ProyectoM1_NicolasRechimont/
```

---

## 🎮 Manual de uso

1. **Elegí el tamaño** — Seleccioná 6, 8 o 9 colores usando los botones del panel de control.
2. **Elegí el formato** — Activá o desactivá los checkboxes **HEX** y **HSL** para mostrar uno o ambos formatos en las tarjetas.
3. **Generá** — Presioná el botón **Generar Paleta** para crear una nueva paleta.
4. **Explorá** — Posicioná el mouse sobre cada tarjeta para ver un tooltip con los valores del color.
5. **Copiá** — Hacé clic sobre cualquier tarjeta para copiar el código (en el formato seleccionado) al portapapeles.
6. **Confirmación** — El tooltip cambia a **"Copiado"** (fondo verde) durante 1.5 segundos, confirmando que la copia fue exitosa.

---

## 🏗️ Estructura del proyecto

```
ProyectoM1_NicolasRechimont/
│
├── index.html              # Estructura HTML semántica
├── css/
│   └── styles.css          # Estilos, animaciones, variables CSS
├── js/
│   └── app.js              # Lógica JS: generación, DOM, eventos
│
└── docs/
    ├── screenshots/        # Capturas del flujo de la app
    └── prompts.txt         # Prompts de IA utilizados
```

---

## 🧠 Decisiones técnicas

### HTML semántico
Se utilizaron etiquetas `<header>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<nav>` y `<fieldset>` para comunicar la estructura del documento. El grid de colores usa `role="list"` y cada tarjeta `role="listitem"` para una semántica accesible.

### CSS sin inline styles
Todos los estilos se centralizan en `styles.css`. Las únicas excepciones aceptadas son los colores de fondo de las tarjetas (aplicados desde JS, ya que son valores dinámicos calculados en runtime).

### Algoritmo de generación de paletas
El algoritmo distribuye los tonos de forma semi-armónica dividiendo el círculo cromático (360°) en N segmentos iguales y eligiendo un tono aleatorio dentro de cada segmento con un "jitter" del 80%. Esto garantiza variedad cromática sin que los colores se repitan o sean demasiado similares.

### Doble formato (HEX + HSL)
La función `hslToHex()` convierte los valores HSL generados a hexadecimal mediante la fórmula matemática estándar. Ambos formatos se generan simultáneamente para cada color; los checkboxes permiten mostrar u ocultar cada formato sin regenerar los colores, mejorando la flexibilidad visual.

### Microfeedback en tarjeta
El tooltip en cada tarjeta cambia dinámicamente:
- **Estado normal**: muestra "Copiar"
- **Al pasar el mouse**: muestra el código del color (HEX, HSL, o ambos según la selección)
- **Al hacer clic**: cambia a "Copiado" con fondo verde (#22C55E) por 1.5 segundos, confirmando la copia exitosa
- **En caso de error**: muestra "Error" con fondo rojo (#EF4444)

### Accesibilidad (WCAG básico)
- Todos los `<input>` tienen `<label>` asociado.
- Las pills de tamaño/formato son `<label>` con `<input type="checkbox">` u `<input type="radio">` oculto, navegables con teclado.
- Las tarjetas tienen `tabindex="0"` y responden a `Enter`/`Space` para copiar.
- Los tooltips usan `aria-label` para descripción en lectores de pantalla.
- `focus-visible` garantiza contorno visible en navegación con teclado.

### Sin frameworks
La aplicación usa únicamente HTML, CSS y JavaScript vanilla, sin dependencias externas (excepto Google Fonts).

---

## 📦 Tech Stack

- **HTML5** — Estructura semántica
- **CSS3** — Variables custom, Grid, animaciones, backdrop-filter
- **JavaScript ES6+** — Módulos lógicos, async/await, DOM API
- **Git / GitHub** — Control de versiones
- **GitHub Pages** — Despliegue estático

---

## 👤 Autor

**Nicolás Rechimont** · Desarrollador Frontend Junior  
Proyecto Integrador — Módulo 1
