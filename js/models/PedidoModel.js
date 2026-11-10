/**
 * Modelo de pedidos de Mekatos (demostración).
 * Catálogo fijo y carrito inmutable: cada operación devuelve un carrito nuevo.
 */
(function (global) {
  const CATALOGO = Object.freeze([
    Object.freeze({ id: 'emp-01', nombre: 'Empanada de carne', precio: 2500, emoji: '🥟' }),
    Object.freeze({ id: 'pap-01', nombre: 'Papas de limón', precio: 2000, emoji: '🍟' }),
    Object.freeze({ id: 'ach-01', nombre: 'Achiras', precio: 3000, emoji: '🥨' }),
    Object.freeze({ id: 'boc-01', nombre: 'Bocadillo veleño', precio: 1500, emoji: '🍬' }),
    Object.freeze({ id: 'gas-01', nombre: 'Gaseosa 400 ml', precio: 3500, emoji: '🥤' }),
    Object.freeze({ id: 'chi-01', nombre: 'Chicharrón crocante', precio: 4000, emoji: '🥓' })
  ]);

  const MAX_CANTIDAD = 20;

  function obtenerCatalogo() {
    return CATALOGO;
  }

  function buscarProducto(id) {
    return CATALOGO.find((p) => p.id === id) || null;
  }

  function agregarAlCarrito(carrito, idProducto) {
    const producto = buscarProducto(idProducto);
    if (!producto) return carrito;
    const existente = carrito.find((item) => item.id === idProducto);
    if (!existente) return [...carrito, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    if (existente.cantidad >= MAX_CANTIDAD) return carrito;
    return carrito.map((item) => (item.id === idProducto ? { ...item, cantidad: item.cantidad + 1 } : item));
  }

  function quitarDelCarrito(carrito, idProducto) {
    return carrito
      .map((item) => (item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item))
      .filter((item) => item.cantidad > 0);
  }

  function calcularTotal(carrito) {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  function formatearPesos(valor) {
    return '$' + Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const api = { obtenerCatalogo, buscarProducto, agregarAlCarrito, quitarDelCarrito, calcularTotal, formatearPesos, MAX_CANTIDAD };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.App = global.App || {};
    global.App.PedidoModel = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
