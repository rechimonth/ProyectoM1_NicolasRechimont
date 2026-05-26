/**
 * ============================================================
 * COLORFLY STUDIO — app.js
 * Generador de Paletas Interactivo
 *
 * Módulos:
 *   1. Utilidades de color (HSL ↔ HEX, contraste)
 *   2. Generación de colores aleatorios
 *   3. Renderizado dinámico de tarjetas
 *   4. Microfeedback: Toast + Tooltip
 *   5. Inicialización y event listeners
 * ============================================================
 */

'use strict';

/* ============================================================
   1. UTILIDADES DE COLOR
   ============================================================ */

/**
 * Convierte valores HSL a formato hexadecimal (#RRGGBB).
 *
 * @param {number} h - Tono (hue) 0–360
 * @param {number} s - Saturación 0–100
 * @param {number} l - Luminosidad 0–100
 * @returns {string} Color en formato HEX, ej: "#A3C4F2"
 */
function hslToHex(h, s, l) {
  // Normalizamos s y l a rango 0–1
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);

  /**
   * Función auxiliar que calcula cada canal RGB (r, g, b)
   * usando la fórmula de conversión HSL → RGB.
   * @param {number} n - 0=rojo, 8=verde, 4=azul
   */
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    // Convertimos a entero 0–255 y luego a HEX de 2 dígitos
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Calcula la luminosidad relativa de un color HEX
 * para determinar si el texto superpuesto debe ser claro u oscuro.
 * Basado en el estándar WCAG 2.1.
 *
 * @param {string} hex - Color en formato "#RRGGBB"
 * @returns {boolean} true si el color es "claro" (luminoso)
 */
function isLightColor(hex) {
  // Extraemos los canales R, G, B
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Fórmula de luminosidad perceptual (YIQ)
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 155; // Umbral: por encima es considerado claro
}

/* ============================================================
   2. GENERACIÓN DE COLORES ALEATORIOS
   ============================================================ */

/**
 * Genera un único color aleatorio en formato HSL.
 * Evita colores demasiado oscuros o demasiado claros
 * para garantizar que sean útiles como colores de paleta.
 *
 * @returns {{ h: number, s: number, l: number }} Objeto HSL
 */
function generateRandomHSL() {
  const h = Math.floor(Math.random() * 360);     // Tono: cualquier ángulo del círculo cromático
  const s = Math.floor(Math.random() * 55) + 35; // Saturación: 35%–90% (evitar grises puros)
  const l = Math.floor(Math.random() * 45) + 25; // Luminosidad: 25%–70% (evitar muy oscuro/claro)
  return { h, s, l };
}

/**
 * Genera un array de N colores únicos en HSL,
 * distribuyendo los tonos de forma semi-armónica
 * para obtener paletas visualmente coherentes.
 *
 * La estrategia: dividimos el círculo cromático en N segmentos
 * y elegimos un tono aleatorio dentro de cada segmento.
 * Esto garantiza variedad sin que los colores se "pisen".
 *
 * @param {number} count - Cantidad de colores (6, 8 o 9)
 * @returns {Array<{ h, s, l, hex, hslString }>} Array de objetos de color
 */
function generatePalette(count) {
  const colors = [];
  const segmentSize = 360 / count; // Ángulo de cada segmento

  for (let i = 0; i < count; i++) {
    // Base del segmento + variación aleatoria dentro del segmento
    const baseHue    = i * segmentSize;
    const jitter     = Math.random() * segmentSize * 0.8; // variación del 80% del segmento
    const h          = Math.floor((baseHue + jitter) % 360);

    // Saturación y luminosidad aleatorias en rangos útiles
    const s          = Math.floor(Math.random() * 50) + 35; // 35%–85%
    const l          = Math.floor(Math.random() * 40) + 28; // 28%–68%

    // Calculamos ambos formatos
    const hex        = hslToHex(h, s, l);
    const hslString  = `hsl(${h}, ${s}%, ${l}%)`;

    colors.push({ h, s, l, hex, hslString });
  }

  return colors;
}

/* ============================================================
   3. RENDERIZADO DINÁMICO DE TARJETAS
   ============================================================ */

/**
 * Obtiene el tamaño de paleta seleccionado actualmente
 * leyendo el radio button marcado.
 *
 * @returns {number} 6, 8 o 9
 */
function getSelectedSize() {
  const selectedRadio = document.querySelector('input[name="palette-size"]:checked');
  // Si no hay ninguno seleccionado (no debería pasar), usamos 9 como default
  return selectedRadio ? parseInt(selectedRadio.value, 10) : 9;
}

/**
 * Obtiene el formato de visualización seleccionado.
 *
 * @returns {'hex' | 'hsl'}
 */
function getSelectedFormat() {
  const selectedRadio = document.querySelector('input[name="color-format"]:checked');
  return selectedRadio ? selectedRadio.value : 'hex';
}

/**
 * Crea el elemento HTML de una tarjeta de color.
 *
 * Estructura generada:
 * <article class="color-card" role="listitem">
 *   <div class="tooltip">Clic para copiar HEX</div>
 *   <div class="copy-hint">⧉</div>
 *   <div class="color-swatch"></div>
 *   <div class="color-info">
 *     <span class="color-code">#A3C4F2</span>
 *     <span class="color-code-secondary">hsl(215, 72%, 61%)</span>
 *   </div>
 * </article>
 *
 * @param {{ h, s, l, hex, hslString }} color - Objeto de color
 * @param {string} displayFormat - 'hex' o 'hsl'
 * @param {number} index - Índice en la paleta (para el delay de animación)
 * @returns {HTMLElement} El elemento article creado
 */
function createColorCard(color, displayFormat, index) {
  // ── Contenedor principal
  const card = document.createElement('article');
  card.className = 'color-card';
  card.setAttribute('role', 'listitem');
  // aria-label accesible que describe el color
  card.setAttribute(
    'aria-label',
    `Color ${index + 1}: ${color.hex}. Hacer clic para copiar.`
  );

  // El valor a copiar depende del formato seleccionado
  const copyValue   = displayFormat === 'hex' ? color.hex : color.hslString;
  const primaryCode = copyValue;
  // El código secundario siempre es el otro formato
  const secondaryCode = displayFormat === 'hex' ? color.hslString : color.hex;

  // ── Tooltip (Microfeedback #2)
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = `Clic para copiar ${displayFormat.toUpperCase()}`;
  tooltip.setAttribute('aria-hidden', 'true'); // decorativo, el feedback real va por el toast

  // ── Ícono de copiar
  const copyHint = document.createElement('div');
  copyHint.className = 'copy-hint';
  copyHint.textContent = '⧉';
  copyHint.setAttribute('aria-hidden', 'true');

  // ── Bloque de color
  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.backgroundColor = color.hex; // siempre usamos HEX para el fondo real

  // ── Info con los códigos
  const info = document.createElement('div');
  info.className = 'color-info';

  const codeEl = document.createElement('span');
  codeEl.className = 'color-code';
  codeEl.textContent = primaryCode;

  const codeSecondaryEl = document.createElement('span');
  codeSecondaryEl.className = 'color-code-secondary';
  codeSecondaryEl.textContent = secondaryCode;

  // ── Ensamblado del DOM
  info.appendChild(codeEl);
  info.appendChild(codeSecondaryEl);

  card.appendChild(tooltip);
  card.appendChild(copyHint);
  card.appendChild(swatch);
  card.appendChild(info);

  // ── Evento de clic: copiar al portapapeles
  card.addEventListener('click', () => handleCopyColor(card, copyValue, tooltip));

  // Permitir activación con teclado (Enter / Space) para accesibilidad
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopyColor(card, copyValue, tooltip);
    }
  });

  return card;
}

/**
 * Renderiza la paleta completa en el grid del DOM.
 * Limpia las tarjetas anteriores y crea las nuevas.
 *
 * @param {Array} colors - Array de objetos de color
 * @param {string} displayFormat - 'hex' o 'hsl'
 */
function renderPalette(colors, displayFormat) {
  const grid       = document.getElementById('palette-grid');
  const emptyState = document.getElementById('empty-state');

  // Limpiamos el grid antes de renderizar
  grid.innerHTML = '';

  // Ocultamos el estado vacío
  emptyState.classList.add('hidden');

  // Creamos y agregamos cada tarjeta al grid
  colors.forEach((color, index) => {
    const card = createColorCard(color, displayFormat, index);
    grid.appendChild(card);
  });
}

/* ============================================================
   4. MICROFEEDBACK: TOAST + TOOLTIP
   ============================================================ */

/** Referencia al timer del toast para poder cancelarlo si se dispara de nuevo */
let toastTimer = null;

/**
 * Muestra el toast de notificación y lo oculta automáticamente.
 * Si se llama mientras ya está visible, reinicia el timer.
 *
 * @param {string} message - Texto a mostrar en el toast
 */
function showToast(message) {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  // Actualizamos el mensaje
  toastMsg.textContent = message;

  // Cancelamos cualquier timer pendiente para evitar que se oculte antes de tiempo
  if (toastTimer) clearTimeout(toastTimer);

  // Mostramos el toast agregando la clase 'show'
  toast.classList.add('show');

  // Lo ocultamos automáticamente después de 2.5 segundos
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 2500);
}

/**
 * Maneja la copia de un color al portapapeles.
 * Actualiza el tooltip de la tarjeta y dispara el toast.
 *
 * Usa la API Clipboard moderna (navigator.clipboard) con
 * fallback a execCommand para navegadores más antiguos.
 *
 * @param {HTMLElement} card - El elemento de la tarjeta
 * @param {string} value - El valor de color a copiar
 * @param {HTMLElement} tooltipEl - El elemento del tooltip
 */
async function handleCopyColor(card, value, tooltipEl) {
  try {
    // Intento 1: API Clipboard moderna (requiere HTTPS o localhost)
    await navigator.clipboard.writeText(value);
  } catch {
    // Fallback: método clásico con execCommand
    const tempInput = document.createElement('input');
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  // ── Feedback en el tooltip (Microfeedback #2)
  const originalText = tooltipEl.textContent;
  tooltipEl.textContent = '¡Copiado! ✓';
  card.classList.add('copied');

  // Restauramos el tooltip después de 1.5 segundos
  setTimeout(() => {
    tooltipEl.textContent = originalText;
    card.classList.remove('copied');
  }, 1500);

  // ── Toast (Microfeedback #1)
  showToast(`✓ ${value} copiado`);
}

/* ============================================================
   5. INICIALIZACIÓN Y EVENT LISTENERS
   ============================================================ */

/**
 * Maneja el clic en el botón "Generar paleta":
 * - Lee el tamaño y formato seleccionados
 * - Genera los colores
 * - Renderiza las tarjetas
 * - Anima el ícono del botón
 */
function handleGenerate() {
  const size   = getSelectedSize();
  const format = getSelectedFormat();

  // Animación del ícono del botón
  const btn     = document.getElementById('btn-generate');
  const btnIcon = btn.querySelector('.btn-icon');
  btn.classList.add('loading');
  btnIcon.style.transform = 'rotate(360deg)';

  // Reseteamos la animación después de completarse
  setTimeout(() => {
    btn.classList.remove('loading');
    btnIcon.style.transform = '';
  }, 500);

  // Generamos y renderizamos
  const colors = generatePalette(size);
  renderPalette(colors, format);
}

/**
 * Regenera la paleta cuando cambia el formato de visualización,
 * actualizando los textos de los códigos sin cambiar los colores.
 *
 * Nota: podríamos simplemente actualizar los textos existentes,
 * pero volver a renderizar garantiza que el delay de animación
 * también se aplique correctamente.
 */
function handleFormatChange() {
  // Si no hay tarjetas generadas todavía, no hacemos nada
  const grid = document.getElementById('palette-grid');
  if (grid.children.length === 0) return;

  // Volvemos a generar con el mismo estado (podríamos guardar la paleta actual,
  // pero para simplicidad del MVP regeneramos)
  handleGenerate();
}

/**
 * Punto de entrada principal.
 * Se ejecuta cuando el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
  // ── Botón principal
  const btnGenerate = document.getElementById('btn-generate');
  btnGenerate.addEventListener('click', handleGenerate);

  // ── Cambio de formato: actualiza la paleta si ya existe
  const formatRadios = document.querySelectorAll('input[name="color-format"]');
  formatRadios.forEach((radio) => {
    radio.addEventListener('change', handleFormatChange);
  });

  // ── Atajo de teclado: presionar "G" genera una nueva paleta
  document.addEventListener('keydown', (e) => {
    // Ignoramos si el foco está en un input o textarea
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'g' || e.key === 'G') {
      handleGenerate();
    }
  });

  // ── Generación automática al cargar la página
  // Creamos la primera paleta de 9 colores (tamaño default)
  handleGenerate();
});
