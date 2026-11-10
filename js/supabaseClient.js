/**
 * Crea el cliente de Supabase a partir de js/config.js.
 * Si las credenciales aún son las de ejemplo, no crea el cliente y deja
 * un mensaje claro para mostrar en pantalla.
 */
(function (global) {
  const PLACEHOLDER_URL = 'https://TU-PROYECTO.supabase.co';
  const PLACEHOLDER_KEY = 'TU_ANON_KEY';

  function validarConfig(config) {
    if (!config) {
      return 'No se encontró js/config.js. Revisa que el archivo exista y se cargue antes que los demás scripts.';
    }
    const url = String(config.SUPABASE_URL || '').trim();
    const key = String(config.SUPABASE_ANON_KEY || '').trim();
    if (!url || url === PLACEHOLDER_URL || !key || key === PLACEHOLDER_KEY) {
      return 'Falta configurar Supabase: escribe tu SUPABASE_URL y SUPABASE_ANON_KEY en js/config.js.';
    }
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
      return 'SUPABASE_URL no tiene el formato esperado (https://xxxx.supabase.co).';
    }
    return null;
  }

  function crearCliente(config, supabaseLib) {
    const error = validarConfig(config);
    if (error) return { client: null, error };
    if (!supabaseLib || typeof supabaseLib.createClient !== 'function') {
      return { client: null, error: 'No se pudo cargar la librería de Supabase (revisa tu conexión a internet).' };
    }
    const client = supabaseLib.createClient(config.SUPABASE_URL.trim(), config.SUPABASE_ANON_KEY.trim(), {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    return { client, error: null };
  }

  const api = { validarConfig, crearCliente };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.App = global.App || {};
    global.App.SupabaseFactory = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
