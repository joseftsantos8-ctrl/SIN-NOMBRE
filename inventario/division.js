// Lógica pura de división de productos entre colaboradores.
// Recibe: array de productos, mapa de asignaciones (colab -> [categorías]), array de IDs de colaboradores.
// Devuelve: { colabId: [productos...] } con cada producto en exactamente un colaborador.
// Reglas:
//   1) Si la cat de un producto está asignada a un colaborador, va para él.
//   2) Si no hay dueño para esa cat, el producto cae a un "pool" repartido equitativamente
//      entre todos los colaboradores (round-robin: 50/3 -> 17/17/16).
export function dividirProductos(productos, asignaciones, colaboradores) {
    const resultado = {};
    colaboradores.forEach(id => { resultado[id] = []; });

    const sinDueno = [];

    productos.forEach(prod => {
        const dueno = colaboradores.find(id =>
            Array.isArray(asignaciones[id]) && asignaciones[id].includes(prod.cat)
        );
        if (dueno) {
            resultado[dueno].push(prod);
        } else {
            sinDueno.push(prod);
        }
    });

    // Round-robin sobre los productos sin dueño
    if (colaboradores.length > 0) {
        sinDueno.forEach((prod, i) => {
            const colab = colaboradores[i % colaboradores.length];
            resultado[colab].push(prod);
        });
    }

    return resultado;
}
