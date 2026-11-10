/**
 * Configuración de Supabase (paso 4 de la guía).
 *
 * SUPABASE_URL      -> Supabase: Configuración > Data API > Project URL
 * SUPABASE_ANON_KEY -> Supabase: Configuración > API Keys > View legacy API keys > anon (public)
 *
 * Importante: usa SOLO la llave "anon" (pública). NUNCA pongas aquí la llave
 * "service_role", porque este archivo se ejecuta en el navegador y se sube a GitHub.
 */
window.APP_CONFIG = Object.freeze({
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_KEY'
});
