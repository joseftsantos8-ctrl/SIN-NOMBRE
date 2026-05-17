import { users } from '../usuarios/data.js';
import { novedades } from '../tareas/data.js';
import { currentUser } from '../autenticacion/auth.js';
import { showNotification } from '../shell/notificaciones.js';

export function abrirModalReporteNovedades() {
    const select = document.getElementById('novedad-colaborador');
    select.innerHTML = '<option value="" disabled selected>Selecciona un colaborador</option>';
    Object.entries(users)
        .filter(([, u]) => u.role === 'Colaborador')
        .forEach(([id, u]) => {
            select.innerHTML += `<option value="${id}">${u.name} (${id})</option>`;
        });
    document.getElementById('modal-reporte-novedades').classList.remove('hidden');
}

export function handleReporteNovedades(e) {
    e.preventDefault();
    const colab  = document.getElementById('novedad-colaborador').value;
    const motivo = document.getElementById('novedad-motivo').value;
    const obs    = document.getElementById('novedad-obs').value;

    novedades.push({
        id: Date.now(),
        date: new Date().toLocaleDateString('es-ES'),
        colaborador: colab,
        motivo,
        observaciones: obs,
        reportadoPor: currentUser.id
    });

    showNotification(`Novedad de ${users[colab].name} reportada con éxito.`);
    document.getElementById('modal-reporte-novedades').classList.add('hidden');
    e.target.reset();
}
