/**
 * Vista del panel de pedidos (página protegida).
 * Usa textContent para no inyectar HTML con datos del usuario.
 */
(function (global) {
  function crear(doc, etiqueta, clase, texto) {
    const el = doc.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  class PedidosView {
    constructor(doc, formatearPesos) {
      this.doc = doc;
      this.formatear = formatearPesos;
      this.usuario = doc.getElementById('usuario-email');
      this.ultimoAcceso = doc.getElementById('usuario-acceso');
      this.catalogo = doc.getElementById('catalogo');
      this.carrito = doc.getElementById('carrito');
      this.total = doc.getElementById('total');
      this.btnSalir = doc.getElementById('btn-logout');
      this.btnConfirmar = doc.getElementById('btn-confirmar');
      this.mensaje = doc.getElementById('mensaje');
    }

    mostrarUsuario(usuario) {
      this.doc.getElementById('contenido').hidden = false;
      this.usuario.textContent = usuario.email;
      const fecha = usuario.last_sign_in_at ? new Date(usuario.last_sign_in_at) : new Date();
      this.ultimoAcceso.textContent = 'Último acceso: ' + fecha.toLocaleString('es-CO');
    }

    renderCatalogo(productos, alAgregar) {
      this.catalogo.replaceChildren();
      productos.forEach((p) => {
        const tarjeta = crear(this.doc, 'article', 'producto');
        tarjeta.append(
          crear(this.doc, 'span', 'producto__emoji', p.emoji),
          crear(this.doc, 'h3', 'producto__nombre', p.nombre),
          crear(this.doc, 'p', 'producto__precio', this.formatear(p.precio))
        );
        const boton = crear(this.doc, 'button', 'btn btn--secundario', 'Agregar');
        boton.type = 'button';
        boton.addEventListener('click', () => alAgregar(p.id));
        tarjeta.append(boton);
        this.catalogo.append(tarjeta);
      });
    }

    renderCarrito(items, total, alQuitar) {
      this.carrito.replaceChildren();
      if (items.length === 0) {
        this.carrito.append(crear(this.doc, 'li', 'carrito__vacio', 'Tu pedido está vacío.'));
      }
      items.forEach((item) => {
        const fila = crear(this.doc, 'li', 'carrito__item');
        fila.append(
          crear(this.doc, 'span', '', `${item.cantidad} × ${item.nombre}`),
          crear(this.doc, 'span', 'carrito__subtotal', this.formatear(item.precio * item.cantidad))
        );
        const quitar = crear(this.doc, 'button', 'btn-icono', '−');
        quitar.type = 'button';
        quitar.setAttribute('aria-label', `Quitar ${item.nombre}`);
        quitar.addEventListener('click', () => alQuitar(item.id));
        fila.append(quitar);
        this.carrito.append(fila);
      });
      this.total.textContent = this.formatear(total);
      this.btnConfirmar.disabled = items.length === 0;
    }

    alCerrarSesion(handler) {
      this.btnSalir.addEventListener('click', handler);
    }

    alConfirmar(handler) {
      this.btnConfirmar.addEventListener('click', handler);
    }

    mostrarMensaje(texto, tipo) {
      this.mensaje.textContent = texto;
      this.mensaje.className = `mensaje mensaje--${tipo === 'error' ? 'error' : 'ok'}`;
      this.mensaje.hidden = false;
    }
  }

  global.App = global.App || {};
  global.App.PedidosView = PedidosView;
})(window);
