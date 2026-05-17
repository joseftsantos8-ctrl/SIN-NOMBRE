// Funciones puras de cálculo de KPIs. Sin DOM, sin estado global.
// Todas devuelven número 0-100 o null si no hay datos suficientes.

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Productividad de un líder = % de tareas que asignó que ya están completadas.
export function calcularProductividad(tasks, liderId) {
    const propias = tasks.filter(t => t.assignedBy === liderId);
    if (propias.length === 0) return null;
    const done = propias.filter(t => t.status === 'completed').length;
    return Math.round((done / propias.length) * 100);
}

// Velocidad = % de tareas completadas dentro de su deadline (dueAt).
// Filtra por liderId si se provee; si no, mide global.
export function calcularVelocidad(tasks, liderId = null) {
    const completadas = tasks.filter(t =>
        t.status === 'completed' &&
        t.completedAt &&
        t.dueAt &&
        (liderId == null || t.assignedBy === liderId)
    );
    if (completadas.length === 0) return null;
    const aTiempo = completadas.filter(t => t.completedAt <= t.dueAt).length;
    return Math.round((aTiempo / completadas.length) * 100);
}

// Confiabilidad de inventario = qué tan cerca está el conteo físico del teórico.
// 100 = perfecto. Si no hay inventarios completados, devuelve null.
export function calcularConfiabilidad(tasks) {
    const invs = tasks.filter(t =>
        t.status === 'completed' &&
        t.results &&
        t.results.type === 'inventario'
    );
    if (invs.length === 0) return null;

    let sumaDif = 0, sumaTeorico = 0;
    invs.forEach(t => {
        t.results.items.forEach(item => {
            sumaDif     += Math.abs(item.dif || 0);
            sumaTeorico += Math.abs(item.stockTeorico || 0);
        });
    });
    if (sumaTeorico === 0) return null;
    const errorPct = (sumaDif / sumaTeorico) * 100;
    return Math.round(clamp(100 - errorPct, 0, 100));
}

// Cumplimiento operativo = promedio de las métricas disponibles.
export function calcularCumplimiento(productividad, velocidad, confiabilidad) {
    const valores = [productividad, velocidad, confiabilidad].filter(v => v != null);
    if (valores.length === 0) return null;
    const prom = valores.reduce((a, b) => a + b, 0) / valores.length;
    return Math.round(prom);
}

// Stats por líder para la tabla de progreso.
export function statsPorLider(tasks, liderId) {
    const propias = tasks.filter(t => t.assignedBy === liderId);
    const asignadas  = propias.length;
    const completadas = propias.filter(t => t.status === 'completed').length;
    const pendientes  = asignadas - completadas;
    const rendimiento = asignadas === 0 ? null : Math.round((completadas / asignadas) * 100);
    return { asignadas, completadas, pendientes, rendimiento };
}
