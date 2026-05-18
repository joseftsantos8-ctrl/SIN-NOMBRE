import { registrarMerma } from './data.js';
import { showNotification } from '../shell/notificaciones.js';
import { currentUser } from '../autenticacion/auth.js';
import { registrarAccion } from '../auditoria/auditoria.js';

export function abrirModalRegistrarMerma() {
    const modal = document.getElementById('modal-registrar-merma');
    document.getElementById('form-registrar-merma').reset();
    modal.classList.remove('hidden');
}

export function handleRegistrarMerma(e) {
    e.preventDefault();
    const productoDesc = document.getElementById('merma-desc').value.trim();
    const ean          = document.getElementById('merma-ean').value.trim() || '—';
    const cantidad     = parseInt(document.getElementById('merma-cantidad').value) || 0;
    const valor        = parseFloat(document.getElementById('merma-valor').value) || 0;
    const motivo       = document.getElementById('merma-motivo').value;

    if (!productoDesc || cantidad <= 0) {
        alert('Producto y cantidad son obligatorios.');
        return;
    }

    registrarMerma({ productoDesc, ean, cantidad, valor, motivo, origen: 'manual' });
    registrarAccion(currentUser?.id || '(desconocido)', 'Registrar merma', `${productoDesc} x${cantidad} ($${valor}) — ${motivo}`);
    document.getElementById('modal-registrar-merma').classList.add('hidden');
    showNotification(`Merma registrada: ${productoDesc} x${cantidad}`);
}
