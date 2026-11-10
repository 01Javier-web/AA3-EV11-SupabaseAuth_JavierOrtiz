const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validarConfig, crearCliente } = require('../js/supabaseClient.js');

const CONFIG_OK = { SUPABASE_URL: 'https://abcd1234.supabase.co', SUPABASE_ANON_KEY: 'eyJhbGciOi.fake.key' };

test('detecta config ausente o con valores de ejemplo', () => {
  assert.match(validarConfig(undefined), /No se encontró/);
  assert.match(validarConfig({ SUPABASE_URL: 'https://TU-PROYECTO.supabase.co', SUPABASE_ANON_KEY: 'TU_ANON_KEY' }), /Falta configurar/);
  assert.match(validarConfig({ SUPABASE_URL: 'http://otra.com', SUPABASE_ANON_KEY: 'x' }), /formato/);
  assert.equal(validarConfig(CONFIG_OK), null);
});

test('no crea cliente si la librería no cargó', () => {
  assert.match(crearCliente(CONFIG_OK, undefined).error, /librería/);
});

test('crea el cliente con URL y llave recortadas', () => {
  let args;
  const lib = { createClient: (...a) => { args = a; return { ok: true }; } };
  const { client, error } = crearCliente({ SUPABASE_URL: ' https://abcd1234.supabase.co ', SUPABASE_ANON_KEY: ' k ' }, lib);
  assert.equal(error, null);
  assert.deepEqual(client, { ok: true });
  assert.equal(args[0], 'https://abcd1234.supabase.co');
  assert.equal(args[1], 'k');
});
