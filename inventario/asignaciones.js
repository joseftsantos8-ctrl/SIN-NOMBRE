// Configuración de categorías por colaborador. La define A.FISH en su panel.
// Estado mutable compartido entre el panel de inventario y el de negativos.
import { registrarColeccion, reemplazarObjeto, guardarTodo } from '../storage/persistencia.js';

export let asignaciones = {
    'J.AVILA':    [],
    'E.CEDANO':   [],
    'A.CASTILLO': []
};

export function setAsignacion(colabId, categorias) {
    asignaciones[colabId] = categorias;
    guardarTodo();
}

registrarColeccion('asignaciones', () => asignaciones, v => reemplazarObjeto(asignaciones, v));
