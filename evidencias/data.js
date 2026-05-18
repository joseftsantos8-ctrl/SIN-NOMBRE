// Evidencias fotográficas asociadas a tareas.
// Cada evidencia: { id, fecha, taskId, usuario, area, imagenBase64 }
// La imagen es JPEG comprimida (~70% calidad) escalada a max 800px de ancho.

import { registrarColeccion, reemplazarArray, guardarTodo } from '../storage/persistencia.js';

export let evidencias = [];

export function registrarEvidencia({ taskId, usuario, area, imagenBase64 }) {
    evidencias.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        taskId,
        usuario,
        area: area || '',
        imagenBase64
    });
    guardarTodo();
}

export function evidenciasDeTarea(taskId) {
    return evidencias.filter(e => e.taskId === taskId);
}

registrarColeccion('evidencias', () => evidencias, v => reemplazarArray(evidencias, v));
