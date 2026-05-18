// Captura de evidencia con la cámara trasera. Usa getUserMedia y un canvas para
// generar JPEG base64 comprimido. Bloquea galería (no usa <input type="file">).
//
// localhost se considera "secure context", así que getUserMedia funciona sin HTTPS.
// En producción real necesita HTTPS.

let streamActual = null;
let callbackActual = null;

export async function abrirCamaraParaEvidencia(callback) {
    callbackActual = callback;
    const video    = document.getElementById('camara-video');
    const errorDiv = document.getElementById('camara-error');
    const btnCap   = document.getElementById('btn-camara-capturar');

    errorDiv.classList.add('hidden');
    btnCap.disabled = true;
    document.getElementById('modal-camara').classList.remove('hidden');

    try {
        // facingMode: 'environment' = cámara trasera en móvil.
        // En desktop simplemente usa la única cámara disponible.
        streamActual = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
            audio: false
        });
        video.srcObject = streamActual;
        await video.play();
        btnCap.disabled = false;
    } catch (err) {
        let msg = err.message;
        if (err.name === 'NotAllowedError')        msg = 'Permiso de cámara denegado por el usuario.';
        else if (err.name === 'NotFoundError')     msg = 'No se encontró ninguna cámara en este dispositivo.';
        else if (err.name === 'NotReadableError')  msg = 'La cámara está siendo usada por otra aplicación.';
        else if (err.name === 'OverconstrainedError') msg = 'La cámara trasera no está disponible. Intentando con cualquier cámara…';

        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');

        // Retry sin restricción de facingMode si falló por overconstrained
        if (err.name === 'OverconstrainedError') {
            try {
                streamActual = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                video.srcObject = streamActual;
                await video.play();
                errorDiv.classList.add('hidden');
                btnCap.disabled = false;
            } catch (e2) {
                errorDiv.textContent = `Cámara no disponible: ${e2.message}`;
            }
        }
    }
}

export function capturarFoto() {
    const video  = document.getElementById('camara-video');
    const canvas = document.getElementById('camara-canvas');

    if (!video.videoWidth) {
        alert('La cámara aún no está lista, espera un momento.');
        return;
    }

    // Escalar a max 800px de ancho conservando aspecto
    const scale  = Math.min(1, 800 / video.videoWidth);
    canvas.width  = Math.round(video.videoWidth  * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.7);
    cerrarCamara();
    if (callbackActual) callbackActual(base64);
}

export function cerrarCamara() {
    if (streamActual) {
        streamActual.getTracks().forEach(t => t.stop());
        streamActual = null;
    }
    const video = document.getElementById('camara-video');
    if (video) video.srcObject = null;
    document.getElementById('modal-camara').classList.add('hidden');
    callbackActual = null;
}
