// Escáner de código de barras usando BarcodeDetector API nativa.
// Funciona en Chrome/Edge (Android, desktop con cámara) en localhost o HTTPS.
// Fallback: pegar EAN a mano.

import { products } from '../inventario/productos.js';
import { materiales } from '../suministros/data.js';
import { showNotification } from '../shell/notificaciones.js';

let stream = null;
let detector = null;
let loop = null;
let callbackEncontrado = null;

const FORMATOS = ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'];

export async function abrirEscaner(callback) {
    callbackEncontrado = callback || null;
    document.getElementById('escaner-resultado').classList.add('hidden');
    document.getElementById('escaner-error').classList.add('hidden');
    document.getElementById('modal-escaner').classList.remove('hidden');

    if (!('BarcodeDetector' in window)) {
        document.getElementById('escaner-error').textContent = 'Tu navegador no soporta BarcodeDetector. Usa Chrome o Edge (móvil Android o desktop con cámara).';
        document.getElementById('escaner-error').classList.remove('hidden');
        return;
    }

    detector = new BarcodeDetector({ formats: FORMATOS });

    const video = document.getElementById('escaner-video');
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false
        });
        video.srcObject = stream;
        await video.play();
        loop = setInterval(() => detectar(video), 300);
    } catch (err) {
        document.getElementById('escaner-error').textContent = `Cámara: ${err.message}`;
        document.getElementById('escaner-error').classList.remove('hidden');
    }
}

async function detectar(video) {
    if (!detector || !video.videoWidth) return;
    try {
        const codigos = await detector.detect(video);
        if (codigos.length > 0) {
            const codigo = codigos[0].rawValue;
            mostrarResultado(codigo);
        }
    } catch {
        // ignora errores transitorios
    }
}

function mostrarResultado(codigo) {
    // Buscar en productos o materiales
    const prod = products.find(p => p.ean === codigo);
    const mat  = materiales.find(m => m.ean === codigo);

    let html = `<strong style="font-size:1.1rem;">EAN: ${codigo}</strong><br>`;
    if (prod) {
        html += `<span style="color:#10b981;"><i class="fa-solid fa-check-circle"></i> Producto: ${prod.desc}</span><br>`;
        html += `<small>Categoría: ${prod.cat} · Stock: ${prod.stock}</small>`;
    } else if (mat) {
        html += `<span style="color:#10b981;"><i class="fa-solid fa-check-circle"></i> Material: ${mat.descripcion}</span><br>`;
        html += `<small>Stock: ${mat.stock} (mín. ${mat.minimo})</small>`;
    } else {
        html += `<span style="color:#f59e0b;"><i class="fa-solid fa-triangle-exclamation"></i> Código no encontrado en el sistema</span>`;
    }

    const wrap = document.getElementById('escaner-resultado');
    wrap.innerHTML = html;
    wrap.classList.remove('hidden');

    if (callbackEncontrado) {
        const res = { ean: codigo, producto: prod || null, material: mat || null };
        callbackEncontrado(res);
        callbackEncontrado = null;  // solo una vez
    }
}

export function cerrarEscaner() {
    if (loop) { clearInterval(loop); loop = null; }
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
    const video = document.getElementById('escaner-video');
    if (video) video.srcObject = null;
    document.getElementById('modal-escaner').classList.add('hidden');
}

export function handleEscanerManual() {
    const ean = prompt('Ingresa el EAN manualmente (sin cámara):');
    if (ean) mostrarResultado(ean.trim());
}
