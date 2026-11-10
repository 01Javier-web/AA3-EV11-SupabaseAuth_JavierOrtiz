const { test } = require('node:test');
const assert = require('node:assert/strict');
const AuthModel = require('../js/models/AuthModel.js');

function clienteFalso(respuestas = {}) {
  const llamadas = [];
  return {
    llamadas,
    auth: {
      signInWithPassword: async (cred) => { llamadas.push(['signIn', cred]); return respuestas.signIn; },
      signOut: async () => { llamadas.push(['signOut']); return respuestas.signOut || { error: null }; },
      getSession: async () => respuestas.getSession,
      onAuthStateChange: (cb) => { cb('SIGNED_IN', { user: {} }); return { data: { subscription: { unsubscribe: () => llamadas.push(['unsub']) } } }; }
    }
  };
}

test('rechaza crear el modelo sin cliente', () => {
  assert.throws(() => new AuthModel(null), /necesita un cliente/);
});

test('valida correo y contraseña antes de llamar a Supabase', async () => {
  const cliente = clienteFalso();
  const modelo = new AuthModel(cliente);
  assert.equal((await modelo.iniciarSesion('no-es-correo', '123456')).error, 'Escribe un correo válido.');
  assert.match((await modelo.iniciarSesion('a@b.co', '123')).error, /al menos 6/);
  assert.equal(cliente.llamadas.length, 0);
});

test('inicia sesión con credenciales válidas y recorta el correo', async () => {
  const usuario = { email: 'demo@mekatos.co' };
  const cliente = clienteFalso({ signIn: { data: { user: usuario }, error: null } });
  const resultado = await new AuthModel(cliente).iniciarSesion('  demo@mekatos.co ', 'secreto1');
  assert.deepEqual(resultado, { usuario, error: null });
  assert.deepEqual(cliente.llamadas[0], ['signIn', { email: 'demo@mekatos.co', password: 'secreto1' }]);
});

test('traduce el error de credenciales inválidas', async () => {
  const cliente = clienteFalso({ signIn: { data: {}, error: { message: 'Invalid login credentials' } } });
  const { usuario, error } = await new AuthModel(cliente).iniciarSesion('demo@mekatos.co', 'malaclave');
  assert.equal(usuario, null);
  assert.equal(error, 'Correo o contraseña incorrectos.');
});

test('maneja errores de red lanzados por el cliente', async () => {
  const cliente = clienteFalso();
  cliente.auth.signInWithPassword = async () => { throw new Error('Failed to fetch'); };
  const { error } = await new AuthModel(cliente).iniciarSesion('demo@mekatos.co', 'secreto1');
  assert.match(error, /No hay conexión/);
});

test('obtiene la sesión actual o null', async () => {
  const sesion = { user: { email: 'demo@mekatos.co' } };
  assert.deepEqual(await new AuthModel(clienteFalso({ getSession: { data: { session: sesion }, error: null } })).obtenerSesion(), { sesion, error: null });
  assert.equal((await new AuthModel(clienteFalso({ getSession: { data: { session: null }, error: null } })).obtenerSesion()).sesion, null);
});

test('cierra sesión y permite desuscribirse de cambios', async () => {
  const cliente = clienteFalso();
  const modelo = new AuthModel(cliente);
  assert.deepEqual(await modelo.cerrarSesion(), { error: null });
  const eventos = [];
  const desuscribir = modelo.alCambiarSesion((evento) => eventos.push(evento));
  desuscribir();
  assert.deepEqual(eventos, ['SIGNED_IN']);
  assert.deepEqual(cliente.llamadas.map((l) => l[0]), ['signOut', 'unsub']);
});

test('traducirError devuelve mensaje genérico para errores desconocidos', () => {
  assert.equal(AuthModel.traducirError(null), null);
  assert.equal(AuthModel.traducirError({ message: 'Algo raro' }), 'Error de autenticación: Algo raro');
});
