// Centro de notificaciones — panel persistente con badge counter.
// Diferente al toast `showNotification` que se desvanece tras 3s.

import { registrarColeccion, reemplazarArray, guardarTodo } from '../storage/persistencia.js';

export let notificacionesCentro = [];

// tipo: 'tarea-asignada' | 'tarea-vencida' | 'inventario-bajo' | 'aprobacion' | 'sistema'
export function emitirNotificacion({ destinatario, tipo, titulo, detalle, link }) {
    notificacionesCentro.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        destinatario,  // userId o '*' para todos
        tipo,
        titulo,
        detalle: detalle || '',
        link: link || null,
        leida: false
    });
    if (notificacionesCentro.length > 200) notificacionesCentro.length = 200;
    guardarTodo();
    actualizarBadge();
}

export function marcarLeida(id) {
    const n = notificacionesCentro.find(x => x.id === id);
    if (n) { n.leida = true; guardarTodo(); }
}

export function marcarTodasLeidas(userId) {
    notificacionesCentro
        .filter(n => n.destinatario === userId || n.destinatario === '*')
        .forEach(n => n.leida = true);
    guardarTodo();
    actualizarBadge();
}

export function noLeidasParaUsuario(userId) {
    return notificacionesCentro.filter(n =>
        (n.destinatario === userId || n.destinatario === '*') && !n.leida
    ).length;
}

export function actualizarBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const nameEl = document.getElementById('current-user-name');
    const usuario = nameEl ? nameEl.dataset.userid : null;
    if (!usuario) { badge.classList.add('hidden'); return; }
    const n = noLeidasParaUsuario(usuario);
    if (n === 0) badge.classList.add('hidden');
    else {
        badge.textContent = n > 9 ? '9+' : String(n);
        badge.classList.remove('hidden');
    }
}

const COLOR_TIPO = {
    'tarea-asignada':  '#3b82f6',
    'tarea-vencida':   '#ef4444',
    'inventario-bajo': '#f59e0b',
    'aprobacion':      '#a855f7',
    'sistema':         '#6b7280'
};
const ICONO_TIPO = {
    'tarea-asignada':  'fa-list-check',
    'tarea-vencida':   'fa-triangle-exclamation',
    'inventario-bajo': 'fa-box-open',
    'aprobacion':      'fa-clipboard-check',
    'sistema':         'fa-bell'
};

export function abrirCentroNotificaciones() {
    const nameEl = document.getElementById('current-user-name');
    const usuario = nameEl ? nameEl.dataset.userid : null;
    if (!usuario) return;

    renderCentro(usuario);
    document.getElementById('modal-notif-centro').classList.remove('hidden');
}

function renderCentro(usuario) {
    const wrap = document.getElementById('notif-lista');
    const lista = notificacionesCentro.filter(n => n.destinatario === usuario || n.destinatario === '*');

    if (lista.length === 0) {
        wrap.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">Sin notificaciones.</p>';
        return;
    }

    const fmtFecha = (ms) => {
        const diff = Date.now() - ms;
        if (diff < 60_000)      return 'hace un momento';
        if (diff < 3_600_000)   return `hace ${Math.floor(diff/60_000)}m`;
        if (diff < 86_400_000)  return `hace ${Math.floor(diff/3_600_000)}h`;
        return new Date(ms).toLocaleString('es-DO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    };

    wrap.innerHTML = lista.map(n => `
        <div data-id="${n.id}" class="notif-item" style="display:flex; gap:0.8rem; padding:0.8rem; background:rgba(0,0,0,${n.leida ? '0.1' : '0.25'}); border-left:4px solid ${COLOR_TIPO[n.tipo] || '#6b7280'}; border-radius:8px; margin-bottom:0.5rem; cursor:pointer;">
            <i class="fa-solid ${ICONO_TIPO[n.tipo] || 'fa-bell'} stat-icon" style="color:${COLOR_TIPO[n.tipo] || '#6b7280'}; font-size:1.4rem; align-self:flex-start;"></i>
            <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>${n.titulo}</strong>
                    <small style="color:var(--text-secondary);">${fmtFecha(n.fecha)}</small>
                </div>
                ${n.detalle ? `<p style="margin:0.2rem 0 0; font-size:0.85rem; color:var(--text-secondary);">${n.detalle}</p>` : ''}
                ${!n.leida ? '<span class="badge" style="background:#3b82f6; margin-top:0.3rem;">Nueva</span>' : ''}
            </div>
        </div>
    `).join('');

    wrap.querySelectorAll('.notif-item').forEach(el => {
        el.addEventListener('click', () => {
            marcarLeida(parseFloat(el.dataset.id));
            renderCentro(usuario);
            actualizarBadge();
        });
    });
}

export function handleMarcarTodasLeidas() {
    const nameEl = document.getElementById('current-user-name');
    const usuario = nameEl ? nameEl.dataset.userid : null;
    if (!usuario) return;
    marcarTodasLeidas(usuario);
    renderCentro(usuario);
}

registrarColeccion('notificacionesCentro', () => notificacionesCentro, v => reemplazarArray(notificacionesCentro, v));
