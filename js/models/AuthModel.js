/**
 * Modelo de autenticación: única capa que habla con Supabase Auth.
 */
(function (global) {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_PASSWORD = 6;

  const MENSAJES_ERROR = Object.freeze({
    'Invalid login credentials': 'Correo o contraseña incorrectos.',
    'Email not confirmed': 'El correo no está confirmado. Desactiva "Confirm email" en Supabase o confirma el correo.',
    'Failed to fetch': 'No hay conexión con Supabase. Revisa tu internet y la URL en js/config.js.'
  });

  function traducirError(error) {
    if (!error) return null;
    const mensaje = error.message || String(error);
    return MENSAJES_ERROR[mensaje] || `Error de autenticación: ${mensaje}`;
  }

  function validarCredenciales(email, password) {
    const correo = String(email || '').trim();
    if (!EMAIL_REGEX.test(correo)) return 'Escribe un correo válido.';
    if (String(password || '').length < MIN_PASSWORD) {
      return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
    }
    return null;
  }

  class AuthModel {
    constructor(client) {
      if (!client) throw new Error('AuthModel necesita un cliente de Supabase.');
      this.client = client;
    }

    async iniciarSesion(email, password) {
      const errorValidacion = validarCredenciales(email, password);
      if (errorValidacion) return { usuario: null, error: errorValidacion };
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: String(email).trim(),
          password: String(password)
        });
        if (error) return { usuario: null, error: traducirError(error) };
        return { usuario: data.user, error: null };
      } catch (e) {
        return { usuario: null, error: traducirError(e) };
      }
    }

    async cerrarSesion() {
      try {
        const { error } = await this.client.auth.signOut();
        return { error: traducirError(error) };
      } catch (e) {
        return { error: traducirError(e) };
      }
    }

    async obtenerSesion() {
      try {
        const { data, error } = await this.client.auth.getSession();
        if (error) return { sesion: null, error: traducirError(error) };
        return { sesion: data.session, error: null };
      } catch (e) {
        return { sesion: null, error: traducirError(e) };
      }
    }

    alCambiarSesion(callback) {
      const { data } = this.client.auth.onAuthStateChange((evento, sesion) => callback(evento, sesion));
      return () => data.subscription.unsubscribe();
    }
  }

  AuthModel.validarCredenciales = validarCredenciales;
  AuthModel.traducirError = traducirError;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthModel;
  } else {
    global.App = global.App || {};
    global.App.AuthModel = AuthModel;
  }
})(typeof window !== 'undefined' ? window : globalThis);
