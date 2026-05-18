// Búsqueda global: productos, tareas, usuarios, mermas, pedidos, materiales.

import { products } from '../inventario/productos.js';
import { tasks } from '../tareas/data.js';
import { users } from '../usuarios/data.js';
import { mermas } from '../mermas/data.js';
import { pedidos } from '../pedidos/data.js';
import { materiales } from '../suministros/data.js';

function buscar(termino) {
    const t = termino.toLowerCase().trim();
    if (!t) return [];

    const resultados = [];

    // Productos: busca en los primeros 5000 (los 20k son random)
    products.slice(0, 5000).forEach(p => {
        if (p.desc.toLowerCase().includes(t) || p.ean.includes(t) || p.cat.toLowerCase().includes(t)) {
            resultados.push({ tipo: 'producto', titulo: p.desc, detalle: `EAN: ${p.ean} · ${p.cat} · stock ${p.stock}`, icono: 'fa-barcode', color: '#3b82f6' });
        }
    });

    // Tareas
    tasks.forEach(task => {
        if (task.type.toLowerCase().includes(t) || (task.desc || '').toLowerCase().includes(t) || (task.assignedTo || '').toLowerCase().includes(t)) {
            resultados.push({
                tipo: 'tarea',
                titulo: task.type,
                detalle: `${task.desc} — ${task.assignedTo} · ${task.status}`,
                icono: 'fa-list-check',
                color: task.status === 'completed' ? '#10b981' : '#f59e0b'
            });
        }
    });

    // Usuarios
    Object.entries(users).forEach(([id, u]) => {
        if (id.toLowerCase().includes(t) || u.name.toLowerCase().includes(t) || u.role.toLowerCase().includes(t) || (u.cargo || '').toLowerCase().includes(t)) {
            resultados.push({
                tipo: 'usuario',
                titulo: u.name + ' (' + id + ')',
                detalle: `${u.cargo || u.role}${u.area ? ' · ' + u.area : ''}`,
                icono: 'fa-user',
                color: '#a855f7'
            });
        }
    });

    // Mermas
    mermas.forEach(m => {
        if (m.productoDesc.toLowerCase().includes(t) || (m.motivo || '').toLowerCase().includes(t)) {
            resultados.push({
                tipo: 'merma',
                titulo: m.productoDesc,
                detalle: `${m.cantidad}u · $${m.valor} · ${m.motivo}`,
                icono: 'fa-arrow-trend-down',
                color: '#ef4444'
            });
        }
    });

    // Pedidos
    pedidos.forEach(p => {
        const matches = (p.items || []).some(i => i.producto.toLowerCase().includes(t)) || (p.solicitadoPor || '').toLowerCase().includes(t);
        if (matches) {
            resultados.push({
                tipo: 'pedido',
                titulo: `Pedido ${p.tipo}`,
                detalle: `por ${p.solicitadoPor} · ${(p.items || []).length} item(s)`,
                icono: p.tipo === 'vegetales' ? 'fa-carrot' : 'fa-drumstick-bite',
                color: '#10b981'
            });
        }
    });

    // Materiales
    materiales.forEach(m => {
        if (m.descripcion.toLowerCase().includes(t) || m.ean.includes(t) || (m.categoria || '').toLowerCase().includes(t)) {
            resultados.push({
                tipo: 'material',
                titulo: m.descripcion,
                detalle: `EAN: ${m.ean} · stock ${m.stock} · ${m.categoria}`,
                icono: 'fa-warehouse',
                color: '#f97316'
            });
        }
    });

    return resultados.slice(0, 50);
}

function renderResultados(resultados, termino) {
    const wrap = document.getElementById('busqueda-resultados');
    if (!termino) {
        wrap.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">Escribe para buscar en productos, tareas, usuarios, mermas, pedidos y materiales.</p>';
        return;
    }
    if (resultados.length === 0) {
        wrap.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:1rem;">Sin resultados para <strong>"${termino}"</strong>.</p>`;
        return;
    }

    const porTipo = {};
    resultados.forEach(r => { (porTipo[r.tipo] = porTipo[r.tipo] || []).push(r); });

    wrap.innerHTML = Object.entries(porTipo).map(([tipo, items]) => `
        <h4 style="margin:0.8rem 0 0.4rem; text-transform:capitalize;">${tipo}s (${items.length})</h4>
        <div>
            ${items.map(r => `
                <div style="display:flex; gap:0.7rem; align-items:center; padding:0.6rem; background:rgba(0,0,0,0.15); border-left:3px solid ${r.color}; border-radius:6px; margin-bottom:0.3rem;">
                    <i class="fa-solid ${r.icono}" style="color:${r.color}; font-size:1.2rem;"></i>
                    <div>
                        <strong>${r.titulo}</strong>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">${r.detalle}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

export function abrirBuscadorGlobal() {
    const input = document.getElementById('busqueda-input');
    input.value = '';
    renderResultados([], '');
    document.getElementById('modal-busqueda').classList.remove('hidden');
    setTimeout(() => input.focus(), 100);
}

let debounce = null;
export function handleBusquedaInput() {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
        const t = document.getElementById('busqueda-input').value;
        renderResultados(buscar(t), t);
    }, 150);
}
