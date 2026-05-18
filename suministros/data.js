// Sistema completo de suministros (sec. 13-15 del doc original + mandato #6).
// Catálogo placeholder de materiales hasta que J.ARECHE entregue el listado oficial.

import { registrarColeccion, reemplazarArray, guardarTodo } from '../storage/persistencia.js';

export const AREAS_SUMINISTROS = [
    'Deli', 'Lácteos', 'Carnicería', 'Vegetales',
    'Panadería y Repostería', 'Cocina', 'Servicio al Cliente', 'Caja/Cuadre'
];

// Catálogo de materiales con stock + mínimo (para alertas)
// Cada material: { id, ean, descripcion, categoria, stock, minimo, ubicacion, proveedor }
export let materiales = [
    { id: 'M001', ean: '7460010000001', descripcion: 'Guantes desechables (caja)',  categoria: 'Limpieza',    stock: 12, minimo: 5,  ubicacion: 'Almacén A1',  proveedor: 'Distribuidora XYZ' },
    { id: 'M002', ean: '7460010000002', descripcion: 'Bolsa kraft 1lb (paquete)',   categoria: 'Empaque',     stock:  3, minimo: 10, ubicacion: 'Almacén A2',  proveedor: 'Empaques RD' },
    { id: 'M003', ean: '7460010000003', descripcion: 'Bolsa plástica 5lb (paquete)',categoria: 'Empaque',     stock: 25, minimo: 8,  ubicacion: 'Almacén A2',  proveedor: 'Empaques RD' },
    { id: 'M004', ean: '7460010000004', descripcion: 'Detergente líquido 1gal',     categoria: 'Limpieza',    stock:  6, minimo: 3,  ubicacion: 'Almacén B1',  proveedor: 'Distribuidora XYZ' },
    { id: 'M005', ean: '7460010000005', descripcion: 'Cloro concentrado 1gal',      categoria: 'Limpieza',    stock:  2, minimo: 4,  ubicacion: 'Almacén B1',  proveedor: 'Distribuidora XYZ' },
    { id: 'M006', ean: '7460010000006', descripcion: 'Papel envoltura deli (rollo)',categoria: 'Empaque',     stock:  4, minimo: 2,  ubicacion: 'Almacén A3',  proveedor: 'Empaques RD' },
    { id: 'M007', ean: '7460010000007', descripcion: 'Etiquetas precio (rollo)',    categoria: 'Señalización',stock: 15, minimo: 5,  ubicacion: 'Oficina',     proveedor: 'PrintShop' },
    { id: 'M008', ean: '7460010000008', descripcion: 'Cinta adhesiva ancha (rollo)',categoria: 'Empaque',     stock:  8, minimo: 4,  ubicacion: 'Almacén A2',  proveedor: 'Empaques RD' },
    { id: 'M009', ean: '7460010000009', descripcion: 'Tinta impresora térmica',     categoria: 'Cajas',       stock:  5, minimo: 2,  ubicacion: 'Oficina',     proveedor: 'PrintShop' },
    { id: 'M010', ean: '7460010000010', descripcion: 'Servilletas (paquete x100)',  categoria: 'Cocina',      stock: 20, minimo: 8,  ubicacion: 'Almacén C1',  proveedor: 'Distribuidora XYZ' },
    { id: 'M011', ean: '7460010000011', descripcion: 'Vasos desechables 8oz (paq)', categoria: 'Cocina',      stock:  3, minimo: 6,  ubicacion: 'Almacén C1',  proveedor: 'Distribuidora XYZ' },
    { id: 'M012', ean: '7460010000012', descripcion: 'Mascarillas (caja x50)',      categoria: 'Limpieza',    stock:  9, minimo: 4,  ubicacion: 'Almacén B2',  proveedor: 'Distribuidora XYZ' }
];

// Solicitudes: { id, fecha, area, solicitadoPor, items: [{materialId, descripcion, cantidadSolicitada, cantidadEntregada}], estado, aprobadoPor, fechaEntrega, justificacionParcial }
// estado: 'pendiente' | 'aprobada' | 'rechazada' | 'entregada' | 'parcial'
export let solicitudesSuministros = [];

// Consumos: { id, fecha, area, materialId, descripcion, cantidad, responsable }
export let consumos = [];

export function registrarSolicitud(solicitud) {
    solicitudesSuministros.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        estado: 'pendiente',
        ...solicitud
    });
    guardarTodo();
}

export function actualizarSolicitud(id, cambios) {
    const idx = solicitudesSuministros.findIndex(s => s.id === id);
    if (idx === -1) return;
    Object.assign(solicitudesSuministros[idx], cambios);
    guardarTodo();
}

export function registrarConsumo(consumo) {
    consumos.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        ...consumo
    });
    // Descontar del stock del material
    const mat = materiales.find(m => m.id === consumo.materialId);
    if (mat) {
        mat.stock = Math.max(0, mat.stock - consumo.cantidad);
    }
    guardarTodo();
}

// Materiales con bajo inventario (stock <= minimo)
export function materialesBajos() {
    return materiales.filter(m => m.stock <= m.minimo);
}

registrarColeccion('materiales',             () => materiales,             v => reemplazarArray(materiales, v));
registrarColeccion('solicitudesSuministros', () => solicitudesSuministros, v => reemplazarArray(solicitudesSuministros, v));
registrarColeccion('consumos',               () => consumos,               v => reemplazarArray(consumos, v));
