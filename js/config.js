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
  SUPABASE_URL: 'https://vnvxzwuzudydffqwpjue.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudnh6d3V6dWR5ZGZmcXdwanVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzNDIxOTgsImV4cCI6MjEwOTkxODE5OH0.X2-QAiROHTNTS7IjvBDdEej1u5-kCaEDLw1UarAYHwQ'
});
