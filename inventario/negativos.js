import { users } from '../usuarios/data.js';
import { tasks } from '../tareas/data.js';
import { asignaciones } from './asignaciones.js';
import { dividirProductos } from './division.js';
import { showNotification } from '../shell/notificaciones.js';
import { registrarColeccion, reemplazarArray, guardarTodo } from '../storage/persistencia.js';

// Lista global de negativos pendientes (productos físicos no listados)
export let negativos = [];

registrarColeccion('negativos', () => negativos, v => reemplazarArray(negativos, v));

function getColaboradores() {
    return Object.entries(users)
        .filter(([, u]) => u.role === 'Colaborador')
        .map(([id]) => id);
}

function renderListaNegativos() {
    const lista = document.getElementById('negativos-lista');
    if (negativos.length === 0) {
        lista.innerHTML = '<p style="color:var(--text-secondary); text-align:center; padding:1rem;">No hay negativos pendientes.</p>';
        return;
    }
    lista.innerHTML = negativos.map((n, i) => `
        <div class="negativo-item" style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:0.4rem;">
            <div>
                <strong>${n.desc}</strong>
                <div style="font-size:0.85rem; color:var(--text-secondary);">EAN: ${n.ean} | Origen: ${n.origen || 'manual'}${n.cat ? ' | Cat: ' + n.cat : ''}</div>
            </div>
            <button type="button" class="btn-secondary" data-idx="${i}" style="padding:0.3rem 0.6rem;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
    lista.querySelectorAll('button[data-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
            negativos.splice(parseInt(btn.dataset.idx), 1);
            renderListaNegativos();
        });
    });
}

export function abrirModalNegativos() {
    document.getElementById('modal-negativos').classList.remove('hidden');
    document.getElementById('neg-ean').value = '';
    document.getElementById('neg-desc').value = '';
    document.getElementById('neg-cat').value = '';
    renderListaNegativos();
}

export function handleAgregarNegativo(e) {
    e.preventDefault();
    const ean  = document.getElementById('neg-ean').value.trim();
    const desc = document.getElementById('neg-desc').value.trim();
    const cat  = document.getElementById('neg-cat').value.trim() || 'General';
    if (!ean || !desc) return;
    negativos.push({ ean, desc, cat, stock: 0, origen: 'A.FISH' });
    guardarTodo();
    document.getElementById('neg-ean').value = '';
    document.getElementById('neg-desc').value = '';
    document.getElementById('neg-cat').value = '';
    renderListaNegativos();
}

export function repartirNegativos() {
    if (negativos.length === 0) return alert('No hay negativos para repartir.');
    const colabs = getColaboradores();
    if (colabs.length === 0) return alert('No hay colaboradores disponibles.');

    const reparto = dividirProductos(negativos, asignaciones, colabs);
    let creadas = 0;
    const ahora = Date.now();

    Object.entries(reparto).forEach(([colabId, prods]) => {
        if (prods.length === 0) return;
        tasks.push({
            id:          ahora + Math.random(),
            type:        'Verificación Negativos',
            desc:        `Verificar ${prods.length} producto(s) negativo(s).`,
            status:      'pending',
            assignedTo:  colabId,
            assignedBy:  'A.FISH',
            createdAt:   ahora,
            dueAt:       ahora + 24 * 3600 * 1000,
            completedAt: null,
            data:        prods.map(p => ({ ean: p.ean, desc: p.desc, stock: p.stock || 0 }))
        });
        creadas++;
    });

    negativos.length = 0;
    guardarTodo();
    renderListaNegativos();
    showNotification(`${creadas} tarea(s) de negativos creadas.`);
    document.getElementById('modal-negativos').classList.add('hidden');
}

// Expone función para que un colaborador reporte un negativo durante la ejecución
window.reportarNegativoDesdeColaborador = function() {
    const ean  = prompt('EAN del producto encontrado físicamente:');
    if (!ean) return;
    const desc = prompt('Descripción breve del producto:');
    if (!desc) return;
    const cat  = prompt('Categoría (opcional, ej: Lácteos):') || 'General';
    negativos.push({ ean: ean.trim(), desc: desc.trim(), cat: cat.trim(), stock: 0, origen: 'colaborador' });
    guardarTodo();
    showNotification('Negativo reportado. A.FISH lo verá al gestionarlos.');
};
