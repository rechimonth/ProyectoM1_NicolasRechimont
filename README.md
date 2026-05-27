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
| Colores en formato HSL | ✅ |
| Colores en formato HEX | ✅ |
| Visualización con código de color | ✅ |
| Copiar al portapapeles con clic | ✅ |
| Toast de confirmación | ✅ |
| Tooltip por tarjeta | ✅ |
| Atajo de teclado `G` para generar | ✅ |
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
git clone https://rechimonth.github.io/ProyectoM1_NicolasRechimont

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

1. **Elegí el tamaño** — Seleccioná 6, 8 o 9 colores usando las pills del panel de control.
2. **Elegí el formato** — Alternás entre `HEX` y `HSL` para el código principal visible.
3. **Generá** — Presioná el botón **Generar paleta** (o la tecla `G`).
4. **Explorá** — Hacé hover sobre cada tarjeta para ver el tooltip con el código.
5. **Copiá** — Hacé clic sobre cualquier tarjeta para copiar el código al portapapeles.
6. **Confirmación** — Un toast aparece en la esquina superior derecha confirmando la copia.

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
La función `hslToHex()` convierte los valores HSL generados a hexadecimal mediante la fórmula matemática estándar. Ambos formatos se generan simultáneamente para cada color; el formato visible se alterna con los radio buttons sin regenerar los colores.

### Microfeedback dual
- **Toast**: notificación global que confirma la copia con el valor exacto copiado.
- **Tooltip**: feedback local en la tarjeta que cambia a "¡Copiado! ✓" y vuelve automáticamente.

### Accesibilidad (WCAG básico)
- Todos los `<input>` tienen `<label>` asociado.
- Las pills de tamaño/formato son `<label>` con `<input type="radio">` oculto, navegables con teclado.
- Las tarjetas tienen `tabindex="0"` y responden a `Enter`/`Space`.
- El toast usa `aria-live="polite"` para lectores de pantalla.
- `focus-visible` garantiza contorno visible en navegación con teclado.
- Función `isLightColor()` disponible para adaptar el contraste de texto (extensible).

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
