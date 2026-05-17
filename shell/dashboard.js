import { currentUser } from '../autenticacion/auth.js';
import { setupAdmin } from '../usuarios/admin.js';
import { setupGerencia } from '../gerencia/gerencia.js';
import { setupLider } from '../tareas/lider.js';
import { setupColaborador } from '../tareas/colaborador.js';
import { setupInventario } from '../inventario/inventario.js';
import { inyectarHerramientas } from './herramientas.js';

const loginView    = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');

export function showDashboard() {
    loginView.classList.remove('active-view');
    setTimeout(() => {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        void dashboardView.offsetWidth; // Reflow para activar transición CSS
        dashboardView.classList.add('active-view');
    }, 300);

    document.getElementById('current-user-name').textContent = currentUser.name;
    document.getElementById('current-user-role').textContent = currentUser.role;

    const sidebarAvatar = document.getElementById('sidebar-avatar');
    sidebarAvatar.innerHTML = currentUser.profilePic
        ? `<img src="${currentUser.profilePic}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`
        : `<i class="fa-solid fa-user-circle"></i>`;

    document.querySelectorAll('.role-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('nav-links').innerHTML = '';

    inyectarHerramientas(currentUser.role);

    if      (currentUser.role === 'Admin')                                                    setupAdmin();
    else if (currentUser.role === 'Gerente' || currentUser.role === 'Sugerente')              setupGerencia();
    else if (currentUser.role.includes('Líder') && currentUser.role !== 'Líder de Inventario') setupLider();
    else if (currentUser.role === 'Colaborador' || currentUser.role === 'POP')                setupColaborador();
    else if (currentUser.role === 'Líder de Inventario')                                      setupInventario();
}

export function hideDashboard() {
    dashboardView.classList.remove('active-view');
    setTimeout(() => {
        dashboardView.classList.add('hidden');
        loginView.classList.remove('hidden');
        loginView.classList.add('active-view');
    }, 300);
}
