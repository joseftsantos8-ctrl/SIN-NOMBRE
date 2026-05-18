// Exportar datos como CSV (universal, abre en Excel) y XLSX (usando la lib XLSX ya cargada).

import { tasks } from '../tareas/data.js';
import { mermas } from '../mermas/data.js';
import { pedidos } from '../pedidos/data.js';
import { auditoria } from '../auditoria/auditoria.js';
import { solicitudesSuministros, materiales, consumos } from '../suministros/data.js';
import { evidencias } from '../evidencias/data.js';
import { showNotification } from '../shell/notificaciones.js';

function fechaIso(ms) {
    return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
}

function csvEscape(val) {
    if (val == null) return '';
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

function descargarBlob(blob, nombre) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
}

function descargarCSV(filas, nombre) {
    if (filas.length === 0) { alert('No hay datos para exportar.'); return; }
    const headers = Object.keys(filas[0]);
    const csv = [headers.join(','), ...filas.map(f => headers.map(h => csvEscape(f[h])).join(','))].join('\n');
    // BOM para que Excel detecte UTF-8
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    descargarBlob(blob, `${nombre}_${new Date().toISOString().slice(0,10)}.csv`);
}

function descargarXLSX(filas, nombre, sheetName = 'Datos') {
    if (filas.length === 0) { alert('No hay datos para exportar.'); return; }
    if (typeof XLSX === 'undefined') { alert('Librería XLSX no cargada.'); return; }
    const ws = XLSX.utils.json_to_sheet(filas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${nombre}_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// Preparadores específicos por tipo de reporte
const REPORTES = {
    tareas: () => tasks.map(t => ({
        ID: t.id, Tipo: t.type, Descripcion: t.desc, Estado: t.status,
        AsignadoA: t.assignedTo, AsignadoPor: t.assignedBy || '',
        Creada: fechaIso(t.createdAt),
        Vence: t.dueAt ? fechaIso(t.dueAt) : '',
        Completada: t.completedAt ? fechaIso(t.completedAt) : '',
        FueTarde: t.fueTarde ? 'sí' : 'no',
        Justificacion: t.justificacionRetraso || ''
    })),
    mermas: () => mermas.map(m => ({
        ID: m.id, Fecha: fechaIso(m.fecha), Producto: m.productoDesc, EAN: m.ean,
        Cantidad: m.cantidad, Valor: m.valor, Motivo: m.motivo, Origen: m.origen
    })),
    pedidos: () => pedidos.map(p => ({
        ID: p.id, Tipo: p.tipo, Fecha: fechaIso(p.fecha), SolicitadoPor: p.solicitadoPor,
        Estado: p.estado, Items: (p.items || []).map(i => `${i.producto}: ${i.cantidad} ${i.unidad}`).join(' | '),
        Notas: p.notas || ''
    })),
    auditoria: () => auditoria.map(a => ({
        Fecha: fechaIso(a.fecha), Usuario: a.usuario, Accion: a.accion, Detalle: a.detalle
    })),
    suministros_solicitudes: () => solicitudesSuministros.map(s => ({
        ID: s.id, Fecha: fechaIso(s.fecha), Area: s.area, SolicitadoPor: s.solicitadoPor,
        Estado: s.estado, AprobadoPor: s.aprobadoPor || '',
        EntregadoPor: s.entregadoPor || '',
        Items: (s.items || []).map(i => `${i.descripcion}: solicitado ${i.cantidadSolicitada}${i.cantidadEntregada != null ? '/entregado ' + i.cantidadEntregada : ''}`).join(' | '),
        Justificacion: s.justificacionParcial || ''
    })),
    suministros_inventario: () => materiales.map(m => ({
        ID: m.id, EAN: m.ean, Descripcion: m.descripcion, Categoria: m.categoria,
        Stock: m.stock, Minimo: m.minimo, BajoMinimo: m.stock <= m.minimo ? 'sí' : 'no',
        Ubicacion: m.ubicacion, Proveedor: m.proveedor
    })),
    consumos: () => consumos.map(c => ({
        Fecha: fechaIso(c.fecha), Material: c.descripcion, Cantidad: c.cantidad,
        Area: c.area, Responsable: c.responsable
    })),
    evidencias: () => evidencias.map(e => ({
        ID: e.id, Fecha: fechaIso(e.fecha), TaskID: e.taskId, Usuario: e.usuario,
        Area: e.area, TamanoKB: Math.round(e.imagenBase64.length / 1024)
    }))
};

export function abrirModalReportes() {
    document.getElementById('modal-reportes').classList.remove('hidden');
}

export function exportarReporte(tipo, formato) {
    const generador = REPORTES[tipo];
    if (!generador) { alert('Tipo de reporte desconocido.'); return; }
    const filas = generador();
    if (filas.length === 0) { alert('No hay datos para exportar en ' + tipo); return; }
    if (formato === 'csv')  descargarCSV(filas, tipo);
    if (formato === 'xlsx') descargarXLSX(filas, tipo, tipo);
    showNotification(`Reporte ${tipo} exportado (${filas.length} filas, ${formato.toUpperCase()})`);
}
