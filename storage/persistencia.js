// Persistencia con localStorage. Patrón de registry: cada data.js se registra
// con un getter (devuelve la colección actual) y un setter (reemplaza en sitio).
// Esto evita problemas con `export let` y dependencias circulares: persistencia.js
// no importa nada de los data.js, solo expone la API.

const STORAGE_KEY = 'sirena_estado_v1';

const registro = {};

export function registrarColeccion(key, getter, setter) {
    registro[key] = { getter, setter };
}

// Helpers para reemplazar en sitio (mantiene la misma referencia que ya importaron otros módulos)
export function reemplazarArray(target, source) {
    target.length = 0;
    if (Array.isArray(source)) source.forEach(item => target.push(item));
}

export function reemplazarObjeto(target, source) {
    for (const k of Object.keys(target)) delete target[k];
    if (source && typeof source === 'object') {
        for (const k of Object.keys(source)) target[k] = source[k];
    }
}

let pendienteGuardar = null;
export function guardarTodo() {
    // Debounce 200ms para evitar escrituras múltiples seguidas
    if (pendienteGuardar) clearTimeout(pendienteGuardar);
    pendienteGuardar = setTimeout(() => {
        try {
            const snap = {};
            for (const k of Object.keys(registro)) snap[k] = registro[k].getter();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
        } catch (err) {
            console.error('[persistencia] Error guardando:', err);
        }
        pendienteGuardar = null;
    }, 200);
}

export function cargarTodo() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const snap = JSON.parse(raw);
        for (const k of Object.keys(snap)) {
            if (registro[k]) registro[k].setter(snap[k]);
        }
        return true;
    } catch (err) {
        console.error('[persistencia] Error cargando:', err);
        return false;
    }
}

export function resetearTodo() {
    if (!confirm('¿Borrar TODOS los datos guardados y volver al estado inicial?\n\nEsto recargará la página.')) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

// Atajo para debugging desde consola
window.SIRENA_RESET = resetearTodo;
window.SIRENA_GUARDAR = guardarTodo;
