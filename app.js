// --- DATABASE SIMULADA ---
let users = {
    'ADMIN': { name: 'Super Administrador', role: 'Admin', password: '1234' },
    'F.CEBALLOS': { name: 'Francois Ceballos', role: 'Gerente', password: '1234' },
    'H.ACOSTA': { name: 'Harold Acosta', role: 'Sugerente', password: '1234' },
    'F.ALVAREZ': { name: 'Frain Alvarez', role: 'Líder Centro de Tienda', password: '1234' },
    'A.FISH': { name: 'Angel Fish', role: 'Líder de Inventario', password: '1234' },
    'O.SUAREZ': { name: 'Omar Suarez', role: 'Líder de Almacén', password: '1234' },
    'J.AVILA': { name: 'Javier Avila', role: 'Colaborador', password: '1234' },
    'E.CEDANO': { name: 'E. Cedano', role: 'Colaborador', password: '1234' },
    'A.CASTILLO': { name: 'A. Castillo', role: 'Colaborador', password: '1234' },
    'L.FRESCOS': { name: 'Luis Frescos', role: 'Líder de Frescos', password: '1234' },
    'J.ARECHE': { name: 'JENEUFRY ARECHE DE LOS SANTOS', role: 'POP', password: '1234' }
};

const products = [
    { id: '1001', ean: '8806090123456', desc: 'TV Samsung 55" 4K', cat: 'Electrónica', stock: 45 },
    { id: '1002', ean: '7460001001234', desc: 'Leche Entera Rica 1L', cat: 'Lácteos', stock: 120 },
    { id: '1003', ean: '7500435123456', desc: 'Detergente Ariel 2KG', cat: 'Limpieza', stock: 15 },
    { id: '1004', ean: '7460002005487', desc: 'Arroz Bisonó 10lb', cat: 'Abarrotes', stock: 85 },
    { id: '1005', ean: '0120000001334', desc: 'Coca-Cola 2L', cat: 'Bebidas', stock: 200 },
    { id: '1006', ean: '7460005001245', desc: 'Pollo Fresco Entero', cat: 'Carnes', stock: 30 },
    { id: '1007', ean: '8410111002356', desc: 'Aceite Crisol 1 Gal', cat: 'Abarrotes', stock: 60 },
    { id: '1008', ean: '7460008001254', desc: 'Papel Higiénico 4ud', cat: 'Limpieza', stock: 150 },
    { id: '1009', ean: '1111111111111', desc: 'Jabón Protex', cat: 'Cuidado Personal', stock: 50 },
    { id: '1010', ean: '2222222222222', desc: 'Galletas Oreo 36g', cat: 'Snacks', stock: 80 }
];

// Generar 20,000 artículos extra dinámicamente para el inventario de la tienda
for (let i = 1; i <= 20000; i++) {
    products.push({
        id: (2000 + i).toString(),
        ean: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        desc: `Artículo Auto-Generado ${i}`,
        cat: 'General',
        stock: Math.floor(Math.random() * 500)
    });
}

let tasks = [
    {
        id: 1, type: 'Toma de productos en 0', desc: 'Revisar pasillo 4', status: 'pending', assignedTo: 'J.AVILA'
    }
];

let novedades = [];

let currentUser = null;
let currentTaskExecuting = null;

// --- CONFIGURACIÓN DE HERRAMIENTAS POR ROL ---
const roleOptions = {
    'Colaborador': [
        { icon: 'fa-box-open', title: 'Reposición Planograma', action: () => alert('Módulo de reposición de góndolas iniciado.') },
        { icon: 'fa-broom', title: 'Checklist de Higiene', action: () => alert('Iniciando checklist de sanidad y limpieza.') },
        { icon: 'fa-bullhorn', title: 'Apoyo Promocional', action: () => alert('Mostrando promociones activas en la tienda para asistir a clientes.') }
    ],
    'Gerente': [
        { icon: 'fa-chart-line', title: 'Dashboard de Ventas', action: () => alert('Cargando indicadores financieros... Ventas hoy: $450,000') },
        { icon: 'fa-users-gear', title: 'Gestión RRHH', action: () => alert('Apertura de panel de turnos, permisos y asignación de recursos.') },
        { icon: 'fa-arrow-trend-down', title: 'Reporte de Merma', action: () => alert('Generando informe de mermas y costos operativos.') },
        { icon: 'fa-user-clock', title: 'Reporte de Novedades', action: abrirModalReporteNovedades }
    ],
    'Sugerente': [
        { icon: 'fa-cash-register', title: 'Control de Cajas', action: () => alert('Supervisando cuadres y aperturas de caja.') },
        { icon: 'fa-chalkboard-user', title: 'Entrenamiento', action: () => alert('Módulo de entrenamiento para nuevos colaboradores.') },
        { icon: 'fa-triangle-exclamation', title: 'Incidencias Diarias', action: () => alert('Listado de incidencias operativas del día.') },
        { icon: 'fa-user-clock', title: 'Reporte de Novedades', action: abrirModalReporteNovedades }
    ],
    'Líder Centro de Tienda': [
        { icon: 'fa-clipboard-check', title: 'Checklist Piso Ventas', action: () => alert('Verificando orden, limpieza y exhibición de pasillos.') },
        { icon: 'fa-layer-group', title: 'Gestión Góndolas', action: () => alert('Revisión de frentes e inventario visible.') },
        { icon: 'fa-user-clock', title: 'Reporte de Novedades', action: abrirModalReporteNovedades }
    ],
    'Líder de Frescos': [
        { icon: 'fa-temperature-half', title: 'Control Sanitario', action: () => alert('Registrando temperaturas de neveras (Carnes/Deli).') },
        { icon: 'fa-leaf', title: 'Registro de Frescura', action: () => alert('Módulo de calidad, empaque y manipulación de alimentos.') },
        { icon: 'fa-user-clock', title: 'Reporte de Novedades', action: abrirModalReporteNovedades }
    ],
    'Líder de Inventario': [
        { icon: 'fa-server', title: 'Sincronizar SAP/WMS', action: () => alert('Conectando con sistemas centrales de logística...') },
        { icon: 'fa-boxes-stacked', title: 'Generador de Conteos', action: () => document.getElementById('inventario-panel').classList.remove('hidden') },
        { icon: 'fa-user-clock', title: 'Reporte de Novedades', action: abrirModalReporteNovedades }
    ],
    'Líder de Almacén': [
        { icon: 'fa-truck-ramp-box', title: 'Recepción de Furgones', action: () => alert('Formulario de recepción de proveedores abierto.') },
        { icon: 'fa-dolly', title: 'Despacho a Piso', action: () => alert('Solicitudes de mercancía desde piso de ventas: 4 pendientes.') },
        { icon: 'fa-cubes', title: 'Organización Almacén', action: () => alert('Gestionando flujo eficiente y espacio de almacenamiento.') },
        { icon: 'fa-user-clock', title: 'Reporte de Novedades', action: abrirModalReporteNovedades }
    ],
    'POP': [
        { icon: 'fa-images', title: 'Gestionar Material', action: () => alert('Gestionar y distribuir material publicitario (carteles, promociones, señalización, ofertas).') },
        { icon: 'fa-file-import', title: 'Formatos de Cartelería', action: () => alert('Recibir y enviar formatos de cartelería para campañas comerciales.') },
        { icon: 'fa-boxes-packing', title: 'Organizar Suministros', action: () => alert('Organizar suministros necesarios para montaje y exhibición.') },
        { icon: 'fa-check-double', title: 'Verificar Promociones', action: () => alert('Verificar que las promociones estén colocadas correctamente y a tiempo.') },
        { icon: 'fa-brush', title: 'Mantener Imagen', action: () => alert('Mantener la imagen visual de la tienda alineada con campañas de mercadeo.') },
        { icon: 'fa-tags', title: 'Cambios de Precio', action: () => alert('Imprimir lista de cambios, entregar lista actualizada y registrar entrega.') },
        { icon: 'fa-layer-group', title: 'Exhibiciones', action: () => alert('Revisar exhibiciones en piso de venta, confirmar orden y materiales promocionales.') },
        { icon: 'fa-bullhorn', title: 'Publicaciones & Cashback', action: () => alert('Confirmar publicaciones activas, promociones vigentes y validar cashback.') },
        { icon: 'fa-drumstick-bite', title: 'Consumos (Rosticería)', action: () => alert('Confirmar consumos del día en rosticería y validar salidas.') },
        { icon: 'fa-hands-helping', title: 'Apoyo en Tienda', action: () => alert('Apoyo en tienda. Nota: Cualquier solicitud de líderes es PRIORIDAD MÁXIMA.') }
    ],
    'Admin': [
        { icon: 'fa-shield-halved', title: 'Seguridad', action: () => alert('Sistemas operando al 100% sin brechas de seguridad.') },
        { icon: 'fa-plus-circle', title: 'Añadir Artículo', action: () => document.getElementById('modal-add-article').classList.remove('hidden') }
    ]
};

// --- DOM ELEMENTS ---
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// --- INIT ---
function init() {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Asignación Eventos Formularios y Botones
    if (document.getElementById('form-crear-usuario')) document.getElementById('form-crear-usuario').addEventListener('submit', handleCrearUsuario);
    if (document.getElementById('form-add-article')) {
        document.getElementById('form-add-article').addEventListener('submit', (e) => {
            e.preventDefault();
            const desc = document.getElementById('add-art-desc').value;
            const ean = document.getElementById('add-art-ean').value;
            const cat = document.getElementById('add-art-cat').value;
            const stock = document.getElementById('add-art-stock').value;
            products.unshift({
                id: Date.now().toString(),
                ean: ean,
                desc: desc,
                cat: cat,
                stock: parseInt(stock)
            });
            document.getElementById('modal-add-article').classList.add('hidden');
            e.target.reset();
            showNotification('Artículo añadido correctamente');
            if (!document.getElementById('inventario-panel').classList.contains('hidden')) {
                setupInventario();
            }
        });
    }
    const excelInput = document.getElementById('add-art-excel');
    if (excelInput) {
        excelInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                    
                    let count = 0;
                    // Ignoramos la primera fila asumiendo que son las cabeceras
                    for (let i = 1; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (row && row.length >= 2) {
                            products.unshift({
                                id: Date.now().toString() + i,
                                ean: (row[0] || '').toString(),
                                desc: (row[1] || '').toString(),
                                cat: (row[2] || 'General').toString(),
                                stock: parseInt(row[3]) || 0
                            });
                            count++;
                        }
                    }
                    document.getElementById('modal-add-article').classList.add('hidden');
                    excelInput.value = ''; // limpiar
                    showNotification(`${count} artículos añadidos desde Excel`);
                    if (!document.getElementById('inventario-panel').classList.contains('hidden')) {
                        setupInventario();
                    }
                } catch (error) {
                    alert('Error al leer el archivo Excel: Asegúrate de tener conexión a internet para cargar la librería SheetJS y de que el formato sea correcto.');
                    console.error(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }
    if (document.getElementById('btn-nueva-tarea')) document.getElementById('btn-nueva-tarea').addEventListener('click', abrirModalLider);
    if (document.getElementById('btn-cerrar-modal')) document.getElementById('btn-cerrar-modal').addEventListener('click', () => document.getElementById('modal-nueva-tarea').classList.add('hidden'));
    if (document.getElementById('form-nueva-tarea')) document.getElementById('form-nueva-tarea').addEventListener('submit', handleNuevaTarea);

    if (document.getElementById('form-reporte-novedades')) {
        document.getElementById('form-reporte-novedades').addEventListener('submit', (e) => {
            e.preventDefault();
            const colab = document.getElementById('novedad-colaborador').value;
            const motivo = document.getElementById('novedad-motivo').value;
            const obs = document.getElementById('novedad-obs').value;
            
            novedades.push({
                id: Date.now(),
                date: new Date().toLocaleDateString('es-ES'),
                colaborador: colab,
                motivo: motivo,
                observaciones: obs,
                reportadoPor: currentUser.id
            });
            
            showNotification(`Novedad de ${users[colab].name} reportada con éxito.`);
            document.getElementById('modal-reporte-novedades').classList.add('hidden');
            e.target.reset();
        });
    }

    if (document.getElementById('form-ejecutar-tarea')) document.getElementById('form-ejecutar-tarea').addEventListener('submit', handleEjecutarTarea);
    if (document.getElementById('btn-enviar-inv-manual')) document.getElementById('btn-enviar-inv-manual').addEventListener('click', enviarInventarioManual);

    // Perfil de Usuario
    const perfilInput = document.getElementById('perfil-foto-input');
    if (perfilInput) {
        perfilInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('perfil-preview-img').src = e.target.result;
                    document.getElementById('perfil-preview-img').classList.remove('hidden');
                    document.getElementById('perfil-preview-icon').classList.add('hidden');
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    if (document.getElementById('form-editar-perfil')) document.getElementById('form-editar-perfil').addEventListener('submit', handleGuardarPerfil);
}

// --- CORE ---
function handleLogin(e) {
    e.preventDefault();
    const userField = document.getElementById('username').value.trim().toUpperCase();
    const passField = document.getElementById('password').value;

    const user = users[userField];

    if (user && user.password === passField) {
        currentUser = { id: userField, ...user };
        loginError.classList.add('hidden');
        showDashboard();
    } else {
        loginError.classList.remove('hidden');
        loginForm.classList.add('error');
        setTimeout(() => loginForm.classList.remove('error'), 500);
    }
}

function handleLogout() {
    currentUser = null;
    dashboardView.classList.remove('active-view');
    setTimeout(() => {
        dashboardView.classList.add('hidden');
        loginView.classList.remove('hidden');
        loginView.classList.add('active-view');
    }, 300);
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showDashboard() {
    loginView.classList.remove('active-view');
    setTimeout(() => {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        void dashboardView.offsetWidth; // Reflow
        dashboardView.classList.add('active-view');
    }, 300);

    document.getElementById('current-user-name').textContent = currentUser.name;
    document.getElementById('current-user-role').textContent = currentUser.role;
    
    // Update Avatar
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    if (currentUser.profilePic) {
        sidebarAvatar.innerHTML = `<img src="${currentUser.profilePic}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    } else {
        sidebarAvatar.innerHTML = `<i class="fa-solid fa-user-circle"></i>`;
    }

    // Reset Panels
    document.querySelectorAll('.role-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('nav-links').innerHTML = '';

    // Inyectar Herramientas Dinámicas
    inyectarHerramientas(currentUser.role);

    // Route a la vista base
    if (currentUser.role === 'Admin') setupAdmin();
    else if (currentUser.role === 'Gerente' || currentUser.role === 'Sugerente') setupGerencia();
    else if (currentUser.role.includes('Líder') && currentUser.role !== 'Líder de Inventario') setupLider();
    else if (currentUser.role === 'Colaborador' || currentUser.role === 'POP') setupColaborador();
    else if (currentUser.role === 'Líder de Inventario') setupInventario();
}

function inyectarHerramientas(role) {
    const grid = document.getElementById('dynamic-tools-grid');
    grid.innerHTML = '';
    const tools = roleOptions[role];
    if (tools && tools.length > 0) {
        tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = 'stat-card glass-panel';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <i class="fa-solid ${tool.icon} stat-icon info"></i>
                <div><h4 style="margin:0">${tool.title}</h4></div>
            `;
            card.addEventListener('click', tool.action);
            grid.appendChild(card);
        });
        document.getElementById('dynamic-tools-section').classList.remove('hidden');
    } else {
        document.getElementById('dynamic-tools-section').classList.add('hidden');
    }
}

function addNavLink(text, iconClass, isActive = true, onClick = null) {
    const li = document.createElement('li');
    li.className = `nav-item ${isActive ? 'active' : ''}`;
    li.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${text}`;
    if (onClick) {
        li.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            onClick();
        });
    }
    document.getElementById('nav-links').appendChild(li);
}

function showNotification(msg) {
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="fa-solid fa-bell"></i> ${msg}`;
    container.appendChild(notif);
    setTimeout(() => { if (notif.parentNode) notif.parentNode.removeChild(notif); }, 3500);
}

// --- VISTAS ESPECÍFICAS ---

function setupAdmin() {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Administración';
    addNavLink('Gestión Usuarios', 'fa-user-shield');
}

function handleCrearUsuario(e) {
    e.preventDefault();
    const id = document.getElementById('new-user-id').value.trim().toUpperCase();
    const name = document.getElementById('new-user-name').value;
    const role = document.getElementById('new-user-role').value;
    const pass = document.getElementById('new-user-pass').value;

    if (users[id]) { alert('Este ID ya existe.'); return; }
    users[id] = { name, role, password: pass };
    showNotification(`Usuario ${name} creado.`);
    e.target.reset();
}

function setupGerencia() {
    document.getElementById('gerencia-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Panel de Control Gerencial';

    addNavLink('Agrupación Roles', 'fa-sitemap', true, () => {
        document.getElementById('gerencia-panel').classList.remove('hidden');
        document.getElementById('lider-panel').classList.add('hidden');
    });

    if (currentUser.id === 'F.CEBALLOS') {
        addNavLink('Asignar Tareas', 'fa-users-viewfinder', false, () => {
            document.getElementById('gerencia-panel').classList.add('hidden');
            document.getElementById('lider-panel').classList.remove('hidden');
            document.getElementById('lider-asignar-view').classList.remove('hidden');
            document.getElementById('lider-reportes-view').classList.add('hidden');
            renderLiderTasks();
        });
        addNavLink('Reportes Tareas', 'fa-chart-pie', false, () => {
            document.getElementById('gerencia-panel').classList.add('hidden');
            document.getElementById('lider-panel').classList.remove('hidden');
            document.getElementById('lider-asignar-view').classList.add('hidden');
            document.getElementById('lider-reportes-view').classList.remove('hidden');
            renderLiderReportes();
        });
    }

    const container = document.getElementById('roles-container');
    container.innerHTML = '';
    const grupos = {};
    for (const [id, user] of Object.entries(users)) {
        if (!grupos[user.role]) grupos[user.role] = [];
        grupos[user.role].push(`${user.name} (${id})`);
    }

    for (const [rolName, list] of Object.entries(grupos)) {
        const card = document.createElement('div');
        card.className = 'role-group-card glass-panel';
        let lis = list.map(item => `<li><span><i class="fa-solid fa-user-check"></i> ${item}</span></li>`).join('');
        card.innerHTML = `<h4>${rolName} (${list.length})</h4><ul class="role-group-list">${lis}</ul>`;
        container.appendChild(card);
    }
}

function setupColaborador() {
    document.getElementById('colaborador-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Mis Tareas Operativas';
    addNavLink('Tareas Asignadas', 'fa-list-check');
    renderColaboradorTasks();
}

function renderColaboradorTasks() {
    const list = document.getElementById('colaborador-task-list');
    list.innerHTML = '';
    const myTasks = tasks.filter(t => t.assignedTo === currentUser.id || t.assignedTo === 'TODOS');

    if (myTasks.length === 0) list.innerHTML = '<p>No tienes tareas asignadas.</p>';

    myTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item glass-panel ${task.status === 'completed' ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="task-info">
                <h4>${task.type}</h4>
                <p>${task.desc}</p>
            </div>
            <div class="task-actions">
                ${task.status === 'pending'
                ? `<button onclick="abrirModalEjecutar(${task.id})"><i class="fa-solid fa-pen-to-square"></i> Ejecutar</button>`
                : `<span>Listo</span>`}
            </div>
        `;
        list.appendChild(item);
    });
}

function setupLider() {
    document.getElementById('lider-panel').classList.remove('hidden');
    document.getElementById('page-title').textContent = 'Gestión de Tareas de Equipo';

    addNavLink('Asignar', 'fa-users-viewfinder', true, () => {
        document.getElementById('lider-asignar-view').classList.remove('hidden');
        document.getElementById('lider-reportes-view').classList.add('hidden');
        renderLiderTasks();
    });
    addNavLink('Reportes', 'fa-chart-pie', false, () => {
        document.getElementById('lider-asignar-view').classList.add('hidden');
        document.getElementById('lider-reportes-view').classList.remove('hidden');
        renderLiderReportes();
    });

    renderLiderTasks();
}

function renderLiderTasks() {
    const list = document.getElementById('lider-task-list');
    list.innerHTML = '';
    const activeTasks = tasks.filter(t => t.status === 'pending');
    if (activeTasks.length === 0) { list.innerHTML = '<p>No hay tareas activas.</p>'; return; }

    activeTasks.forEach(t => {
        list.innerHTML += `<div class="task-item glass-panel"><div class="task-info"><h4>${t.type}</h4><p>${t.desc} - Asignado a: <strong>${t.assignedTo}</strong></p></div></div>`;
    });
}

function renderLiderReportes() {
    const list = document.getElementById('lider-reportes-list');
    list.innerHTML = '';
    const doneTasks = tasks.filter(t => t.status === 'completed');
    if (doneTasks.length === 0) { list.innerHTML = '<p>No hay tareas completadas.</p>'; return; }

    doneTasks.forEach(t => {
        list.innerHTML += `
            <div class="task-item glass-panel completed">
                <div class="task-info"><h4>${t.type}</h4><p>${t.desc}</p></div>
                <div class="task-actions">
                    ${t.results ? `<button class="btn-primary" onclick="abrirModalResultados(${t.id})">Resultados</button>` : ''}
                </div>
            </div>`;
    });
}

function abrirModalLider() {
    const select = document.getElementById('tarea-colaborador');
    select.innerHTML = '<option value="" disabled selected>Selecciona al Personal</option>';
    Object.entries(users).forEach(([id, u]) => {
        if (u.role === 'POP' && currentUser.id !== 'F.CEBALLOS') return;
        select.innerHTML += `<option value="${id}">${u.name} - ${u.role}</option>`;
    });
    document.getElementById('modal-nueva-tarea').classList.remove('hidden');
}

function handleNuevaTarea(e) {
    e.preventDefault();
    tasks.push({
        id: Date.now(),
        type: document.getElementById('tarea-tipo').value,
        desc: document.getElementById('tarea-desc').value,
        status: 'pending',
        assignedTo: document.getElementById('tarea-colaborador').value
    });
    document.getElementById('modal-nueva-tarea').classList.add('hidden');
    e.target.reset();
    renderLiderTasks();
    showNotification('Tarea Asignada');
}

function setupInventario() {
    // La herramienta se lanza desde el action card "Módulo de Conteo", pero configuramos la vista base.
    document.getElementById('page-title').textContent = 'Control de Inventario Logístico';
    addNavLink('Módulo Principal', 'fa-home');

    const selectColab = document.getElementById('inv-colaborador-select');
    selectColab.innerHTML = '<option value="TODOS">Todos los colaboradores</option>';
    Object.entries(users).filter(([id, u]) => u.role === 'Colaborador').forEach(([id, u]) => {
        selectColab.innerHTML += `<option value="${id}">${u.name} (${id})</option>`;
    });

    const activeInventoryEans = new Set();
    tasks.filter(t => (t.type === 'Inventario Cíclico' || t.type.toLowerCase().includes('hueco')) && t.status !== 'completed').forEach(t => {
        if (t.data) t.data.forEach(prod => activeInventoryEans.add(prod.ean));
    });

    const grid = document.getElementById('product-selector-grid');
    grid.innerHTML = '';
    
    let itemsRendered = 0;
    for (const p of products) {
        if (itemsRendered >= 100) break;
        const isAssigned = activeInventoryEans.has(p.ean);
        if (isAssigned) continue;
        
        grid.innerHTML += `
            <label class="product-checkbox-item">
                <input type="checkbox" class="inv-checkbox" value="${p.id}" onchange="updateInvCounter()">
                <div><strong>${p.desc}</strong><span>EAN: ${p.ean} | Stock: ${p.stock}</span></div>
            </label>`;
        itemsRendered++;
    }
}

function abrirModalReporteNovedades() {
    const select = document.getElementById('novedad-colaborador');
    select.innerHTML = '<option value="" disabled selected>Selecciona un colaborador</option>';
    Object.entries(users).filter(([id, u]) => u.role === 'Colaborador').forEach(([id, u]) => {
        select.innerHTML += `<option value="${id}">${u.name} (${id})</option>`;
    });
    document.getElementById('modal-reporte-novedades').classList.remove('hidden');
}

function enviarInventarioManual() {
    const checks = document.querySelectorAll('.inv-checkbox:checked');
    if (checks.length === 0 || checks.length > 20) return alert('Selecciona entre 1 y 20 productos.');
    const assigned = document.getElementById('inv-colaborador-select').value;

    const selectedProds = [];
    checks.forEach(cb => {
        const prod = products.find(p => p.id === cb.value);
        if (prod) selectedProds.push({ ean: prod.ean, desc: prod.desc, stock: prod.stock });
    });

    tasks.push({
        id: Date.now(), type: 'Inventario Cíclico', desc: `Conteo de ${checks.length} producto(s).`,
        status: 'pending', assignedTo: assigned, data: selectedProds
    });

    showNotification(`Inventario asignado a ${assigned}.`);
    document.getElementById('inventario-panel').classList.add('hidden'); // Hide the module
    checks.forEach(c => c.checked = false);
    updateInvCounter();
}

// --- MODALS ---
window.abrirModalEjecutar = function (taskId) {
    const task = tasks.find(t => t.id === taskId);
    currentTaskExecuting = task;
    document.getElementById('ejecutar-titulo').textContent = task.type;
    document.getElementById('ejecutar-desc').textContent = task.desc;

    const container = document.getElementById('ejecutar-dinamico-container');
    container.innerHTML = '';

    if (task.data) {
        let html = '<p>Ingresa el conteo físico:</p>';
        task.data.forEach((prod, i) => {
            html += `<div style="margin-bottom:10px;"><strong>${prod.desc}</strong><br><input type="number" name="conteo_${i}" placeholder="Cantidad" required></div>`;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<textarea id="ejecutar-obs" rows="4" style="width:100%" placeholder="Observaciones..."></textarea>';
    }
    document.getElementById('modal-ejecutar-tarea').classList.remove('hidden');
}

function handleEjecutarTarea(e) {
    e.preventDefault();
    const task = currentTaskExecuting;

    if (task.data) {
        task.results = { type: 'inventario', items: [] };
        task.data.forEach((prod, i) => {
            const conteo = parseInt(document.querySelector(`input[name="conteo_${i}"]`).value) || 0;
            task.results.items.push({ desc: prod.desc, stockTeorico: prod.stock, conteo: conteo, dif: conteo - prod.stock });
        });
    } else {
        task.results = { type: 'general', obs: document.getElementById('ejecutar-obs').value || 'Completado sin observaciones.' };
    }

    task.status = 'completed';
    if (task.assignedTo === 'TODOS') task.assignedTo = currentUser.id;
    document.getElementById('modal-ejecutar-tarea').classList.add('hidden');
    renderColaboradorTasks();
    showNotification('Tarea completada.');
}

window.abrirModalResultados = function (taskId) {
    const task = tasks.find(t => t.id === taskId);
    document.getElementById('res-desc').innerHTML = `<strong>Tarea:</strong> ${task.type}<br><strong>Por:</strong> ${task.assignedTo}`;

    const tbody = document.getElementById('res-tbody');
    tbody.innerHTML = '';

    if (task.results.type === 'inventario') {
        document.getElementById('res-thead').innerHTML = `<tr><th>Producto</th><th>Teórico</th><th>Físico</th><th>Dif</th></tr>`;
        task.results.items.forEach(it => {
            tbody.innerHTML += `<tr><td>${it.desc}</td><td>${it.stockTeorico}</td><td>${it.conteo}</td><td style="font-weight:bold">${it.dif}</td></tr>`;
        });
    } else {
        document.getElementById('res-thead').innerHTML = `<tr><th>Observaciones</th></tr>`;
        tbody.innerHTML = `<tr><td>${task.results.obs}</td></tr>`;
    }
    document.getElementById('modal-ver-resultados').classList.remove('hidden');
}

// --- PERFIL DE USUARIO ---
window.abrirModalPerfil = function() {
    const previewImg = document.getElementById('perfil-preview-img');
    const previewIcon = document.getElementById('perfil-preview-icon');
    document.getElementById('perfil-foto-input').value = '';

    if (currentUser.profilePic) {
        previewImg.src = currentUser.profilePic;
        previewImg.classList.remove('hidden');
        previewIcon.classList.add('hidden');
    } else {
        previewImg.src = '';
        previewImg.classList.add('hidden');
        previewIcon.classList.remove('hidden');
    }

    document.getElementById('modal-editar-perfil').classList.remove('hidden');
}

function handleGuardarPerfil(e) {
    e.preventDefault();
    const previewImg = document.getElementById('perfil-preview-img');
    if (!previewImg.classList.contains('hidden') && previewImg.src) {
        currentUser.profilePic = previewImg.src;
        users[currentUser.id].profilePic = previewImg.src;
        
        // Actualizar sidebar
        document.getElementById('sidebar-avatar').innerHTML = `<img src="${currentUser.profilePic}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        
        showNotification('Foto de perfil actualizada exitosamente.');
    }
    document.getElementById('modal-editar-perfil').classList.add('hidden');
}

init();
