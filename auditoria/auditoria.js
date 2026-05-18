// Sistema simple de auditoría: registra acciones clave con usuario, fecha y detalle.
// Cada entrada: { id, fecha, usuario, accion, detalle }

export let auditoria = [];

export function registrarAccion(usuario, accion, detalle = '') {
    auditoria.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        usuario: usuario || '(anónimo)',
        accion,
        detalle
    });
    // Limite suave para no crecer indefinidamente en memoria
    if (auditoria.length > 500) auditoria.length = 500;
}

function fmtFecha(ms) {
    return new Date(ms).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function abrirModalAuditoria() {
    renderAuditoria();
    document.getElementById('modal-auditoria').classList.remove('hidden');
}

function renderAuditoria() {
    const wrap = document.getElementById('auditoria-tabla');
    const filtro = (document.getElementById('auditoria-filtro')?.value || '').toLowerCase();

    const filtradas = filtro
        ? auditoria.filter(a =>
            (a.usuario || '').toLowerCase().includes(filtro) ||
            (a.accion  || '').toLowerCase().includes(filtro) ||
            (a.detalle || '').toLowerCase().includes(filtro))
        : auditoria;

    if (filtradas.length === 0) {
        wrap.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding:1rem;">Sin acciones registradas.</p>';
        return;
    }

    wrap.innerHTML = `
        <table class="custom-table" style="width:100%;">
            <thead><tr>
                <th style="width:170px;">Fecha</th>
                <th style="width:140px;">Usuario</th>
                <th>Acción</th>
                <th>Detalle</th>
            </tr></thead>
            <tbody>
                ${filtradas.slice(0, 200).map(a => `
                    <tr>
                        <td><small>${fmtFecha(a.fecha)}</small></td>
                        <td><strong>${a.usuario}</strong></td>
                        <td>${a.accion}</td>
                        <td><small style="color:var(--text-secondary)">${a.detalle}</small></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style="text-align:right; margin-top:0.5rem; color:var(--text-secondary); font-size:0.8rem;">
            Mostrando ${Math.min(200, filtradas.length)} de ${filtradas.length} registros.
        </p>
    `;
}

export function handleFiltroAuditoria() {
    renderAuditoria();
}
