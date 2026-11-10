/**
 * Punto de entrada: crea el cliente de Supabase y arranca el controlador
 * según la página (data-page en <body>).
 */
(function (global) {
  const App = global.App;
  const doc = global.document;
  const navegar = (pagina) => global.location.replace(pagina);

  function mostrarErrorConfig(texto) {
    const caja = doc.getElementById('mensaje');
    if (caja) {
      caja.textContent = texto;
      caja.className = 'mensaje mensaje--error';
      caja.hidden = false;
    }
    const form = doc.getElementById('form-login');
    if (form) Array.from(form.elements).forEach((el) => { el.disabled = true; });
    console.error('[Config] ' + texto);
  }

  function arrancar() {
    const { client, error } = App.SupabaseFactory.crearCliente(global.APP_CONFIG, global.supabase);
    if (error) {
      mostrarErrorConfig(error);
      return;
    }
    const authModel = new App.AuthModel(client);
    const pagina = doc.body.dataset.page;

    if (pagina === 'login') {
      new App.LoginController(authModel, new App.LoginView(doc), navegar).iniciar();
    } else if (pagina === 'pedidos') {
      const vista = new App.PedidosView(doc, App.PedidoModel.formatearPesos);
      new App.PedidosController(authModel, App.PedidoModel, vista, navegar).iniciar();
    }
  }

  doc.addEventListener('DOMContentLoaded', arrancar);
})(window);
