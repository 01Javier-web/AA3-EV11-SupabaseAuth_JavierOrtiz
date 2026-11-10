# AA3-EV11 · Integración de autenticación de usuarios con Supabase Auth

**Mekatos Pedidos**: sistema de pedidos de mecato colombiano con inicio de sesión mediante **Supabase Auth**, organizado con el patrón **MVC** en HTML, CSS y JavaScript.

- Aprendiz: Javier Ortiz
- Rama de entrega: `DEV_JO`

## Estructura MVC

```
├── index.html                 Vista de login (pública)
├── pedidos.html               Panel de pedidos (protegido por sesión)
├── css/styles.css
├── js/
│   ├── config.js              Credenciales de Supabase (URL + anon key)
│   ├── supabaseClient.js      Crea el cliente y valida la configuración
│   ├── app.js                 Punto de entrada: arranca el controlador según la página
│   ├── models/
│   │   ├── AuthModel.js       Login, logout y sesión con Supabase Auth
│   │   └── PedidoModel.js     Catálogo y carrito (inmutable)
│   ├── views/
│   │   ├── LoginView.js
│   │   └── PedidosView.js
│   └── controllers/
│       ├── LoginController.js
│       └── PedidosController.js
└── tests/                     Pruebas unitarias (node --test)
```

## Flujo de autenticación

1. `index.html` → `LoginController` revisa si ya hay sesión; si existe, redirige a `pedidos.html`.
2. El usuario escribe correo y contraseña → `AuthModel.iniciarSesion()` llama a `supabase.auth.signInWithPassword()`.
3. Si es correcto, se redirige a `pedidos.html`. Si no, se muestra el error traducido.
4. `pedidos.html` → `PedidosController` llama a `getSession()`; **sin sesión redirige al login**.
5. "Cerrar sesión" → `supabase.auth.signOut()` y regreso al login.

## Configuración de Supabase

1. Crear cuenta en <https://supabase.com> y crear un proyecto.
2. **Authentication → Users → Add user → Create new user** (correo + contraseña, marcar *Auto Confirm User*).
3. **Authentication → Sign In / Providers → Email**: desactivar **Confirm email**.
4. Copiar credenciales:
   - **Project URL**: Configuración → Data API.
   - **anon key**: Configuración → API Keys → *View legacy API keys* → `anon` `public`.
5. Pegarlas en `js/config.js`:

```js
window.APP_CONFIG = Object.freeze({
  SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOi...'
});
```

> Solo se usa la llave **anon** (pública). Nunca subir la llave `service_role`.

## Ejecutar

Abrir `index.html` en el navegador (doble clic o Live Server), o:

```bash
npm start
```

y entrar a <http://localhost:5500>.

## Pruebas

```bash
npm test
```
