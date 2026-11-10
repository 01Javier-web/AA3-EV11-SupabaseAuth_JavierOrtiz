const { test } = require('node:test');
const assert = require('node:assert/strict');
const Pedido = require('../js/models/PedidoModel.js');

test('el catálogo tiene productos con precio positivo', () => {
  const catalogo = Pedido.obtenerCatalogo();
  assert.ok(catalogo.length > 0);
  catalogo.forEach((p) => assert.ok(p.precio > 0));
});

test('agregar no modifica el carrito original', () => {
  const vacio = [];
  const conUno = Pedido.agregarAlCarrito(vacio, 'emp-01');
  assert.equal(vacio.length, 0);
  assert.equal(conUno.length, 1);
  const conDos = Pedido.agregarAlCarrito(conUno, 'emp-01');
  assert.equal(conUno[0].cantidad, 1);
  assert.equal(conDos[0].cantidad, 2);
});

test('ignora productos inexistentes', () => {
  const carrito = [];
  assert.equal(Pedido.agregarAlCarrito(carrito, 'no-existe'), carrito);
});

test('respeta la cantidad máxima por producto', () => {
  let carrito = [];
  for (let i = 0; i < Pedido.MAX_CANTIDAD + 5; i++) carrito = Pedido.agregarAlCarrito(carrito, 'gas-01');
  assert.equal(carrito[0].cantidad, Pedido.MAX_CANTIDAD);
});

test('quitar reduce la cantidad y elimina en cero', () => {
  let carrito = Pedido.agregarAlCarrito(Pedido.agregarAlCarrito([], 'ach-01'), 'ach-01');
  carrito = Pedido.quitarDelCarrito(carrito, 'ach-01');
  assert.equal(carrito[0].cantidad, 1);
  carrito = Pedido.quitarDelCarrito(carrito, 'ach-01');
  assert.deepEqual(carrito, []);
});

test('calcula el total y lo formatea en pesos', () => {
  let carrito = Pedido.agregarAlCarrito([], 'emp-01'); // 2500
  carrito = Pedido.agregarAlCarrito(carrito, 'emp-01'); // 5000
  carrito = Pedido.agregarAlCarrito(carrito, 'gas-01'); // 8500
  assert.equal(Pedido.calcularTotal(carrito), 8500);
  assert.equal(Pedido.formatearPesos(8500), '$8.500');
  assert.equal(Pedido.formatearPesos(1250000), '$1.250.000');
  assert.equal(Pedido.buscarProducto('zzz'), null);
});
