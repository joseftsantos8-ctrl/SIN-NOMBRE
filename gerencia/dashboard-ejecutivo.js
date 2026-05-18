import { tasks } from '../tareas/data.js';
import { users } from '../usuarios/data.js';
import { mermas } from '../mermas/data.js';
import { renderGauge } from './gauge.js';
import {
    calcularProductividad,
    calcularVelocidad,
    calcularConfiabilidad,
    calcularCumplimiento,
    statsPorLider
} from './kpis.js';

const ROLES_LIDER = ['Gerente', 'Sugerente'];

function esLider(role) {
    return role.includes('Líder') || ROLES_LIDER.includes(role);
}

function fmtMoney(n) {
    return '$' + n.toLocaleString('es-DO', { maximumFractionDigits: 0 });
}

function fmtFecha(ms) {
    const d = new Date(ms);
    return d.toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function renderGauges() {
    const wrap = document.getElementById('gauges-row');
    wrap.innerHTML = '';

    // Productividad global = promedio de productividades por líder con datos
    const lideres = Object.entries(users).filter(([, u]) => esLider(u.role)).map(([id]) => id);
    const prods   = lideres.map(id => calcularProductividad(tasks, id)).filter(v => v != null);
    const productividad = prods.length === 0 ? null : Math.round(prods.reduce((a,b) => a+b, 0) / prods.length);

    const velocidad     = calcularVelocidad(tasks);
    const confiabilidad = calcularConfiabilidad(tasks);
    const cumplimiento  = calcularCumplimiento(productividad, velocidad, confiabilidad);

    [
        { v: productividad, l: 'Productividad' },
        { v: velocidad,     l: 'Velocidad Ejec.' },
        { v: confiabilidad, l: 'Confiabilidad Inv.' },
        { v: cumplimiento,  l: 'Cumplimiento' }
    ].forEach(({ v, l }) => {
        const cell = document.createElement('div');
        cell.className = 'gauge-cell glass-panel';
        wrap.appendChild(cell);
        renderGauge(cell, v, l);
    });
}

function renderTablaLideres() {
    const wrap = document.getElementById('tabla-lideres');
    const lideres = Object.entries(users).filter(([, u]) => esLider(u.role));

    let html = `
        <table class="custom-table" style="width:100%;">
            <thead><tr>
                <th>Líder</th><th>Cargo</th><th>Área</th><th>Asignadas</th><th>Completadas</th><th>Pendientes</th><th>Rendimiento</th>
            </tr></thead>
            <tbody>
    `;
    lideres.forEach(([id, u]) => {
        const s = statsPorLider(tasks, id);
        const rendDisplay = s.rendimiento == null ? '—' : `${s.rendimiento}%`;
        const rendColor = s.rendimiento == null ? '#888' : (s.rendimiento >= 70 ? '#10b981' : s.rendimiento >= 40 ? '#f59e0b' : '#ef4444');
        html += `
            <tr>
                <td><strong>${u.name}</strong><br><small style="color:var(--text-secondary)">${id}</small></td>
                <td>${u.cargo || u.role}</td>
                <td><small style="color:var(--text-secondary)">${u.area || '—'}</small></td>
                <td>${s.asignadas}</td>
                <td>${s.completadas}</td>
                <td>${s.pendientes}</td>
                <td style="color:${rendColor}; font-weight:700;">${rendDisplay}</td>
            </tr>
        `;
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;
}

function renderMermaCards() {
    const wrap = document.getElementById('merma-cards');
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const hoy = mermas.filter(m => m.fecha >= inicioDia.getTime());
    const valorHoy = hoy.reduce((s, m) => s + m.valor, 0);
    const cantidadHoy = hoy.reduce((s, m) => s + m.cantidad, 0);
    const productosHoy = new Set(hoy.map(m => m.ean)).size;

    // Top 5 productos con más merma (todo el histórico)
    const porProducto = {};
    mermas.forEach(m => {
        if (!porProducto[m.ean]) porProducto[m.ean] = { desc: m.productoDesc, cantidad: 0, valor: 0 };
        porProducto[m.ean].cantidad += m.cantidad;
        porProducto[m.ean].valor    += m.valor;
    });
    const top5 = Object.values(porProducto).sort((a, b) => b.valor - a.valor).slice(0, 5);

    wrap.innerHTML = `
        <div class="merma-card glass-panel">
            <i class="fa-solid fa-arrow-trend-down stat-icon danger"></i>
            <div>
                <h4>Merma del Día</h4>
                <div class="stat-value">${fmtMoney(valorHoy)}</div>
                <small>${cantidadHoy} unidades · ${productosHoy} productos</small>
            </div>
        </div>
        <div class="merma-card glass-panel">
            <i class="fa-solid fa-box-archive stat-icon warning"></i>
            <div>
                <h4>Total Histórico</h4>
                <div class="stat-value">${fmtMoney(mermas.reduce((s,m)=>s+m.valor,0))}</div>
                <small>${mermas.length} registros</small>
            </div>
        </div>
        <div class="merma-card glass-panel" style="grid-column: span 2;">
            <i class="fa-solid fa-ranking-star stat-icon info"></i>
            <div style="flex:1;">
                <h4>Top productos con merma</h4>
                <ol style="margin:0.5rem 0 0 1.2rem; padding:0; font-size:0.9rem;">
                    ${top5.map(p => `<li>${p.desc} <span style="color:var(--text-secondary)">— ${p.cantidad} u. · ${fmtMoney(p.valor)}</span></li>`).join('')}
                </ol>
            </div>
        </div>
    `;
}

function renderHistorialMermas() {
    const wrap = document.getElementById('historial-mermas');
    const recientes = [...mermas].sort((a, b) => b.fecha - a.fecha).slice(0, 20);

    wrap.innerHTML = `
        <table class="custom-table" style="width:100%;">
            <thead><tr>
                <th>Fecha</th><th>Producto</th><th>Cantidad</th><th>Valor</th><th>Motivo</th><th>Origen</th>
            </tr></thead>
            <tbody>
                ${recientes.map(m => `
                    <tr>
                        <td>${fmtFecha(m.fecha)}</td>
                        <td>${m.productoDesc}</td>
                        <td>${m.cantidad}</td>
                        <td>${fmtMoney(m.valor)}</td>
                        <td><span class="badge">${m.motivo}</span></td>
                        <td><small style="color:var(--text-secondary)">${m.origen}</small></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

export function renderDashboardEjecutivo() {
    renderGauges();
    renderTablaLideres();
    renderMermaCards();
    renderHistorialMermas();
}
