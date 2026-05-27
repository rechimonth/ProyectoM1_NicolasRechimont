/* =========================
   CONFIGURACIÓN
========================= */

const DOM = {
    generateButton: document.getElementById("generar-paleta"),
    paletteGrid: document.querySelector(".palette-grid"),
    toastContainer: document.getElementById("toast-container"),
    formatCheckboxes: document.querySelectorAll('input[name="format-type"]')
};

if (!DOM.generateButton || !DOM.paletteGrid) {
    console.error("No se encontraron los elementos principales del DOM.");
    throw new Error("Error: Elementos DOM críticos no encontrados");
}

/* =========================
   UTILIDADES
========================= */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const randomBetween = (min, max) => Math.random() * (max - min) + min;

/* =========================
   CONVERSIÓN DE COLORES
========================= */

const hslToHex = (hue, saturation, lightness) => {
    const normalizedSaturation = saturation / 100;
    const normalizedLightness = lightness / 100;
    const chroma = (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
    const hueSection = hue / 60;
    const intermediate = chroma * (1 - Math.abs((hueSection % 2) - 1));

    let red = 0;
    let green = 0;
    let blue = 0;

    if (hueSection >= 0 && hueSection < 1) {
        red = chroma;
        green = intermediate;
    } else if (hueSection >= 1 && hueSection < 2) {
        red = intermediate;
        green = chroma;
    } else if (hueSection >= 2 && hueSection < 3) {
        green = chroma;
        blue = intermediate;
    } else if (hueSection >= 3 && hueSection < 4) {
        green = intermediate;
        blue = chroma;
    } else if (hueSection >= 4 && hueSection < 5) {
        red = intermediate;
        blue = chroma;
    } else {
        red = chroma;
        blue = intermediate;
    }

    const match = normalizedLightness - chroma / 2;

    const convertChannel = (channel) => Math.round((channel + match) * 255).toString(16).padStart(2, "0");

    return `#${convertChannel(red)}${convertChannel(green)}${convertChannel(blue)}`.toUpperCase();
};

const createHslColor = (hue, saturation, lightness) =>
    `hsl(${Math.round(hue)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;

/* =========================
   GENERADOR DE PALETAS
========================= */

const generateHarmonicPalette = (paletteSize) => {
    const colors = [];
    const sliceSize = 360 / paletteSize;
    const baseHue = randomBetween(0, 360);

    for (let index = 0; index < paletteSize; index++) {
        const sectionStart = baseHue + sliceSize * index;
        const jitter = randomBetween(-sliceSize * 0.22, sliceSize * 0.22);
        const hue = (sectionStart + jitter + 360) % 360;
        const saturation = clamp(randomBetween(62, 84), 0, 100);
        const lightness = clamp(randomBetween(48, 68), 0, 100);

        const hsl = createHslColor(hue, saturation, lightness);
        const hex = hslToHex(hue, saturation, lightness);

        colors.push({
            hsl,
            hex,
            values: {
                hue: Math.round(hue),
                saturation: Math.round(saturation),
                lightness: Math.round(lightness)
            }
        });
    }

    return colors;
};

/* =========================
   TOASTS
========================= */

let activeToastTimeout = null;

const showToast = (message, duration = 2200) => {
    if (!DOM.toastContainer) return;

    clearTimeout(activeToastTimeout);
    DOM.toastContainer.innerHTML = "";

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;

    DOM.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    activeToastTimeout = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(12px)";

        setTimeout(() => toast.remove(), 200);
    }, duration);
};

/* =========================
   TARJETAS
========================= */

const createColorCard = (colorData, index) => {
    const card = document.createElement("article");
    card.classList.add("color-card");
    card.setAttribute("tabindex", "0");
    card.setAttribute("data-index", index);
    card.setAttribute("aria-label", `Color ${index + 1}: ${colorData.hex}`);
    card.style.backgroundColor = colorData.hex;
    card.style.setProperty("--index", index);

    card.innerHTML = `
        <div class="color-card__overlay"></div>
        <div class="color-tooltip">Copiar</div>
        <div class="color-card__content">
            <span class="color-name">Color ${index + 1}</span>
            <div class="color-values" data-hex="${colorData.hex}" data-hsl="${colorData.hsl}"></div>
        </div>
    `;

    const tooltip = card.querySelector(".color-tooltip");
    const colorValues = card.querySelector(".color-values");
    let copyTimeout = null;

    const updateColorDisplay = () => {
        const showHex = document.getElementById("format-hex").checked;
        const showHsl = document.getElementById("format-hsl").checked;
        let displayText = "";

        if (showHex && showHsl) {
            displayText = `${colorData.hex}<br/>${colorData.hsl}`;
        } else if (showHex) {
            displayText = colorData.hex;
        } else if (showHsl) {
            displayText = colorData.hsl;
        }

        if (colorValues) {
            colorValues.innerHTML = `<strong>${displayText}</strong>`;
        }
    };

    updateColorDisplay();

    const copyColor = async () => {
        const showHex = document.getElementById("format-hex").checked;
        const showHsl = document.getElementById("format-hsl").checked;
        let textToCopy = "";

        if (showHex && showHsl) {
            textToCopy = `${colorData.hex}\n${colorData.hsl}`;
        } else if (showHex) {
            textToCopy = colorData.hex;
        } else if (showHsl) {
            textToCopy = colorData.hsl;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Mostrar "Copiado" en verde
            if (tooltip) {
                tooltip.textContent = "Copiado";
                tooltip.classList.add("copied");
            }

            // Restaurar al estado original después de 1.5s
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                if (tooltip) {
                    tooltip.textContent = "Copiar";
                    tooltip.classList.remove("copied");
                }
            }, 1500);
        } catch (error) {
            console.error("Error al copiar color:", error);
            if (tooltip) {
                tooltip.textContent = "Error";
                tooltip.classList.add("error");
            }
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                if (tooltip) {
                    tooltip.textContent = "Copiar";
                    tooltip.classList.remove("error");
                }
            }, 1500);
        }
    };

    card.addEventListener("click", async () => {
        await copyColor();
    });

    card.addEventListener("keydown", async (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await copyColor();
        }
    });

    card.addEventListener("mouseenter", () => {
        if (tooltip && !tooltip.classList.contains("copied") && !tooltip.classList.contains("error")) {
            const showHex = document.getElementById("format-hex").checked;
            const showHsl = document.getElementById("format-hsl").checked;
            let displayText = "";

            if (showHex && showHsl) {
                displayText = `${colorData.hex} / ${colorData.hsl}`;
            } else if (showHex) {
                displayText = colorData.hex;
            } else if (showHsl) {
                displayText = colorData.hsl;
            }
            tooltip.textContent = displayText;
        }
    });

    card.addEventListener("mouseleave", () => {
        if (tooltip && !tooltip.classList.contains("copied") && !tooltip.classList.contains("error")) {
            tooltip.textContent = "Copiar";
        }
    });

    return card;
};

const clearPalette = () => {
    DOM.paletteGrid.innerHTML = "";
};

const renderPalette = (amount) => {
    clearPalette();
    const colors = generateHarmonicPalette(amount);
    const fragment = document.createDocumentFragment();

    colors.forEach((colorData, index) => {
        const card = createColorCard(colorData, index);
        fragment.appendChild(card);
    });

    requestAnimationFrame(() => DOM.paletteGrid.appendChild(fragment));

    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.classList.add("sr-only");
    announcement.textContent = `Se han generado ${amount} colores.`;
    DOM.paletteGrid.parentElement.appendChild(announcement);

    setTimeout(() => announcement.remove(), 1000);
};

const getSelectedPaletteSize = () => {
    const selectedOption = document.querySelector('input[name="palette-size"]:checked');
    return selectedOption ? Number(selectedOption.value) : 6;
};

DOM.generateButton.addEventListener("click", (event) => {
    event.preventDefault();
    renderPalette(getSelectedPaletteSize());
});

document.querySelectorAll('input[name="palette-size"]').forEach((radio) => {
    radio.addEventListener("change", () => {
        renderPalette(getSelectedPaletteSize());
    });
});

DOM.formatCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const cards = document.querySelectorAll(".color-card");
        cards.forEach((card) => {
            const colorValues = card.querySelector(".color-values");
            const hexValue = colorValues.getAttribute("data-hex");
            const hslValue = colorValues.getAttribute("data-hsl");
            const showHex = document.getElementById("format-hex").checked;
            const showHsl = document.getElementById("format-hsl").checked;
            let displayText = "";

            if (showHex && showHsl) {
                displayText = `${hexValue}<br/>${hslValue}`;
            } else if (showHex) {
                displayText = hexValue;
            } else if (showHsl) {
                displayText = hslValue;
            }

            if (colorValues) {
                colorValues.innerHTML = `<strong>${displayText}</strong>`;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    renderPalette(getSelectedPaletteSize());
});
