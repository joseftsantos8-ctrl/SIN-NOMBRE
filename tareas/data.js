// Tareas seed con timestamps para alimentar el dashboard ejecutivo.
const HOY  = Date.now();
const HORA = 3600 * 1000;
const DIA  = 24 * HORA;

export let tasks = [
    // --- F.CEBALLOS (Líder de Tienda) ---
    { id: 101, type: 'Reposición Planograma', desc: 'Revisar pasillo 4', status: 'pending',
      assignedTo: 'J.AVILA',    assignedBy: 'F.CEBALLOS', createdAt: HOY - 4*HORA,  dueAt: HOY + 4*HORA,  completedAt: null },
    { id: 102, type: 'Auditoría Exhibición', desc: 'Validar nueva exhibición de Coca-Cola', status: 'completed',
      assignedTo: 'E.CEDANO',   assignedBy: 'F.CEBALLOS', createdAt: HOY - 2*DIA,   dueAt: HOY - 1*DIA,   completedAt: HOY - 1*DIA - 3*HORA },
    { id: 103, type: 'Checklist Higiene', desc: 'Sanidad en zona de cajas', status: 'completed',
      assignedTo: 'A.CASTILLO', assignedBy: 'F.CEBALLOS', createdAt: HOY - 3*DIA,   dueAt: HOY - 2*DIA,   completedAt: HOY - 2*DIA + 2*HORA },

    // --- F.ALVAREZ (Líder Centro de Tienda) ---
    { id: 201, type: 'Checklist Piso Ventas', desc: 'Verificar orden de pasillos 1-5', status: 'completed',
      assignedTo: 'J.AVILA',    assignedBy: 'F.ALVAREZ', createdAt: HOY - 1*DIA,   dueAt: HOY - 12*HORA, completedAt: HOY - 14*HORA },
    { id: 202, type: 'Gestión Góndolas', desc: 'Revisar frentes pasillo 7', status: 'pending',
      assignedTo: 'E.CEDANO',   assignedBy: 'F.ALVAREZ', createdAt: HOY - 6*HORA,  dueAt: HOY + 6*HORA,  completedAt: null },

    // --- L.FRESCOS (Líder de Frescos) ---
    { id: 301, type: 'Control Sanitario', desc: 'Registro temperaturas carnicería', status: 'completed',
      assignedTo: 'A.CASTILLO', assignedBy: 'L.FRESCOS', createdAt: HOY - 2*DIA,   dueAt: HOY - 1*DIA,   completedAt: HOY - 1*DIA - 4*HORA },
    { id: 302, type: 'Registro Frescura', desc: 'Verificar empaque deli', status: 'completed',
      assignedTo: 'J.AVILA',    assignedBy: 'L.FRESCOS', createdAt: HOY - 1*DIA,   dueAt: HOY - 8*HORA,  completedAt: HOY - 4*HORA }, // tarde

    // --- O.SUAREZ (Líder de Almacén) ---
    { id: 401, type: 'Recepción Furgones', desc: 'Recibir mercancía proveedor X', status: 'completed',
      assignedTo: 'A.CASTILLO', assignedBy: 'O.SUAREZ', createdAt: HOY - 3*DIA,   dueAt: HOY - 2*DIA,   completedAt: HOY - 2*DIA - 6*HORA },
    { id: 402, type: 'Despacho a Piso', desc: 'Enviar abarrotes pendientes', status: 'pending',
      assignedTo: 'E.CEDANO',   assignedBy: 'O.SUAREZ', createdAt: HOY - 3*HORA,  dueAt: HOY + 3*HORA,  completedAt: null },

    // --- H.ACOSTA (Sugerente) ---
    { id: 501, type: 'Control de Cajas', desc: 'Cuadre matutino', status: 'completed',
      assignedTo: 'J.AVILA',    assignedBy: 'H.ACOSTA', createdAt: HOY - 1*DIA,   dueAt: HOY - 16*HORA, completedAt: HOY - 18*HORA },
];

export let novedades = [];
