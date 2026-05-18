// Solicitudes de suministros — flujo: colaborador/líder crea, J.ARECHE entrega
// (con cantidad parcial si aplica + justificación), supervisor puede rechazar.

import { AREAS_SUMINISTROS, materiales, solicitudesSuministros, registrarSolicitud, actualizarSolicitud, registrarConsumo } from './data.js';
import { currentUser } from '../autenticacion/auth.js';
import { showNotification } from '../shell/notificaciones.js';
import { registrarAccion } from '../auditoria/auditoria.js';

let filasSolicitud = [];

function renderSelectArea() {
    const sel = document.getElementById('sol-area');
    sel.innerHTML = '<option value="" disabled selected>Selecciona el área</option>' +
        AREAS_SUMINISTROS.map(a => `<option value="${a}">${a}</option>`).join('');
}

function renderSelectMaterial() {
    const sel = document.getElementById('sol-material');
    sel.innerHTML = '<option value="" disabled selected>Material...</option>' +
        materiales.map(m => `<option value="${m.id}">${m.descripcion} (stock ${m.stock})</option>`).join('');
}

function renderFilasSolicitud() {
    const tbody = document.getElementById('sol-tbody');
    if (filasSolicitud.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-secondary); padding:0.8rem;">Sin materiales agregados.</td></tr>';
        return;
    }
    tbody.innerHTML = filasSolicitud.map((f, i) => `
        <tr>
            <td>${f.descripcion}</td>
            <td><small style="color:var(--text-secondary)">stock ${f.stockActual}</small></td>
            <td>${f.cantidadSolicitada}</td>
            <td>
                <button type="button" data-i="${i}" class="sol-eliminar" style="background:none; border:none; color:#ef4444; cursor:pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    tbody.querySelectorAll('.sol-eliminar').forEach(b => b.addEventListener('click', () => {
        filasSolicitud.splice(parseInt(b.dataset.i), 1);
        renderFilasSolicitud();
    }));
}

function renderListaSolicitudes() {
    const wrap = document.getElementById('sol-lista');
    if (solicitudesSuministros.length === 0) {
        wrap.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No hay solicitudes registradas.</p>';
        return;
    }

    const fmtFecha = (ms) => new Date(ms).toLocaleString('es-DO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    const colorEstado = (e) => ({
        'pendiente': '#f59e0b', 'aprobada': '#3b82f6', 'rechazada': '#ef4444',
        'entregada': '#10b981', 'parcial':  '#f97316'
    }[e] || '#888');

    wrap.innerHTML = `
        <table class="custom-table" style="width:100%;">
            <thead><tr>
                <th>Fecha</th><th>Área</th><th>Solicitado por</th><th>Items</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody>
                ${solicitudesSuministros.slice(0, 30).map(s => `
                    <tr>
                        <td><small>${fmtFecha(s.fecha)}</small></td>
                        <td>${s.area}</td>
                        <td><strong>${s.solicitadoPor}</strong></td>
                        <td>
                            ${s.items.map(it => {
                                const parcial = it.cantidadEntregada != null && it.cantidadEntregada < it.cantidadSolicitada
                                    ? ` <small style="color:#f97316;">(entregado ${it.cantidadEntregada})</small>` : '';
                                const completo = it.cantidadEntregada != null && it.cantidadEntregada >= it.cantidadSolicitada
                                    ? ` <small style="color:#10b981;">✓ ${it.cantidadEntregada}</small>` : '';
                                return `<div style="font-size:0.85rem;">${it.descripcion}: ${it.cantidadSolicitada}${parcial}${completo}</div>`;
                            }).join('')}
                            ${s.justificacionParcial ? `<div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.2rem;"><em>Justif: ${s.justificacionParcial}</em></div>` : ''}
                        </td>
                        <td><span class="badge" style="background:${colorEstado(s.estado)}">${s.estado}</span></td>
                        <td>
                            ${s.estado === 'pendiente' ? `
                                <button type="button" class="btn-sol-aprobar"  data-id="${s.id}" style="background:#10b981; border:none; color:white; padding:0.3rem 0.5rem; border-radius:4px; cursor:pointer; margin:2px;"><i class="fa-solid fa-check"></i></button>
                                <button type="button" class="btn-sol-rechazar" data-id="${s.id}" style="background:#ef4444; border:none; color:white; padding:0.3rem 0.5rem; border-radius:4px; cursor:pointer; margin:2px;"><i class="fa-solid fa-xmark"></i></button>
                            ` : ''}
                            ${s.estado === 'aprobada' ? `
                                <button type="button" class="btn-sol-entregar" data-id="${s.id}" style="background:#3b82f6; border:none; color:white; padding:0.3rem 0.5rem; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-truck"></i> Entregar</button>
                            ` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    wrap.querySelectorAll('.btn-sol-aprobar').forEach(b => b.addEventListener('click', () => aprobarSolicitud(parseFloat(b.dataset.id))));
    wrap.querySelectorAll('.btn-sol-rechazar').forEach(b => b.addEventListener('click', () => rechazarSolicitud(parseFloat(b.dataset.id))));
    wrap.querySelectorAll('.btn-sol-entregar').forEach(b => b.addEventListener('click', () => entregarSolicitud(parseFloat(b.dataset.id))));
}

function aprobarSolicitud(id) {
    actualizarSolicitud(id, { estado: 'aprobada', aprobadoPor: currentUser.id });
    registrarAccion(currentUser.id, 'Aprobar solicitud suministros', `ID ${id}`);
    showNotification('Solicitud aprobada.');
    renderListaSolicitudes();
}

function rechazarSolicitud(id) {
    const motivo = prompt('Motivo del rechazo:');
    if (!motivo) return;
    actualizarSolicitud(id, { estado: 'rechazada', aprobadoPor: currentUser.id, justificacionParcial: motivo });
    registrarAccion(currentUser.id, 'Rechazar solicitud suministros', `ID ${id}: ${motivo}`);
    showNotification('Solicitud rechazada.');
    renderListaSolicitudes();
}

function entregarSolicitud(id) {
    const sol = solicitudesSuministros.find(s => s.id === id);
    if (!sol) return;

    let huboParcial = false;
    const itemsEntregados = sol.items.map(it => {
        const mat = materiales.find(m => m.id === it.materialId);
        const disponible = mat ? mat.stock : 0;
        let entregar = it.cantidadSolicitada;
        if (disponible < it.cantidadSolicitada) {
            entregar = disponible;
            huboParcial = true;
        }
        const cantidadEntregada = parseInt(prompt(
            `Cantidad a entregar de "${it.descripcion}" (solicitado ${it.cantidadSolicitada}, disponible ${disponible}):`,
            entregar
        ));
        if (isNaN(cantidadEntregada) || cantidadEntregada < 0) return null;

        if (cantidadEntregada < it.cantidadSolicitada) huboParcial = true;
        if (mat && cantidadEntregada > 0) {
            registrarConsumo({
                area: sol.area,
                materialId: it.materialId,
                descripcion: it.descripcion,
                cantidad: cantidadEntregada,
                responsable: currentUser.id
            });
        }
        return { ...it, cantidadEntregada };
    });

    if (itemsEntregados.some(it => it === null)) {
        alert('Entrega cancelada.');
        return;
    }

    let justificacion = '';
    if (huboParcial) {
        justificacion = prompt('Justificación obligatoria por la entrega parcial:');
        if (!justificacion) {
            alert('Sin justificación no puedes cerrar una entrega parcial.');
            return;
        }
    }

    actualizarSolicitud(id, {
        estado: huboParcial ? 'parcial' : 'entregada',
        fechaEntrega: Date.now(),
        items: itemsEntregados,
        justificacionParcial: justificacion || null,
        entregadoPor: currentUser.id
    });
    registrarAccion(currentUser.id, 'Entregar solicitud suministros', `ID ${id} ${huboParcial ? '(parcial)' : '(completa)'}`);
    showNotification(huboParcial ? 'Entrega parcial registrada.' : 'Entrega completada.');
    renderListaSolicitudes();
}

export function abrirModalSolicitudes() {
    filasSolicitud = [];
    renderSelectArea();
    renderSelectMaterial();
    document.getElementById('sol-cantidad').value = '';
    renderFilasSolicitud();
    renderListaSolicitudes();
    document.getElementById('modal-solicitudes').classList.remove('hidden');
}

export function handleAgregarFilaSolicitud(e) {
    e.preventDefault();
    const materialId = document.getElementById('sol-material').value;
    const cantidad   = parseInt(document.getElementById('sol-cantidad').value);
    if (!materialId || !cantidad || cantidad <= 0) return;
    const mat = materiales.find(m => m.id === materialId);
    if (!mat) return;
    filasSolicitud.push({
        materialId,
        descripcion: mat.descripcion,
        stockActual: mat.stock,
        cantidadSolicitada: cantidad
    });
    document.getElementById('sol-cantidad').value = '';
    renderFilasSolicitud();
}

export function handleEnviarSolicitud() {
    const area = document.getElementById('sol-area').value;
    if (!area) { alert('Selecciona un área.'); return; }
    if (filasSolicitud.length === 0) { alert('Agrega al menos un material.'); return; }

    registrarSolicitud({
        area,
        solicitadoPor: currentUser.id,
        items: filasSolicitud.map(f => ({
            materialId: f.materialId,
            descripcion: f.descripcion,
            cantidadSolicitada: f.cantidadSolicitada,
            cantidadEntregada: null
        }))
    });
    registrarAccion(currentUser.id, 'Crear solicitud suministros', `${area} - ${filasSolicitud.length} item(s)`);
    showNotification(`Solicitud enviada (${filasSolicitud.length} items).`);
    filasSolicitud = [];
    renderFilasSolicitud();
    renderListaSolicitudes();
}
