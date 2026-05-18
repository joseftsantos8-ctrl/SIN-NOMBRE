import { tasks } from './data.js';
import { currentUser } from '../autenticacion/auth.js';
import { showNotification } from '../shell/notificaciones.js';
import { renderColaboradorTasks } from './colaborador.js';
import { derivarMermasDeInventario } from '../mermas/calculo.js';
import { registrarAccion } from '../auditoria/auditoria.js';
import { guardarTodo } from '../storage/persistencia.js';

let currentTaskExecuting = null;

window.abrirModalEjecutar = function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    currentTaskExecuting = task;
    document.getElementById('ejecutar-titulo').textContent = task.type;
    document.getElementById('ejecutar-desc').textContent   = task.desc;

    const container   = document.getElementById('ejecutar-dinamico-container');
    container.innerHTML = '';

    // Aviso visual si la tarea ya está vencida
    if (task.dueAt && Date.now() > task.dueAt) {
        container.innerHTML = `
            <div style="background:rgba(239,68,68,0.15); border-left:4px solid #ef4444; padding:0.8rem 1rem; border-radius:8px; margin-bottom:1rem;">
                <strong style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Tarea vencida</strong>
                <p style="margin:0.3rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
                    Al completar se te pedirá una justificación obligatoria del retraso.
                </p>
            </div>
        `;
    }

    if (task.data) {
        const esInventario = task.type === 'Inventario Cíclico' || task.type === 'Verificación Negativos';
        let html = '<p>Ingresa el conteo físico:</p>';
        task.data.forEach((prod, i) => {
            html += `<div style="margin-bottom:10px;"><strong>${prod.desc}</strong><br>
                     <span style="font-size:0.8rem; color:var(--text-secondary);">EAN: ${prod.ean}</span><br>
                     <input type="number" name="conteo_${i}" placeholder="Cantidad" required></div>`;
        });
        if (esInventario) {
            html += `<button type="button" class="btn-secondary" style="margin-top:0.5rem; width:100%;" onclick="reportarNegativoDesdeColaborador()">
                        <i class="fa-solid fa-circle-plus"></i> Reportar Negativo Encontrado
                    </button>`;
        }
        container.innerHTML = html;
    } else {
        container.innerHTML = '<textarea id="ejecutar-obs" rows="4" style="width:100%" placeholder="Observaciones..."></textarea>';
    }
    document.getElementById('modal-ejecutar-tarea').classList.remove('hidden');
};

export function handleEjecutarTarea(e) {
    e.preventDefault();
    const task = currentTaskExecuting;
    const ahora = Date.now();

    // Si la tarea está fuera de plazo, pedir justificación antes de cerrar.
    if (task.dueAt && ahora > task.dueAt) {
        const transcurridoMs = ahora - task.dueAt;
        const horasTarde = Math.floor(transcurridoMs / (3600 * 1000));
        const minTarde   = Math.floor((transcurridoMs % (3600 * 1000)) / (60 * 1000));
        const detalle    = horasTarde > 0 ? `${horasTarde}h ${minTarde}m` : `${minTarde}m`;
        const justificacion = prompt(
            `⚠ Esta tarea está vencida (${detalle} tarde).\n\nIngresa la justificación obligatoria del retraso:`
        );
        if (justificacion === null || justificacion.trim() === '') {
            alert('No puedes completar una tarea vencida sin justificación.');
            return;
        }
        task.justificacionRetraso = justificacion.trim();
        task.fueTarde = true;
    } else {
        task.fueTarde = false;
    }

    if (task.data) {
        task.results = { type: 'inventario', items: [] };
        task.data.forEach((prod, i) => {
            const conteo = parseInt(document.querySelector(`input[name="conteo_${i}"]`).value) || 0;
            task.results.items.push({ ean: prod.ean, desc: prod.desc, stockTeorico: prod.stock, conteo, dif: conteo - prod.stock });
        });
    } else {
        task.results = {
            type: 'general',
            obs:  document.getElementById('ejecutar-obs').value || 'Completado sin observaciones.'
        };
    }

    task.status = 'completed';
    task.completedAt = ahora;
    if (task.assignedTo === 'TODOS') task.assignedTo = currentUser.id;

    // Si fue inventario, derivar mermas por cada dif negativo
    const mermasCreadas = derivarMermasDeInventario(task);

    guardarTodo();
    document.getElementById('modal-ejecutar-tarea').classList.add('hidden');
    renderColaboradorTasks();
    const sufijoMerma  = mermasCreadas > 0 ? ` (${mermasCreadas} merma${mermasCreadas>1?'s':''} registrada${mermasCreadas>1?'s':''})` : '';
    const sufijoTarde  = task.fueTarde ? ' — completada con retraso justificado' : '';
    registrarAccion(currentUser.id, 'Completar tarea', `"${task.type}"${task.fueTarde ? ' (TARDE: ' + task.justificacionRetraso + ')' : ''}`);
    showNotification(`Tarea completada${sufijoMerma}${sufijoTarde}.`);
}

window.abrirModalResultados = function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    let extraInfo = '';
    if (task.fueTarde && task.justificacionRetraso) {
        extraInfo = `<br><strong style="color:#ef4444;">⚠ Completada con retraso.</strong> Justificación: <em>"${task.justificacionRetraso}"</em>`;
    }
    document.getElementById('res-desc').innerHTML =
        `<strong>Tarea:</strong> ${task.type}<br><strong>Por:</strong> ${task.assignedTo}${extraInfo}`;

    const tbody    = document.getElementById('res-tbody');
    tbody.innerHTML = '';

    if (task.results.type === 'inventario') {
        document.getElementById('res-thead').innerHTML =
            `<tr><th>Producto</th><th>Teórico</th><th>Físico</th><th>Dif</th></tr>`;
        task.results.items.forEach(it => {
            tbody.innerHTML +=
                `<tr><td>${it.desc}</td><td>${it.stockTeorico}</td><td>${it.conteo}</td>
                 <td style="font-weight:bold">${it.dif}</td></tr>`;
        });
    } else {
        document.getElementById('res-thead').innerHTML = `<tr><th>Observaciones</th></tr>`;
        tbody.innerHTML = `<tr><td>${task.results.obs}</td></tr>`;
    }
    document.getElementById('modal-ver-resultados').classList.remove('hidden');
};
