export function addNavLink(text, iconClass, isActive = true, onClick = null) {
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
