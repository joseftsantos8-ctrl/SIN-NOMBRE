import { users } from './data.js';
import { addNavLink } from '../shell/navegacion.js';
import { showNotification } from '../shell/notificaciones.js';
import { currentUser } from '../autenticacion/auth.js';
import { registrarAccion } from '../auditoria/auditoria.js';
import { guardarTodo } from '../storage/persistencia.js';

export function setupAdmin() {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Administración';
    addNavLink('Gestión Usuarios', 'fa-user-shield');
}

export function handleCrearUsuario(e) {
    e.preventDefault();
    const id   = document.getElementById('new-user-id').value.trim().toUpperCase();
    const name = document.getElementById('new-user-name').value;
    const role = document.getElementById('new-user-role').value;
    const pass = document.getElementById('new-user-pass').value;

    if (users[id]) { alert('Este ID ya existe.'); return; }
    users[id] = { name, role, cargo: role, area: '', password: pass };
    guardarTodo();
    registrarAccion(currentUser?.id || 'ADMIN', 'Crear usuario', `${id} (${name}) — ${role}`);
    showNotification(`Usuario ${name} creado.`);
    e.target.reset();
}
