import { tasks } from './data.js';
import { currentUser } from '../autenticacion/auth.js';
import { addNavLink } from '../shell/navegacion.js';

export function setupColaborador() {
    document.getElementById('colaborador-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Mis Tareas Operativas';
    addNavLink('Tareas Asignadas', 'fa-list-check');
    renderColaboradorTasks();
}

export function renderColaboradorTasks() {
    const list    = document.getElementById('colaborador-task-list');
    list.innerHTML = '';
    const myTasks = tasks.filter(t => t.assignedTo === currentUser.id || t.assignedTo === 'TODOS');

    if (myTasks.length === 0) { list.innerHTML = '<p>No tienes tareas asignadas.</p>'; return; }

    myTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item glass-panel ${task.status === 'completed' ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="task-info">
                <h4>${task.type}</h4>
                <p>${task.desc}</p>
            </div>
            <div class="task-actions">
                ${task.status === 'pending'
                    ? `<button onclick="abrirModalEjecutar(${task.id})"><i class="fa-solid fa-pen-to-square"></i> Ejecutar</button>`
                    : `<span>Listo</span>`}
            </div>`;
        list.appendChild(item);
    });
}
