// Colección de mermas y averías. Estado mutable compartido.
// Cada entrada: { id, fecha (ms), productoDesc, ean, cantidad, valor, motivo, origen }
// motivo: 'Avería' | 'Vencimiento' | 'Robo' | 'Diferencia Inventario' | 'Otro'
// origen: 'automático' | 'manual'

const HOY = Date.now();
const HORA = 3600 * 1000;
const DIA  = 24 * HORA;

export let mermas = [
    { id: 1, fecha: HOY - 2*HORA,  productoDesc: 'Pollo Fresco Entero',  ean: '7460005001245', cantidad: 4,  valor: 480,  motivo: 'Vencimiento',           origen: 'manual' },
    { id: 2, fecha: HOY - 5*HORA,  productoDesc: 'Leche Entera Rica 1L', ean: '7460001001234', cantidad: 8,  valor: 320,  motivo: 'Avería',                origen: 'manual' },
    { id: 3, fecha: HOY - 8*HORA,  productoDesc: 'Galletas Oreo 36g',    ean: '2222222222222', cantidad: 12, valor: 240,  motivo: 'Avería',                origen: 'manual' },
    { id: 4, fecha: HOY - 1*DIA,   productoDesc: 'Detergente Ariel 2KG', ean: '7500435123456', cantidad: 2,  valor: 600,  motivo: 'Diferencia Inventario', origen: 'automático' },
    { id: 5, fecha: HOY - 2*DIA,   productoDesc: 'Arroz Bisonó 10lb',    ean: '7460002005487', cantidad: 5,  valor: 1250, motivo: 'Robo',                  origen: 'manual' },
    { id: 6, fecha: HOY - 3*DIA,   productoDesc: 'Coca-Cola 2L',         ean: '0120000001334', cantidad: 6,  valor: 480,  motivo: 'Avería',                origen: 'manual' }
];

export function registrarMerma({ productoDesc, ean, cantidad, valor, motivo, origen = 'manual' }) {
    mermas.unshift({
        id: Date.now() + Math.random(),
        fecha: Date.now(),
        productoDesc,
        ean,
        cantidad,
        valor,
        motivo,
        origen
    });
}
