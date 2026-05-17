export function showNotification(msg) {
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="fa-solid fa-bell"></i> ${msg}`;
    container.appendChild(notif);
    setTimeout(() => { if (notif.parentNode) notif.parentNode.removeChild(notif); }, 3500);
}
