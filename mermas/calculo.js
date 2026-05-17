import { registrarMerma } from './data.js';

// TODO: cuando los productos tengan campo `precio` real, derivar de ahí.
export const PRECIO_PROMEDIO = 50;

// Escanea una tarea de inventario completada y registra mermas automáticas
// para cada item con diferencia negativa (stock físico < teórico).
export function derivarMermasDeInventario(task) {
    if (!task || !task.results || task.results.type !== 'inventario') return 0;
    let registradas = 0;
    task.results.items.forEach(item => {
        if (item.dif < 0) {
            const cantidad = Math.abs(item.dif);
            registrarMerma({
                productoDesc: item.desc,
                ean: item.ean || '—',
                cantidad,
                valor: cantidad * PRECIO_PROMEDIO,
                motivo: 'Diferencia Inventario',
                origen: 'automático'
            });
            registradas++;
        }
    });
    return registradas;
}
