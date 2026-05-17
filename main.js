import { authenticate, logout } from './autenticacion/auth.js';
import { showDashboard, hideDashboard } from './shell/dashboard.js';
import { handleCrearUsuario } from './usuarios/admin.js';
import { abrirModalPerfil, handleGuardarPerfil } from './usuarios/perfil.js';
import { handleNuevaTarea, abrirModalLider } from './tareas/lider.js';
import { handleEjecutarTarea } from './tareas/ejecutar.js';
import { enviarInventarioManual, setupInventario } from './inventario/inventario.js';
import { handleReporteNovedades } from './novedades/novedades.js';
import { showNotification } from './shell/notificaciones.js';
import { products } from './inventario/productos.js';
import { abrirModalNegativos, handleAgregarNegativo, repartirNegativos } from './inventario/negativos.js';
import { handleRegistrarMerma } from './mermas/registro.js';

// Exponer para handlers inline en HTML dinámico
window.abrirModalPerfil = abrirModalPerfil;
window.abrirModalNegativos = abrirModalNegativos;

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
        showDashboard();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
        const form = document.getElementById('login-form');
        form.classList.add('error');
        setTimeout(() => form.classList.remove('error'), 500);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
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

// --- Inventario ---
document.getElementById('btn-enviar-inv-manual').addEventListener('click', enviarInventarioManual);

// --- Negativos ---
document.getElementById('form-agregar-negativo').addEventListener('submit', handleAgregarNegativo);
document.getElementById('btn-repartir-negativos').addEventListener('click', repartirNegativos);

// --- Mermas ---
document.getElementById('form-registrar-merma').addEventListener('submit', handleRegistrarMerma);

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
