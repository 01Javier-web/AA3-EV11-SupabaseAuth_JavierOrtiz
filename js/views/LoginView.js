/**
 * Vista de login: solo maneja el DOM (leer campos, mostrar mensajes).
 */
(function (global) {
  class LoginView {
    constructor(doc) {
      this.form = doc.getElementById('form-login');
      this.email = doc.getElementById('email');
      this.password = doc.getElementById('password');
      this.boton = doc.getElementById('btn-login');
      this.mensaje = doc.getElementById('mensaje');
    }

    alEnviar(handler) {
      this.form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        handler(this.email.value, this.password.value);
      });
    }

    cargando(activo) {
      this.boton.disabled = activo;
      this.boton.textContent = activo ? 'Validando...' : 'Iniciar sesión';
    }

    mostrarError(texto) {
      this.mensaje.textContent = texto;
      this.mensaje.className = 'mensaje mensaje--error';
      this.mensaje.hidden = false;
    }

    mostrarExito(texto) {
      this.mensaje.textContent = texto;
      this.mensaje.className = 'mensaje mensaje--ok';
      this.mensaje.hidden = false;
    }

    bloquearFormulario() {
      this.email.disabled = true;
      this.password.disabled = true;
      this.boton.disabled = true;
    }
  }

  global.App = global.App || {};
  global.App.LoginView = LoginView;
})(window);
