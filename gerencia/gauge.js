// Velocímetro semicircular SVG (sin dependencias).
// Renderiza un arco 180° con gradiente verde→amarillo→rojo y una aguja apuntando al valor.
//
// Uso: renderGauge(containerEl, 75, 'Productividad');
//      renderGauge(containerEl, null, 'Sin datos');  // muestra "—"

const W = 220;
const H = 140;
const CX = W / 2;       // 110
const CY = H - 20;      // 120 (base de la aguja)
const R = 85;           // radio del arco

// Convierte un valor 0-100 al ángulo correspondiente en el arco (180° = izquierda → 0° = derecha).
function valueToAngle(v) {
    const clamped = Math.max(0, Math.min(100, v));
    return 180 - (clamped / 100) * 180;
}

function polar(angleDeg, radius) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

function arcPath(startAngle, endAngle, radius) {
    const start = polar(startAngle, radius);
    const end   = polar(endAngle, radius);
    const largeArc = Math.abs(startAngle - endAngle) > 180 ? 1 : 0;
    const sweep = startAngle > endAngle ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

export function renderGauge(containerEl, value, label) {
    const id = 'gauge-' + Math.random().toString(36).slice(2, 9);
    const isNull = value == null || isNaN(value);
    const display = isNull ? '—' : Math.round(value);

    // Tres segmentos coloreados: rojo (0-33), amarillo (33-66), verde (66-100)
    const segRed    = arcPath(180, 120, R);
    const segYellow = arcPath(120, 60,  R);
    const segGreen  = arcPath(60,  0,   R);

    // Aguja
    let needle = '';
    if (!isNull) {
        const ang = valueToAngle(value);
        const tip = polar(ang, R - 8);
        needle = `
            <line x1="${CX}" y1="${CY}" x2="${tip.x}" y2="${tip.y}"
                  stroke="#fff" stroke-width="3" stroke-linecap="round"/>
            <circle cx="${CX}" cy="${CY}" r="6" fill="#fff"/>
        `;
    }

    containerEl.innerHTML = `
        <div class="gauge-container">
            <svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet" id="${id}">
                <path d="${segRed}"    stroke="#ef4444" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="${segYellow}" stroke="#f59e0b" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="${segGreen}"  stroke="#10b981" stroke-width="14" fill="none" stroke-linecap="round"/>
                ${needle}
            </svg>
            <div class="gauge-value">${display}${isNull ? '' : '<span style="font-size:0.55em;opacity:0.7"> /100</span>'}</div>
            <div class="gauge-label">${label}</div>
        </div>
    `;
}
