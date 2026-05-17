// Configuración de categorías por colaborador. La define A.FISH en su panel.
// Estado mutable compartido entre el panel de inventario y el de negativos.
export let asignaciones = {
    'J.AVILA':    [],
    'E.CEDANO':   [],
    'A.CASTILLO': []
};

export function setAsignacion(colabId, categorias) {
    asignaciones[colabId] = categorias;
}
