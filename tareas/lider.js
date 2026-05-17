import { tasks } from './data.js';
import { users } from '../usuarios/data.js';
import { currentUser } from '../autenticacion/auth.js';
import { addNavLink } from '../shell/navegacion.js';
import { showNotification } from '../shell/notificaciones.js';

export function setupLider() {
    document.getElementById('lider-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Gestión de Tareas de Equipo';

    addNavLink('Asignar', 'fa-users-viewfinder', true, () => {
        document.getElementById('lider-asignar-view').classList.remove('hidden');
        document.getElementById('lider-reportes-view').classList.add('hidden');
        renderLiderTasks();
    });
    addNavLink('Reportes', 'fa-chart-pie', false, () => {
        document.getElementById('lider-asignar-view').classList.add('hidden');
        document.getElementById('lider-reportes-view').classList.remove('hidden');
        renderLiderReportes();
    });

    renderLiderTasks();
}

export function renderLiderTasks() {
    const list        = document.getElementById('lider-task-list');
    list.innerHTML    = '';
    const activeTasks = tasks.filter(t => t.status === 'pending');
    if (activeTasks.length === 0) { list.innerHTML = '<p>No hay tareas activas.</p>'; return; }

    activeTasks.forEach(t => {
        list.innerHTML += `
            <div class="task-item glass-panel">
                <div class="task-info">
                    <h4>${t.type}</h4>
                    <p>${t.desc} - Asignado a: <strong>${t.assignedTo}</strong></p>
                </div>
            </div>`;
    });
}

export function renderLiderReportes() {
    const list      = document.getElementById('lider-reportes-list');
    list.innerHTML  = '';
    const doneTasks = tasks.filter(t => t.status === 'completed');
    if (doneTasks.length === 0) { list.innerHTML = '<p>No hay tareas completadas.</p>'; return; }

    doneTasks.forEach(t => {
        list.innerHTML += `
            <div class="task-item glass-panel completed">
                <div class="task-info"><h4>${t.type}</h4><p>${t.desc}</p></div>
                <div class="task-actions">
                    ${t.results ? `<button class="btn-primary" onclick="abrirModalResultados(${t.id})">Resultados</button>` : ''}
                </div>
            </div>`;
    });
}

export function abrirModalLider() {
    const select   = document.getElementById('tarea-colaborador');
    select.innerHTML = '<option value="" disabled selected>Selecciona al Personal</option>';
    Object.entries(users).forEach(([id, u]) => {
        if (u.role === 'POP' && currentUser.id !== 'F.CEBALLOS') return;
        select.innerHTML += `<option value="${id}">${u.name} - ${u.role}</option>`;
    });
    document.getElementById('modal-nueva-tarea').classList.remove('hidden');
}

export function handleNuevaTarea(e) {
    e.preventDefault();
    const ahora = Date.now();
    const deadlineInput = document.getElementById('tarea-deadline').value;
    const dueAt = deadlineInput ? new Date(deadlineInput).getTime() : ahora + 24 * 3600 * 1000;

    tasks.push({
        id:          ahora,
        type:        document.getElementById('tarea-tipo').value,
        desc:        document.getElementById('tarea-desc').value,
        status:      'pending',
        assignedTo:  document.getElementById('tarea-colaborador').value,
        assignedBy:  currentUser.id,
        createdAt:   ahora,
        dueAt,
        completedAt: null
    });
    document.getElementById('modal-nueva-tarea').classList.add('hidden');
    e.target.reset();
    renderLiderTasks();
    showNotification('Tarea Asignada');
}
