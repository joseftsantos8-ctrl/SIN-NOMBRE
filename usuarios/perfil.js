import { currentUser } from '../autenticacion/auth.js';
import { users } from './data.js';
import { showNotification } from '../shell/notificaciones.js';

export function abrirModalPerfil() {
    const previewImg  = document.getElementById('perfil-preview-img');
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

export function handleGuardarPerfil(e) {
    e.preventDefault();
    const previewImg = document.getElementById('perfil-preview-img');
    if (!previewImg.classList.contains('hidden') && previewImg.src) {
        currentUser.profilePic = previewImg.src;
        users[currentUser.id].profilePic = previewImg.src;
        document.getElementById('sidebar-avatar').innerHTML =
            `<img src="${currentUser.profilePic}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        showNotification('Foto de perfil actualizada exitosamente.');
    }
    document.getElementById('modal-editar-perfil').classList.add('hidden');
}
