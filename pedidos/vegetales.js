import { VEGETALES, registrarPedido, pedidos } from './data.js';
import { currentUser } from '../autenticacion/auth.js';
import { showNotification } from '../shell/notificaciones.js';
import { registrarAccion } from '../auditoria/auditoria.js';

function renderListaVegetalesEnModal() {
    const lista = document.getElementById('pedido-veg-lista');
    lista.innerHTML = VEGETALES.map(v => `
        <div style="display:grid; grid-template-columns:1fr auto auto; gap:0.5rem; align-items:center; padding:0.4rem; background:rgba(0,0,0,0.15); border-radius:6px; margin-bottom:0.3rem;">
            <span><i class="fa-solid fa-leaf" style="color:#10b981; margin-right:0.4rem;"></i> ${v}</span>
            <input type="number" min="0" step="1" data-vegetal="${v}" class="veg-cantidad" placeholder="0" style="width:80px; padding:0.3rem; background:rgba(0,0,0,0.3); border:none; border-radius:4px; color:white; text-align:right;">
            <small style="color:var(--text-secondary)">canastos</small>
        </div>
    `).join('');
}

function renderHistorialVegetales() {
    const hist = document.getElementById('pedido-veg-historial');
    const propios = pedidos.filter(p => p.tipo === 'vegetales').slice(0, 8);
    if (propios.length === 0) {
        hist.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:0.5rem;">Sin pedidos previos.</p>';
        return;
    }
    hist.innerHTML = propios.map(p => {
        const total = p.items.reduce((s, i) => s + i.cantidad, 0);
        const fecha = new Date(p.fecha).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        return `
            <div style="background:rgba(0,0,0,0.2); padding:0.6rem; border-radius:8px; margin-bottom:0.4rem;">
                <strong>${fecha}</strong> — ${p.solicitadoPor} — ${total} canastos
                <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.2rem;">
                    ${p.items.map(i => `${i.producto}: ${i.cantidad}`).join(' · ')}
                </div>
            </div>
        `;
    }).join('');
}

export function abrirModalPedidoVegetales() {
    renderListaVegetalesEnModal();
    renderHistorialVegetales();
    document.getElementById('pedido-veg-notas').value = '';
    document.getElementById('modal-pedido-vegetales').classList.remove('hidden');
}

export function handleEnviarPedidoVegetales(e) {
    e.preventDefault();
    const items = [];
    document.querySelectorAll('.veg-cantidad').forEach(inp => {
        const c = parseInt(inp.value);
        if (c > 0) items.push({ producto: inp.dataset.vegetal, cantidad: c, unidad: 'canastos' });
    });
    if (items.length === 0) {
        alert('Especifica al menos un vegetal con cantidad mayor a 0.');
        return;
    }
    registrarPedido({
        tipo: 'vegetales',
        items,
        solicitadoPor: currentUser.id,
        notas: document.getElementById('pedido-veg-notas').value.trim() || ''
    });
    const total = items.reduce((s, i) => s + i.cantidad, 0);
    registrarAccion(currentUser.id, 'Pedido de vegetales', `${items.length} producto(s), ${total} canastos`);
    showNotification(`Pedido enviado: ${items.length} vegetal(es), ${total} canastos.`);
    document.getElementById('modal-pedido-vegetales').classList.add('hidden');
}
