// Pedidos de vegetales y carnes. Estado mutable compartido.
// Catálogos predeterminados para los formularios.

import { registrarColeccion, reemplazarArray, guardarTodo } from '../storage/persistencia.js';

export const VEGETALES = [
    'Papa', 'Zanahoria', 'Tomate', 'Cebolla', 'Lechuga',
    'Ají morrón', 'Ajo', 'Limón', 'Plátano verde', 'Yuca',
    'Auyama', 'Chayote', 'Berenjena', 'Pepino', 'Brócoli',
    'Coliflor', 'Espinaca', 'Apio'
];

export const CARNES = [
    'Pollo entero',     'Pechuga de pollo', 'Muslo de pollo',
    'Carne de res molida', 'Bistec de res', 'Costilla de res',
    'Chuleta ahumada', 'Chuleta de cerdo', 'Lomo de cerdo',
    'Pavo entero',     'Pescado tilapia', 'Camarón',
    'Salchichón',      'Jamón',            'Tocineta'
];

// Cada pedido: { id, tipo, fecha, items: [{ producto, cantidad, unidad }], solicitadoPor, estado, notas }
// tipo:   'vegetales' | 'carnes'
// unidad: 'canastos' (vegetales) | 'libras' (carnes)
// estado: 'pendiente' | 'recibido' | 'cancelado'
export let pedidos = [];

export function registrarPedido(pedido) {
    pedidos.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        estado: 'pendiente',
        ...pedido
    });
    guardarTodo();
}

registrarColeccion('pedidos', () => pedidos, v => reemplazarArray(pedidos, v));
