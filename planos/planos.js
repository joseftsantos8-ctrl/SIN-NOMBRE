// Visor de planos de tienda. Por ahora con planos esquemáticos generados en SVG
// como placeholder hasta que existan los PDFs/imágenes reales.

const PLANOS = [
    {
        id: 'piso-ventas',
        nombre: 'Piso de Ventas',
        descripcion: 'Distribución de pasillos y zonas comerciales',
        svg: `
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%; background:#fff; border-radius:8px;">
                <rect x="10" y="10" width="580" height="380" fill="none" stroke="#1e293b" stroke-width="3"/>
                <text x="300" y="35" text-anchor="middle" font-size="16" font-weight="700" fill="#1e293b">PISO DE VENTAS — SIRENA SP13</text>
                <!-- Pasillos -->
                <rect x="40" y="60" width="80" height="280" fill="#dbeafe" stroke="#1e40af"/>
                <text x="80" y="200" text-anchor="middle" font-size="11" fill="#1e40af">Pasillo 1</text>
                <rect x="140" y="60" width="80" height="280" fill="#dbeafe" stroke="#1e40af"/>
                <text x="180" y="200" text-anchor="middle" font-size="11" fill="#1e40af">Pasillo 2</text>
                <rect x="240" y="60" width="80" height="280" fill="#dbeafe" stroke="#1e40af"/>
                <text x="280" y="200" text-anchor="middle" font-size="11" fill="#1e40af">Pasillo 3</text>
                <rect x="340" y="60" width="80" height="280" fill="#dbeafe" stroke="#1e40af"/>
                <text x="380" y="200" text-anchor="middle" font-size="11" fill="#1e40af">Pasillo 4</text>
                <rect x="440" y="60" width="80" height="280" fill="#dbeafe" stroke="#1e40af"/>
                <text x="480" y="200" text-anchor="middle" font-size="11" fill="#1e40af">Pasillo 5</text>
                <!-- Cajas -->
                <rect x="40" y="350" width="480" height="30" fill="#fef3c7" stroke="#b45309"/>
                <text x="280" y="370" text-anchor="middle" font-size="11" fill="#b45309">CAJAS REGISTRADORAS</text>
                <!-- Entrada -->
                <rect x="540" y="180" width="40" height="60" fill="#bbf7d0" stroke="#15803d"/>
                <text x="560" y="215" text-anchor="middle" font-size="9" fill="#15803d">ENTRADA</text>
            </svg>
        `
    },
    {
        id: 'frescos',
        nombre: 'Zona de Frescos',
        descripcion: 'Carnicería, Deli, Lácteos, Frutas y vegetales',
        svg: `
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%; background:#fff; border-radius:8px;">
                <rect x="10" y="10" width="580" height="380" fill="none" stroke="#1e293b" stroke-width="3"/>
                <text x="300" y="35" text-anchor="middle" font-size="16" font-weight="700" fill="#1e293b">ZONA DE FRESCOS</text>
                <rect x="40" y="60" width="160" height="120" fill="#fecaca" stroke="#b91c1c"/>
                <text x="120" y="125" text-anchor="middle" font-size="14" fill="#b91c1c" font-weight="600">CARNICERÍA</text>
                <rect x="220" y="60" width="160" height="120" fill="#fde68a" stroke="#b45309"/>
                <text x="300" y="125" text-anchor="middle" font-size="14" fill="#b45309" font-weight="600">DELI</text>
                <rect x="400" y="60" width="160" height="120" fill="#bfdbfe" stroke="#1e40af"/>
                <text x="480" y="125" text-anchor="middle" font-size="14" fill="#1e40af" font-weight="600">LÁCTEOS</text>
                <rect x="40" y="210" width="240" height="160" fill="#bbf7d0" stroke="#15803d"/>
                <text x="160" y="290" text-anchor="middle" font-size="14" fill="#15803d" font-weight="600">FRUTAS Y VEGETALES</text>
                <rect x="320" y="210" width="240" height="160" fill="#e9d5ff" stroke="#6b21a8"/>
                <text x="440" y="290" text-anchor="middle" font-size="14" fill="#6b21a8" font-weight="600">PANADERÍA Y REPOSTERÍA</text>
            </svg>
        `
    },
    {
        id: 'almacen',
        nombre: 'Almacén y Trastienda',
        descripcion: 'Recepción, almacenamiento y despacho',
        svg: `
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%; background:#fff; border-radius:8px;">
                <rect x="10" y="10" width="580" height="380" fill="none" stroke="#1e293b" stroke-width="3"/>
                <text x="300" y="35" text-anchor="middle" font-size="16" font-weight="700" fill="#1e293b">ALMACÉN Y TRASTIENDA</text>
                <rect x="40" y="60" width="200" height="100" fill="#fef3c7" stroke="#b45309"/>
                <text x="140" y="115" text-anchor="middle" font-size="13" fill="#b45309" font-weight="600">RECEPCIÓN FURGONES</text>
                <rect x="260" y="60" width="300" height="220" fill="#e5e7eb" stroke="#374151"/>
                <text x="410" y="170" text-anchor="middle" font-size="14" fill="#374151" font-weight="600">ALMACÉN PRINCIPAL</text>
                <text x="410" y="195" text-anchor="middle" font-size="11" fill="#374151">Racks A-F · Estanterías 1-12</text>
                <rect x="40" y="180" width="200" height="100" fill="#dbeafe" stroke="#1e40af"/>
                <text x="140" y="235" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="600">DESPACHO A PISO</text>
                <rect x="40" y="300" width="520" height="60" fill="#fee2e2" stroke="#b91c1c"/>
                <text x="300" y="335" text-anchor="middle" font-size="13" fill="#b91c1c" font-weight="600">ZONA REFRIGERADA · CARGA/DESCARGA</text>
            </svg>
        `
    }
];

export function abrirModalPlanos() {
    const wrap = document.getElementById('planos-lista');
    wrap.innerHTML = PLANOS.map(p => `
        <div class="plano-item glass-panel" style="margin-bottom:1rem; padding:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:0.5rem;">
                <div>
                    <h4 style="margin:0;"><i class="fa-solid fa-map-location-dot"></i> ${p.nombre}</h4>
                    <small style="color:var(--text-secondary)">${p.descripcion}</small>
                </div>
                <div style="display:flex; gap:0.4rem;">
                    <button type="button" class="btn-secondary plano-imprimir" data-id="${p.id}" style="padding:0.4rem 0.7rem;">
                        <i class="fa-solid fa-print"></i> Imprimir
                    </button>
                    <button type="button" class="btn-secondary plano-descargar" data-id="${p.id}" style="padding:0.4rem 0.7rem;">
                        <i class="fa-solid fa-download"></i> Descargar
                    </button>
                </div>
            </div>
            <div class="plano-svg" data-id="${p.id}">${p.svg}</div>
        </div>
    `).join('');

    wrap.querySelectorAll('.plano-imprimir').forEach(b => b.addEventListener('click', () => imprimirPlano(b.dataset.id)));
    wrap.querySelectorAll('.plano-descargar').forEach(b => b.addEventListener('click', () => descargarPlano(b.dataset.id)));

    document.getElementById('modal-planos').classList.remove('hidden');
}

function imprimirPlano(id) {
    const plano = PLANOS.find(p => p.id === id);
    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<html><head><title>${plano.nombre} — Sirena SP13</title></head><body style="margin:20px; font-family:Arial;"><h2>${plano.nombre}</h2><p>${plano.descripcion}</p>${plano.svg}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
}

function descargarPlano(id) {
    const plano = PLANOS.find(p => p.id === id);
    const blob = new Blob([plano.svg], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `plano-${plano.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
}
