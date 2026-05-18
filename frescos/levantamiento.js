import { currentUser } from '../autenticacion/auth.js';
import { showNotification } from '../shell/notificaciones.js';
import { registrarAccion } from '../auditoria/auditoria.js';
import { registrarColeccion, reemplazarArray, guardarTodo } from '../storage/persistencia.js';

// Cada registro de levantamiento:
// { id, fecha, area, evaluadoPor, items: [{producto, frescura, presentacion, precio, temperatura, observacion}] }
export let levantamientos = [];

registrarColeccion('levantamientos', () => levantamientos, v => reemplazarArray(levantamientos, v));

const AREAS_FRESCOS = ['Carnicería', 'Deli', 'Lácteos', 'Frutas y vegetales', 'Panadería'];
const ESCALA = [
    { v: 5, label: 'Excelente', color: '#10b981' },
    { v: 4, label: 'Bueno',     color: '#84cc16' },
    { v: 3, label: 'Regular',   color: '#f59e0b' },
    { v: 2, label: 'Malo',      color: '#f97316' },
    { v: 1, label: 'Crítico',   color: '#ef4444' }
];

let filasLevantamiento = [];  // estado del modal mientras se llena

function renderTabla() {
    const tbody = document.getElementById('lev-tbody');
    if (filasLevantamiento.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding:0.8rem;">Sin productos agregados — usa el formulario superior.</td></tr>';
        return;
    }
    tbody.innerHTML = filasLevantamiento.map((it, i) => `
        <tr>
            <td>${it.producto}</td>
            <td><span class="badge" style="background:${ESCALA.find(e=>e.v===it.frescura)?.color || '#888'}">${ESCALA.find(e=>e.v===it.frescura)?.label || '-'}</span></td>
            <td><span class="badge" style="background:${ESCALA.find(e=>e.v===it.presentacion)?.color || '#888'}">${ESCALA.find(e=>e.v===it.presentacion)?.label || '-'}</span></td>
            <td>${it.precio || '—'}</td>
            <td>${it.temperatura != null ? it.temperatura + '°C' : '—'}</td>
            <td>
                <small style="color:var(--text-secondary)">${it.observacion || ''}</small>
                <button type="button" data-i="${i}" class="lev-eliminar" style="background:none; border:none; color:#ef4444; cursor:pointer; margin-left:0.5rem;"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    tbody.querySelectorAll('.lev-eliminar').forEach(b => b.addEventListener('click', () => {
        filasLevantamiento.splice(parseInt(b.dataset.i), 1);
        renderTabla();
    }));
}

function renderHistorial() {
    const wrap = document.getElementById('lev-historial');
    if (levantamientos.length === 0) {
        wrap.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:0.5rem;">Sin levantamientos previos.</p>';
        return;
    }
    wrap.innerHTML = levantamientos.slice(0, 5).map(l => {
        const fecha = new Date(l.fecha).toLocaleString('es-DO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        return `
            <div style="background:rgba(0,0,0,0.2); padding:0.6rem; border-radius:8px; margin-bottom:0.4rem;">
                <strong>${fecha}</strong> — ${l.area} — por ${l.evaluadoPor} — ${l.items.length} producto(s)
            </div>
        `;
    }).join('');
}

export function abrirModalLevantamientoFrescos() {
    filasLevantamiento = [];
    const selArea = document.getElementById('lev-area');
    selArea.innerHTML = AREAS_FRESCOS.map(a => `<option value="${a}">${a}</option>`).join('');
    const selFres = document.getElementById('lev-frescura');
    const selPres = document.getElementById('lev-presentacion');
    [selFres, selPres].forEach(s => {
        s.innerHTML = ESCALA.map(e => `<option value="${e.v}">${e.v} — ${e.label}</option>`).join('');
        s.value = '4';
    });
    document.getElementById('lev-producto').value = '';
    document.getElementById('lev-precio').value = '';
    document.getElementById('lev-temperatura').value = '';
    document.getElementById('lev-observacion').value = '';
    renderTabla();
    renderHistorial();
    document.getElementById('modal-levantamiento-frescos').classList.remove('hidden');
}

export function handleAgregarFilaLevantamiento(e) {
    e.preventDefault();
    const producto = document.getElementById('lev-producto').value.trim();
    if (!producto) return;
    filasLevantamiento.push({
        producto,
        frescura:     parseInt(document.getElementById('lev-frescura').value),
        presentacion: parseInt(document.getElementById('lev-presentacion').value),
        precio:       document.getElementById('lev-precio').value.trim(),
        temperatura:  document.getElementById('lev-temperatura').value !== '' ? parseFloat(document.getElementById('lev-temperatura').value) : null,
        observacion:  document.getElementById('lev-observacion').value.trim()
    });
    document.getElementById('lev-producto').value = '';
    document.getElementById('lev-precio').value = '';
    document.getElementById('lev-temperatura').value = '';
    document.getElementById('lev-observacion').value = '';
    renderTabla();
}

export function handleGuardarLevantamiento() {
    if (filasLevantamiento.length === 0) {
        alert('Agrega al menos un producto antes de guardar.');
        return;
    }
    levantamientos.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        area: document.getElementById('lev-area').value,
        evaluadoPor: currentUser.id,
        items: [...filasLevantamiento]
    });
    const ultimo = levantamientos[0];
    filasLevantamiento = [];
    guardarTodo();
    registrarAccion(currentUser.id, 'Levantamiento de frescos', `Área: ${ultimo.area}, ${ultimo.items.length} producto(s)`);
    showNotification(`Levantamiento guardado (${ultimo.items.length} productos).`);
    document.getElementById('modal-levantamiento-frescos').classList.add('hidden');
}
