// Vista de inventario de materiales: catálogo, alertas, consumos.

import { materiales, materialesBajos, consumos } from './data.js';

function renderTablaMateriales() {
    const tbody = document.getElementById('mat-tbody');
    tbody.innerHTML = materiales.map(m => {
        const bajo = m.stock <= m.minimo;
        return `
            <tr ${bajo ? 'style="background:rgba(239,68,68,0.1);"' : ''}>
                <td><strong>${m.descripcion}</strong><br><small style="color:var(--text-secondary)">EAN: ${m.ean}</small></td>
                <td>${m.categoria}</td>
                <td><span style="color:${bajo ? '#ef4444' : '#10b981'}; font-weight:700;">${m.stock}</span></td>
                <td>${m.minimo}</td>
                <td><small>${m.ubicacion}</small></td>
                <td><small>${m.proveedor}</small></td>
                <td>${bajo ? '<span class="badge" style="background:#ef4444;">BAJO</span>' : '<span class="badge" style="background:#10b981;">OK</span>'}</td>
            </tr>
        `;
    }).join('');
}

function renderAlertas() {
    const wrap = document.getElementById('mat-alertas');
    const bajos = materialesBajos();
    if (bajos.length === 0) {
        wrap.innerHTML = '<p style="color:#10b981; text-align:center; padding:0.5rem;"><i class="fa-solid fa-check-circle"></i> Sin alertas de bajo inventario.</p>';
        return;
    }
    wrap.innerHTML = `
        <div style="background:rgba(239,68,68,0.15); border-left:4px solid #ef4444; padding:0.8rem 1rem; border-radius:8px;">
            <strong style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> ${bajos.length} material(es) bajo el mínimo:</strong>
            <ul style="margin:0.3rem 0 0 1.2rem; padding:0;">
                ${bajos.map(m => `<li>${m.descripcion} — <strong>${m.stock}</strong> (mín. ${m.minimo})</li>`).join('')}
            </ul>
        </div>
    `;
}

function renderConsumos() {
    const wrap = document.getElementById('mat-consumos');
    if (consumos.length === 0) {
        wrap.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:0.5rem;">Sin consumos registrados.</p>';
        return;
    }

    // Agregado: total consumido por material en últimos 7 días
    const ahora = Date.now();
    const semana = 7 * 24 * 3600 * 1000;
    const porMaterial = {};
    consumos.filter(c => ahora - c.fecha < semana).forEach(c => {
        if (!porMaterial[c.materialId]) porMaterial[c.materialId] = { desc: c.descripcion, total: 0 };
        porMaterial[c.materialId].total += c.cantidad;
    });
    const ranking = Object.values(porMaterial).sort((a,b) => b.total - a.total);

    const fmtFecha = (ms) => new Date(ms).toLocaleString('es-DO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });

    wrap.innerHTML = `
        <h4 style="margin:0 0 0.5rem;">Más consumidos (últimos 7 días)</h4>
        <ul style="margin:0 0 1rem 1.2rem; padding:0; font-size:0.9rem;">
            ${ranking.length === 0 ? '<li style="color:var(--text-secondary)">Sin consumos esta semana.</li>' : ranking.slice(0, 5).map(r => `<li>${r.desc}: <strong>${r.total}</strong></li>`).join('')}
        </ul>
        <h4 style="margin:0 0 0.5rem;">Historial reciente</h4>
        <table class="custom-table" style="width:100%;">
            <thead><tr><th>Fecha</th><th>Material</th><th>Cantidad</th><th>Área</th><th>Responsable</th></tr></thead>
            <tbody>
                ${consumos.slice(0, 15).map(c => `
                    <tr>
                        <td><small>${fmtFecha(c.fecha)}</small></td>
                        <td>${c.descripcion}</td>
                        <td><strong>${c.cantidad}</strong></td>
                        <td>${c.area}</td>
                        <td><small>${c.responsable}</small></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export function abrirModalInventarioSuministros() {
    renderAlertas();
    renderTablaMateriales();
    renderConsumos();
    document.getElementById('modal-inventario-suministros').classList.remove('hidden');
}
