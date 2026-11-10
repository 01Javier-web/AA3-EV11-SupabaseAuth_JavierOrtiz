/**
 * Controlador de login: conecta la vista con el modelo de autenticación.
 */
(function (global) {
  const PAGINA_PROTEGIDA = 'pedidos.html';

  class LoginController {
    constructor(modelo, vista, navegar) {
      this.modelo = modelo;
      this.vista = vista;
      this.navegar = navegar;
    }

    async iniciar() {
      const { sesion } = await this.modelo.obtenerSesion();
      if (sesion) {
        this.navegar(PAGINA_PROTEGIDA);
        return;
      }
      this.vista.alEnviar((email, password) => this.ingresar(email, password));
    }

    async ingresar(email, password) {
      this.vista.cargando(true);
      const { usuario, error } = await this.modelo.iniciarSesion(email, password);
      if (error) {
        this.vista.cargando(false);
        this.vista.mostrarError(error);
        return;
      }
      this.vista.mostrarExito(`Bienvenido, ${usuario.email}. Redirigiendo...`);
      this.navegar(PAGINA_PROTEGIDA);
    }
  }

  global.App = global.App || {};
  global.App.LoginController = LoginController;
})(window);
