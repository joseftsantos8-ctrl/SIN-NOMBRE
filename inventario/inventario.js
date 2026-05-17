import { products } from './productos.js';
import { tasks } from '../tareas/data.js';
import { users } from '../usuarios/data.js';
import { addNavLink } from '../shell/navegacion.js';
import { showNotification } from '../shell/notificaciones.js';
import { asignaciones, setAsignacion } from './asignaciones.js';
import { dividirProductos } from './division.js';

function getColaboradores() {
    return Object.entries(users)
        .filter(([, u]) => u.role === 'Colaborador')
        .map(([id, u]) => ({ id, name: u.name }));
}

function getCategoriasDisponibles() {
    const cats = new Set();
    products.forEach(p => cats.add(p.cat));
    return Array.from(cats).sort();
}

function renderAcordeonAsignaciones() {
    const wrap = document.getElementById('asignaciones-categorias');
    const colabs = getColaboradores();
    const cats   = getCategoriasDisponibles();

    let html = `
        <details style="margin-bottom:1rem; background:rgba(0,0,0,0.15); border-radius:10px; padding:0.5rem 1rem;">
            <summary style="cursor:pointer; padding:0.5rem 0; font-weight:600;">
                <i class="fa-solid fa-sliders"></i> Asignar Categorías a Colaboradores
            </summary>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; padding:1rem 0;">
    `;
    colabs.forEach(c => {
        const asignadas = asignaciones[c.id] || [];
        html += `
            <div style="background:rgba(0,0,0,0.25); padding:0.8rem; border-radius:8px;">
                <h4 style="margin:0 0 0.5rem 0; font-size:0.95rem;">${c.name}</h4>
                <div style="max-height:180px; overflow-y:auto;">
                    ${cats.map(cat => `
                        <label style="display:block; padding:0.2rem 0; font-size:0.85rem;">
                            <input type="checkbox" class="cat-asign" data-colab="${c.id}" value="${cat}" ${asignadas.includes(cat) ? 'checked' : ''}>
                            ${cat}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });
    html += `</div></details>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('input.cat-asign').forEach(cb => {
        cb.addEventListener('change', () => {
            const colab = cb.dataset.colab;
            const cat   = cb.value;
            const actual = asignaciones[colab] || [];
            if (cb.checked) {
                if (!actual.includes(cat)) setAsignacion(colab, [...actual, cat]);
            } else {
                setAsignacion(colab, actual.filter(c => c !== cat));
            }
        });
    });
}

export function setupInventario() {
    document.getElementById('page-title').textContent = 'Control de Inventario Logístico';
    addNavLink('Módulo Principal', 'fa-home');

    renderAcordeonAsignaciones();

    const activeInventoryEans = new Set();
    tasks
        .filter(t => (t.type === 'Inventario Cíclico' || t.type.toLowerCase().includes('hueco')) && t.status !== 'completed')
        .forEach(t => { if (t.data) t.data.forEach(prod => activeInventoryEans.add(prod.ean)); });

    const grid    = document.getElementById('product-selector-grid');
    grid.innerHTML = '';

    let itemsRendered = 0;
    for (const p of products) {
        if (itemsRendered >= 100) break;
        if (activeInventoryEans.has(p.ean)) continue;
        grid.innerHTML += `
            <label class="product-checkbox-item">
                <input type="checkbox" class="inv-checkbox" value="${p.id}" onchange="updateInvCounter()">
                <div><strong>${p.desc}</strong><span>EAN: ${p.ean} | Cat: ${p.cat} | Stock: ${p.stock}</span></div>
            </label>`;
        itemsRendered++;
    }
}

export function enviarInventarioManual() {
    const checks = document.querySelectorAll('.inv-checkbox:checked');
    if (checks.length === 0 || checks.length > 20) return alert('Selecciona entre 1 y 20 productos.');

    const colabs = getColaboradores().map(c => c.id);
    if (colabs.length === 0) return alert('No hay colaboradores disponibles.');

    const selectedProds = [];
    checks.forEach(cb => {
        const prod = products.find(p => p.id === cb.value);
        if (prod) selectedProds.push(prod);
    });

    const reparto = dividirProductos(selectedProds, asignaciones, colabs);
    let creadas = 0;
    const resumen = [];

    const ahora = Date.now();
    Object.entries(reparto).forEach(([colabId, prods]) => {
        if (prods.length === 0) return;
        tasks.push({
            id:          ahora + Math.random(),
            type:        'Inventario Cíclico',
            desc:        `Conteo de ${prods.length} producto(s).`,
            status:      'pending',
            assignedTo:  colabId,
            assignedBy:  'A.FISH',
            createdAt:   ahora,
            dueAt:       ahora + 24 * 3600 * 1000,
            completedAt: null,
            data:        prods.map(p => ({ ean: p.ean, desc: p.desc, stock: p.stock }))
        });
        creadas++;
        resumen.push(`${colabId}: ${prods.length}`);
    });

    showNotification(`${creadas} tareas creadas — ${resumen.join(' | ')}`);
    document.getElementById('inventario-panel').classList.add('hidden');
    checks.forEach(c => c.checked = false);
    updateInvCounter();
}

window.updateInvCounter = function() {
    const count = document.querySelectorAll('.inv-checkbox:checked').length;
    document.getElementById('inv-counter').textContent = `${count} / 20 seleccionados`;
};
