import { abrirModalReporteNovedades } from '../novedades/novedades.js';
import { abrirModalNegativos } from '../inventario/negativos.js';
import { abrirModalRegistrarMerma } from '../mermas/registro.js';
import { abrirModalPedidoVegetales } from '../pedidos/vegetales.js';
import { abrirModalPedidoCarnes } from '../pedidos/carnes.js';
import { abrirModalLevantamientoFrescos } from '../frescos/levantamiento.js';
import { abrirModalPlanos } from '../planos/planos.js';
import { abrirModalAuditoria } from '../auditoria/auditoria.js';

const roleOptions = {
    'Colaborador': [
        { icon: 'fa-box-open',   title: 'Reposición Planograma', action: () => alert('Módulo de reposición de góndolas iniciado.') },
        { icon: 'fa-broom',      title: 'Checklist de Higiene',  action: () => alert('Iniciando checklist de sanidad y limpieza.') },
        { icon: 'fa-bullhorn',   title: 'Apoyo Promocional',     action: () => alert('Mostrando promociones activas en la tienda para asistir a clientes.') },
        { icon: 'fa-map-location-dot', title: 'Planos de Tienda', action: abrirModalPlanos }
    ],
    'Gerente': [
        { icon: 'fa-chart-line',      title: 'Dashboard de Ventas',   action: () => alert('Cargando indicadores financieros... Ventas hoy: $450,000') },
        { icon: 'fa-users-gear',      title: 'Gestión RRHH',          action: () => alert('Apertura de panel de turnos, permisos y asignación de recursos.') },
        { icon: 'fa-arrow-trend-down',title: 'Registrar Merma',       action: abrirModalRegistrarMerma },
        { icon: 'fa-user-clock',      title: 'Reporte de Novedades',  action: abrirModalReporteNovedades },
        { icon: 'fa-map-location-dot',title: 'Planos de Tienda',      action: abrirModalPlanos }
    ],
    'Sugerente': [
        { icon: 'fa-cash-register',       title: 'Control de Cajas',       action: () => alert('Supervisando cuadres y aperturas de caja.') },
        { icon: 'fa-chalkboard-user',     title: 'Entrenamiento',           action: () => alert('Módulo de entrenamiento para nuevos colaboradores.') },
        { icon: 'fa-triangle-exclamation',title: 'Incidencias Diarias',     action: () => alert('Listado de incidencias operativas del día.') },
        { icon: 'fa-user-clock',          title: 'Reporte de Novedades',   action: abrirModalReporteNovedades },
        { icon: 'fa-fish-fins',           title: 'Levantamiento Frescos',  action: abrirModalLevantamientoFrescos },
        { icon: 'fa-map-location-dot',    title: 'Planos de Tienda',       action: abrirModalPlanos }
    ],
    'Líder Centro de Tienda': [
        { icon: 'fa-clipboard-check', title: 'Checklist Piso Ventas', action: () => alert('Verificando orden, limpieza y exhibición de pasillos.') },
        { icon: 'fa-layer-group',     title: 'Gestión Góndolas',      action: () => alert('Revisión de frentes e inventario visible.') },
        { icon: 'fa-user-clock',      title: 'Reporte de Novedades',  action: abrirModalReporteNovedades },
        { icon: 'fa-fish-fins',       title: 'Levantamiento Frescos', action: abrirModalLevantamientoFrescos },
        { icon: 'fa-drumstick-bite',  title: 'Pedido de Carnes',      action: abrirModalPedidoCarnes },
        { icon: 'fa-map-location-dot',title: 'Planos de Tienda',      action: abrirModalPlanos }
    ],
    'Líder de Frescos': [
        { icon: 'fa-temperature-half', title: 'Control Sanitario',   action: () => alert('Registrando temperaturas de neveras (Carnes/Deli).') },
        { icon: 'fa-leaf',             title: 'Registro de Frescura', action: () => alert('Módulo de calidad, empaque y manipulación de alimentos.') },
        { icon: 'fa-user-clock',       title: 'Reporte de Novedades', action: abrirModalReporteNovedades },
        { icon: 'fa-fish-fins',        title: 'Levantamiento Frescos',action: abrirModalLevantamientoFrescos },
        { icon: 'fa-drumstick-bite',   title: 'Pedido de Carnes',     action: abrirModalPedidoCarnes },
        { icon: 'fa-map-location-dot', title: 'Planos de Tienda',     action: abrirModalPlanos }
    ],
    'Líder de Inventario': [
        { icon: 'fa-server',          title: 'Sincronizar SAP/WMS',  action: () => alert('Conectando con sistemas centrales de logística...') },
        { icon: 'fa-boxes-stacked',   title: 'Generador de Conteos', action: () => document.getElementById('inventario-panel').classList.remove('hidden') },
        { icon: 'fa-circle-exclamation', title: 'Gestionar Negativos', action: abrirModalNegativos },
        { icon: 'fa-user-clock',      title: 'Reporte de Novedades', action: abrirModalReporteNovedades },
        { icon: 'fa-map-location-dot',title: 'Planos de Tienda',     action: abrirModalPlanos }
    ],
    'Líder de Almacén': [
        { icon: 'fa-truck-ramp-box', title: 'Recepción de Furgones', action: () => alert('Formulario de recepción de proveedores abierto.') },
        { icon: 'fa-dolly',          title: 'Despacho a Piso',       action: () => alert('Solicitudes de mercancía desde piso de ventas: 4 pendientes.') },
        { icon: 'fa-cubes',          title: 'Organización Almacén',  action: () => alert('Gestionando flujo eficiente y espacio de almacenamiento.') },
        { icon: 'fa-user-clock',     title: 'Reporte de Novedades',  action: abrirModalReporteNovedades },
        { icon: 'fa-fish-fins',      title: 'Levantamiento Frescos', action: abrirModalLevantamientoFrescos },
        { icon: 'fa-carrot',         title: 'Pedido de Vegetales',   action: abrirModalPedidoVegetales },
        { icon: 'fa-map-location-dot',title: 'Planos de Tienda',     action: abrirModalPlanos }
    ],
    'POP': [
        { icon: 'fa-images',         title: 'Gestionar Material',       action: () => alert('Gestionar y distribuir material publicitario (carteles, promociones, señalización, ofertas).') },
        { icon: 'fa-file-import',    title: 'Formatos de Cartelería',   action: () => alert('Recibir y enviar formatos de cartelería para campañas comerciales.') },
        { icon: 'fa-boxes-packing',  title: 'Organizar Suministros',    action: () => alert('Organizar suministros necesarios para montaje y exhibición.') },
        { icon: 'fa-check-double',   title: 'Verificar Promociones',    action: () => alert('Verificar que las promociones estén colocadas correctamente y a tiempo.') },
        { icon: 'fa-brush',          title: 'Mantener Imagen',          action: () => alert('Mantener la imagen visual de la tienda alineada con campañas de mercadeo.') },
        { icon: 'fa-tags',           title: 'Cambios de Precio',        action: () => alert('Imprimir lista de cambios, entregar lista actualizada y registrar entrega.') },
        { icon: 'fa-layer-group',    title: 'Exhibiciones',             action: () => alert('Revisar exhibiciones en piso de venta, confirmar orden y materiales promocionales.') },
        { icon: 'fa-bullhorn',       title: 'Publicaciones & Cashback', action: () => alert('Confirmar publicaciones activas, promociones vigentes y validar cashback.') },
        { icon: 'fa-drumstick-bite', title: 'Consumos (Rosticería)',    action: () => alert('Confirmar consumos del día en rosticería y validar salidas.') },
        { icon: 'fa-hands-helping',  title: 'Apoyo en Tienda',         action: () => alert('Apoyo en tienda. Nota: Cualquier solicitud de líderes es PRIORIDAD MÁXIMA.') },
        { icon: 'fa-map-location-dot', title: 'Planos de Tienda',      action: abrirModalPlanos }
    ],
    'Admin': [
        { icon: 'fa-shield-halved', title: 'Seguridad',          action: () => alert('Sistemas operando al 100% sin brechas de seguridad.') },
        { icon: 'fa-plus-circle',   title: 'Añadir Artículo',    action: () => document.getElementById('modal-add-article').classList.remove('hidden') },
        { icon: 'fa-clipboard-list',title: 'Auditoría',          action: abrirModalAuditoria },
        { icon: 'fa-map-location-dot', title: 'Planos de Tienda', action: abrirModalPlanos }
    ]
};

export function inyectarHerramientas(role) {
    const grid    = document.getElementById('dynamic-tools-grid');
    grid.innerHTML = '';
    const tools   = roleOptions[role];

    if (tools && tools.length > 0) {
        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className    = 'stat-card glass-panel';
            card.style.cursor = 'pointer';
            card.innerHTML    = `
                <i class="fa-solid ${tool.icon} stat-icon info"></i>
                <div><h4 style="margin:0">${tool.title}</h4></div>`;
            card.addEventListener('click', tool.action);
            grid.appendChild(card);
        });
        document.getElementById('dynamic-tools-section').classList.remove('hidden');
    } else {
        document.getElementById('dynamic-tools-section').classList.add('hidden');
    }
}
