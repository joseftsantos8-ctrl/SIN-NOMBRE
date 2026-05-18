import { CARNES, registrarPedido, pedidos } from './data.js';
import { currentUser } from '../autenticacion/auth.js';
import { showNotification } from '../shell/notificaciones.js';
import { registrarAccion } from '../auditoria/auditoria.js';

function renderListaCarnesEnModal() {
    const lista = document.getElementById('pedido-car-lista');
    lista.innerHTML = CARNES.map(c => `
        <div style="display:grid; grid-template-columns:1fr auto auto; gap:0.5rem; align-items:center; padding:0.4rem; background:rgba(0,0,0,0.15); border-radius:6px; margin-bottom:0.3rem;">
            <span><i class="fa-solid fa-drumstick-bite" style="color:#ef4444; margin-right:0.4rem;"></i> ${c}</span>
            <input type="number" min="0" step="0.5" data-carne="${c}" class="car-cantidad" placeholder="0" style="width:80px; padding:0.3rem; background:rgba(0,0,0,0.3); border:none; border-radius:4px; color:white; text-align:right;">
            <small style="color:var(--text-secondary)">LB</small>
        </div>
    `).join('');
}

function renderHistorialCarnes() {
    const hist = document.getElementById('pedido-car-historial');
    const propios = pedidos.filter(p => p.tipo === 'carnes').slice(0, 8);
    if (propios.length === 0) {
        hist.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:0.5rem;">Sin pedidos previos.</p>';
        return;
    }
    hist.innerHTML = propios.map(p => {
        const total = p.items.reduce((s, i) => s + i.cantidad, 0);
        const fecha = new Date(p.fecha).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        return `
            <div style="background:rgba(0,0,0,0.2); padding:0.6rem; border-radius:8px; margin-bottom:0.4rem;">
                <strong>${fecha}</strong> — ${p.solicitadoPor} — ${total} LB
                <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.2rem;">
                    ${p.items.map(i => `${i.producto}: ${i.cantidad} LB`).join(' · ')}
                </div>
            </div>
        `;
    }).join('');
}

export function abrirModalPedidoCarnes() {
    renderListaCarnesEnModal();
    renderHistorialCarnes();
    document.getElementById('pedido-car-notas').value = '';
    document.getElementById('modal-pedido-carnes').classList.remove('hidden');
}

export function handleEnviarPedidoCarnes(e) {
    e.preventDefault();
    const items = [];
    document.querySelectorAll('.car-cantidad').forEach(inp => {
        const c = parseFloat(inp.value);
        if (c > 0) items.push({ producto: inp.dataset.carne, cantidad: c, unidad: 'libras' });
    });
    if (items.length === 0) {
        alert('Especifica al menos un tipo de carne con cantidad mayor a 0.');
        return;
    }
    registrarPedido({
        tipo: 'carnes',
        items,
        solicitadoPor: currentUser.id,
        notas: document.getElementById('pedido-car-notas').value.trim() || ''
    });
    const total = items.reduce((s, i) => s + i.cantidad, 0);
    registrarAccion(currentUser.id, 'Pedido de carnes', `${items.length} producto(s), ${total} LB`);
    showNotification(`Pedido enviado: ${items.length} producto(s), ${total} LB.`);
    document.getElementById('modal-pedido-carnes').classList.add('hidden');
}
