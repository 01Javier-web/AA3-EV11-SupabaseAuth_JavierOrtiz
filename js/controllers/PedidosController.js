/**
 * Controlador del panel de pedidos: protege la página y maneja el carrito.
 */
(function (global) {
  const PAGINA_LOGIN = 'index.html';

  class PedidosController {
    constructor(authModel, pedidoModel, vista, navegar) {
      this.auth = authModel;
      this.pedidos = pedidoModel;
      this.vista = vista;
      this.navegar = navegar;
      this.carrito = [];
    }

    async iniciar() {
      const { sesion } = await this.auth.obtenerSesion();
      if (!sesion) {
        this.navegar(PAGINA_LOGIN);
        return;
      }
      this.vista.mostrarUsuario(sesion.user);
      this.vista.renderCatalogo(this.pedidos.obtenerCatalogo(), (id) => this.agregar(id));
      this.renderCarrito();
      this.vista.alCerrarSesion(() => this.salir());
      this.vista.alConfirmar(() => this.confirmar(sesion.user));
      this.auth.alCambiarSesion((evento) => {
        if (evento === 'SIGNED_OUT') this.navegar(PAGINA_LOGIN);
      });
    }

    agregar(id) {
      this.carrito = this.pedidos.agregarAlCarrito(this.carrito, id);
      this.renderCarrito();
    }

    quitar(id) {
      this.carrito = this.pedidos.quitarDelCarrito(this.carrito, id);
      this.renderCarrito();
    }

    renderCarrito() {
      this.vista.renderCarrito(this.carrito, this.pedidos.calcularTotal(this.carrito), (id) => this.quitar(id));
    }

    confirmar(usuario) {
      const total = this.pedidos.formatearPesos(this.pedidos.calcularTotal(this.carrito));
      this.vista.mostrarMensaje(`Pedido de ${usuario.email} registrado por ${total} (demostración).`, 'ok');
      this.carrito = [];
      this.renderCarrito();
    }

    async salir() {
      const { error } = await this.auth.cerrarSesion();
      if (error) {
        this.vista.mostrarMensaje(error, 'error');
        return;
      }
      this.navegar(PAGINA_LOGIN);
    }
  }

  global.App = global.App || {};
  global.App.PedidosController = PedidosController;
})(window);
