import { users } from '../usuarios/data.js';
import { currentUser } from '../autenticacion/auth.js';
import { addNavLink } from '../shell/navegacion.js';
import { renderLiderTasks, renderLiderReportes } from '../tareas/lider.js';
import { renderDashboardEjecutivo } from './dashboard-ejecutivo.js';

export function setupGerencia() {
    document.getElementById('gerencia-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Panel de Control Gerencial';

    const mostrarAgrupacion = () => {
        document.getElementById('gerencia-panel').classList.remove('hidden');
        document.getElementById('lider-panel').classList.add('hidden');
        document.getElementById('agrupacion-roles-view').classList.remove('hidden');
        document.getElementById('dashboard-ejecutivo-view').classList.add('hidden');
    };
    const mostrarDashboardEjecutivo = () => {
        document.getElementById('gerencia-panel').classList.remove('hidden');
        document.getElementById('lider-panel').classList.add('hidden');
        document.getElementById('agrupacion-roles-view').classList.add('hidden');
        document.getElementById('dashboard-ejecutivo-view').classList.remove('hidden');
        renderDashboardEjecutivo();
    };

    addNavLink('Agrupación Roles', 'fa-sitemap', true, mostrarAgrupacion);

    if (currentUser.id === 'F.CEBALLOS') {
        addNavLink('Dashboard Ejecutivo', 'fa-gauge-high', false, mostrarDashboardEjecutivo);
        addNavLink('Asignar Tareas', 'fa-users-viewfinder', false, () => {
            document.getElementById('gerencia-panel').classList.add('hidden');
            document.getElementById('lider-panel').classList.remove('hidden');
            document.getElementById('lider-asignar-view').classList.remove('hidden');
            document.getElementById('lider-reportes-view').classList.add('hidden');
            renderLiderTasks();
        });
        addNavLink('Reportes Tareas', 'fa-chart-pie', false, () => {
            document.getElementById('gerencia-panel').classList.add('hidden');
            document.getElementById('lider-panel').classList.remove('hidden');
            document.getElementById('lider-asignar-view').classList.add('hidden');
            document.getElementById('lider-reportes-view').classList.remove('hidden');
            renderLiderReportes();
        });
    }

    const container   = document.getElementById('roles-container');
    container.innerHTML = '';
    const grupos = {};
    for (const [id, user] of Object.entries(users)) {
        if (!grupos[user.role]) grupos[user.role] = [];
        grupos[user.role].push(`${user.name} (${id})`);
    }

    for (const [rolName, list] of Object.entries(grupos)) {
        const card = document.createElement('div');
        card.className = 'role-group-card glass-panel';
        const lis = list.map(item => `<li><span><i class="fa-solid fa-user-check"></i> ${item}</span></li>`).join('');
        card.innerHTML = `<h4>${rolName} (${list.length})</h4><ul class="role-group-list">${lis}</ul>`;
        container.appendChild(card);
    }
}
