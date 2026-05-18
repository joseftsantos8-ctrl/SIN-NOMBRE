import { authenticate, logout } from './autenticacion/auth.js';
import { showDashboard, hideDashboard } from './shell/dashboard.js';
import { handleCrearUsuario } from './usuarios/admin.js';
import { abrirModalPerfil, handleGuardarPerfil } from './usuarios/perfil.js';
import { handleNuevaTarea, abrirModalLider } from './tareas/lider.js';
import { handleEjecutarTarea, handleCapturarEvidenciaClick, handleCamaraCapturar, handleCamaraCancelar } from './tareas/ejecutar.js';
import { enviarInventarioManual, setupInventario } from './inventario/inventario.js';
import { handleReporteNovedades } from './novedades/novedades.js';
import { showNotification } from './shell/notificaciones.js';
import { products } from './inventario/productos.js';
import { abrirModalNegativos, handleAgregarNegativo, repartirNegativos } from './inventario/negativos.js';
import { handleRegistrarMerma } from './mermas/registro.js';
import { handleEnviarPedidoVegetales } from './pedidos/vegetales.js';
import { handleEnviarPedidoCarnes } from './pedidos/carnes.js';
import { handleAgregarFilaLevantamiento, handleGuardarLevantamiento } from './frescos/levantamiento.js';
import { handleFiltroAuditoria, registrarAccion } from './auditoria/auditoria.js';
import { handleAgregarFilaSolicitud, handleEnviarSolicitud } from './suministros/solicitudes.js';
import { abrirCentroNotificaciones, handleMarcarTodasLeidas, actualizarBadge, emitirNotificacion } from './notificaciones-centro/centro.js';
import { materialesBajos } from './suministros/data.js';
import { abrirBuscadorGlobal, handleBusquedaInput } from './busqueda/busqueda.js';
import { exportarReporte } from './reportes/exportar.js';
import { cerrarEscaner, handleEscanerManual } from './escaner/escaner.js';
import { cargarTodo, resetearTodo } from './storage/persistencia.js';
import { tasks } from './tareas/data.js';

// --- Cargar estado persistido ANTES de cualquier render ---
const fueRestaurado = cargarTodo();
if (fueRestaurado) {
    console.log('[Sirena] Estado restaurado desde localStorage.');
}

// --- Registrar Service Worker (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[Sirena] Service Worker registrado:', reg.scope))
            .catch(err => console.warn('[Sirena] SW falló:', err));
    });
}

// Exponer para handlers inline en HTML dinámico
window.abrirModalPerfil = abrirModalPerfil;
window.abrirModalNegativos = abrirModalNegativos;
window.resetearSistema = resetearTodo;

// --- Fecha en header ---
document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// --- Autenticación ---
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId   = document.getElementById('username').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    const user     = authenticate(userId, password);

    if (user) {
        document.getElementById('login-error').classList.add('hidden');
        registrarAccion(userId, 'Login exitoso', `Rol: ${user.role}`);
        showDashboard();
        // Notificaciones de tareas tras login
        setTimeout(() => notificarTareasUsuario(userId), 800);
    } else {
        registrarAccion(userId || '(desconocido)', 'Login fallido', '');
        document.getElementById('login-error').classList.remove('hidden');
        const form = document.getElementById('login-form');
        form.classList.add('error');
        setTimeout(() => form.classList.remove('error'), 500);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    const idActual = document.getElementById('current-user-name').textContent || '(desconocido)';
    registrarAccion(idActual, 'Logout', '');
    logout();
    hideDashboard();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// --- Admin: crear usuario ---
document.getElementById('form-crear-usuario').addEventListener('submit', handleCrearUsuario);

// --- Admin: añadir artículo manualmente ---
document.getElementById('form-add-article').addEventListener('submit', (e) => {
    e.preventDefault();
    products.unshift({
        id:    Date.now().toString(),
        ean:   document.getElementById('add-art-ean').value,
        desc:  document.getElementById('add-art-desc').value,
        cat:   document.getElementById('add-art-cat').value,
        stock: parseInt(document.getElementById('add-art-stock').value)
    });
    document.getElementById('modal-add-article').classList.add('hidden');
    e.target.reset();
    showNotification('Artículo añadido correctamente');
    if (!document.getElementById('inventario-panel').classList.contains('hidden')) setupInventario();
});

// --- Admin: carga masiva desde Excel ---
document.getElementById('add-art-excel').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const data      = new Uint8Array(evt.target.result);
            const workbook  = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData  = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            let count = 0;
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row && row.length >= 2) {
                    products.unshift({
                        id:    Date.now().toString() + i,
                        ean:   (row[0] || '').toString(),
                        desc:  (row[1] || '').toString(),
                        cat:   (row[2] || 'General').toString(),
                        stock: parseInt(row[3]) || 0
                    });
                    count++;
                }
            }
            document.getElementById('modal-add-article').classList.add('hidden');
            e.target.value = '';
            showNotification(`${count} artículos añadidos desde Excel`);
            if (!document.getElementById('inventario-panel').classList.contains('hidden')) setupInventario();
        } catch (error) {
            alert('Error al leer el archivo Excel: verifica el formato e intenta de nuevo.');
            console.error(error);
        }
    };
    reader.readAsArrayBuffer(file);
});

// --- Líderes: tareas ---
document.getElementById('btn-nueva-tarea').addEventListener('click', abrirModalLider);
document.getElementById('btn-cerrar-modal').addEventListener('click', () =>
    document.getElementById('modal-nueva-tarea').classList.add('hidden'));
document.getElementById('form-nueva-tarea').addEventListener('submit', handleNuevaTarea);

// --- Novedades de personal ---
document.getElementById('form-reporte-novedades').addEventListener('submit', handleReporteNovedades);

// --- Ejecutar tarea (colaborador) ---
document.getElementById('form-ejecutar-tarea').addEventListener('submit', handleEjecutarTarea);
document.getElementById('btn-capturar-evidencia').addEventListener('click', handleCapturarEvidenciaClick);
document.getElementById('btn-camara-capturar').addEventListener('click', handleCamaraCapturar);
document.getElementById('btn-camara-cancelar').addEventListener('click', handleCamaraCancelar);

// --- Inventario ---
document.getElementById('btn-enviar-inv-manual').addEventListener('click', enviarInventarioManual);

// --- Negativos ---
document.getElementById('form-agregar-negativo').addEventListener('submit', handleAgregarNegativo);
document.getElementById('btn-repartir-negativos').addEventListener('click', repartirNegativos);

// --- Mermas ---
document.getElementById('form-registrar-merma').addEventListener('submit', handleRegistrarMerma);

// --- Pedidos vegetales ---
document.getElementById('form-pedido-vegetales').addEventListener('submit', handleEnviarPedidoVegetales);

// --- Pedidos carnes ---
document.getElementById('form-pedido-carnes').addEventListener('submit', handleEnviarPedidoCarnes);

// --- Levantamiento de Frescos ---
document.getElementById('form-agregar-fila-lev').addEventListener('submit', handleAgregarFilaLevantamiento);
document.getElementById('btn-guardar-levantamiento').addEventListener('click', handleGuardarLevantamiento);

// --- Auditoría ---
document.getElementById('auditoria-filtro').addEventListener('input', handleFiltroAuditoria);

// --- Suministros ---
document.getElementById('form-agregar-fila-sol').addEventListener('submit', handleAgregarFilaSolicitud);
document.getElementById('btn-enviar-solicitud').addEventListener('click', handleEnviarSolicitud);

// --- Centro de notificaciones ---
document.getElementById('btn-notif-centro').addEventListener('click', abrirCentroNotificaciones);
document.getElementById('btn-notif-marcar-leidas').addEventListener('click', handleMarcarTodasLeidas);

// --- Búsqueda global + atajo Ctrl+K ---
document.getElementById('btn-busqueda-global').addEventListener('click', abrirBuscadorGlobal);
document.getElementById('busqueda-input').addEventListener('input', handleBusquedaInput);
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!document.getElementById('dashboard-view').classList.contains('hidden')) {
            abrirBuscadorGlobal();
        }
    }
});

// --- Reportes: poblar tabla con botones de export ---
const REPORTES_DISPONIBLES = [
    { key: 'tareas',                  label: 'Tareas (todas)' },
    { key: 'mermas',                  label: 'Mermas y averías' },
    { key: 'pedidos',                 label: 'Pedidos vegetales/carnes' },
    { key: 'auditoria',               label: 'Auditoría de acciones' },
    { key: 'suministros_solicitudes', label: 'Solicitudes de suministros' },
    { key: 'suministros_inventario',  label: 'Inventario de materiales' },
    { key: 'consumos',                label: 'Consumos de materiales' },
    { key: 'evidencias',              label: 'Evidencias fotográficas (metadata)' }
];
document.getElementById('reportes-tabla').innerHTML = REPORTES_DISPONIBLES.map(r => `
    <tr>
        <td><strong>${r.label}</strong></td>
        <td>
            <button class="btn-secondary" data-rep="${r.key}" data-fmt="csv"  style="padding:0.3rem 0.7rem; margin:2px;"><i class="fa-solid fa-file-csv"></i> CSV</button>
            <button class="btn-secondary" data-rep="${r.key}" data-fmt="xlsx" style="padding:0.3rem 0.7rem; margin:2px;"><i class="fa-solid fa-file-excel"></i> XLSX</button>
        </td>
    </tr>
`).join('');
document.querySelectorAll('#reportes-tabla button[data-rep]').forEach(b =>
    b.addEventListener('click', () => exportarReporte(b.dataset.rep, b.dataset.fmt))
);

// --- Escáner ---
document.getElementById('btn-escaner-cerrar').addEventListener('click', cerrarEscaner);
document.getElementById('btn-escaner-manual').addEventListener('click', handleEscanerManual);

// --- Notificaciones de tareas para el usuario que acaba de loguear ---
function notificarTareasUsuario(userId) {
    const ahora = Date.now();
    const propias = tasks.filter(t => t.assignedTo === userId || t.assignedTo === 'TODOS');
    const pendientes = propias.filter(t => t.status === 'pending');
    const vencidas   = pendientes.filter(t => t.dueAt && ahora > t.dueAt);

    if (vencidas.length > 0) {
        showNotification(`⚠ Tienes ${vencidas.length} tarea(s) VENCIDA(S).`);
    } else if (pendientes.length > 0) {
        showNotification(`Tienes ${pendientes.length} tarea(s) pendiente(s).`);
    }
}

// --- Perfil de usuario ---
document.getElementById('perfil-foto-input').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('perfil-preview-img').src = e.target.result;
            document.getElementById('perfil-preview-img').classList.remove('hidden');
            document.getElementById('perfil-preview-icon').classList.add('hidden');
        };
        reader.readAsDataURL(this.files[0]);
    }
});
document.getElementById('form-editar-perfil').addEventListener('submit', handleGuardarPerfil);
