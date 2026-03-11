# 🚀 Actualización: Sistema de Multi-Personaje (Slots) - v2.1

¡Gran noticia! Hemos implementado el tan esperado **Sistema de Doble Personaje**. Ahora podrás rolear dos vidas completamente diferentes con inventarios, dinero, propiedades e identidades separadas.

## 👥 Gestión de Personajes (Slots)

Cada usuario tiene acceso a **2 Slots** de personaje.

### Comandos Principales

- **`/personaje info`**:
  - Muestra el estado de tus slots.
  - Indica qué personaje estás usando actualmente.
  - **Ejemplo**:
    > 🟢 **Slot 1 (Principal)**: Juan Pérez
    > ⚪ **Slot 2 (Secundario)**: María González

- **`/personaje cambiar [slot]`**:
  - Cambia inmediatamente tu sesión de juego al slot seleccionado (1 o 2).
  - Tu economía, inventario y trabajos cambiarán automáticamente al del nuevo personaje.
  - **Uso**: `/personaje cambiar slot:2`

- **`/personaje registrar_slot`** (Solo Administradores):
  - Registra un segundo personaje para un usuario.
  - Requiere: Usuario, Nombre, Apellido, User de Roblox.

## 🔄 ¿Cómo funciona la Economía con Slots?

Todo el sistema de economía ahora es **independiente por personaje**:

1. **Dinero y Banco**: Si tienes $500 en el Slot 1 y cambias al Slot 2, tu balance será $0 (o lo que tenga ese personaje).
2. **Inventario**: Tus objetos no se comparten entre personajes.
3. **Propiedades**: Las casas compradas pertenecen al personaje que las pagó.
4. **Identidad**: Cada slot tiene su propia INE y Pasaporte.
5. **Trabajos Ilícitos**: Las plantaciones y ventas de drogas están vinculadas al personaje activo.

---

# 🚀 Actualización del Sistema de Economía MXRP 2.0

¡Hola Comunidad! Nos complace anunciar la **remasterización completa** de nuestro sistema de economía. Hemos migrado a una nueva infraestructura más robusta, segura y moderna.

A continuación, los detalles de la actualización:

## 🔄 Migración de Datos

✅ **Cuentas Bancarias**: Se han migrado exitosamente todos los saldos (Banco, Efectivo, Dinero Negro) de la base de datos antigua.
✅ **Inventarios**: Todos tus objetos comprados anteriormente se han transferido al nuevo sistema.
✅ **Tienda**: Los precios, stock y roles de los artículos de la tienda se mantienen intactos.

---

## ✨ Novedades y Mejoras

### 🏦 Sistema Bancario Moderno

- **`/balance`**: Nuevo diseño visual con "tarjeta", mostrando tu avatar y saldos formateados (ej. `$1,500,000`).
- **Transacciones Seguras**: Implementamos un sistema "atómico" que evita duplicación de dinero o errores en transferencias.
- **Interacción Rápida**: Comandos `/depositar`, `/retirar` y `/transferir` optimizados.

### 🛒 Tienda e Inventario

- **`/tienda`**:
  - Nuevo menú interactivo por categorías.
  - Precios formateados y claridad en el stock (∞ para infinito).
- **`/comprar`**:
  - **¡Nuevo! Autocompletado**: Ahora al escribir el nombre del ítem, el bot te sugerirá opciones de la tienda con su precio.
  - Asignación automática de roles al comprar ciertos artículos (armas, VIP, etc.).
- **`/inventario`**: Visualiza tus pertenencias de forma clara y organizada.

### 🤝 Sistema de Venta entre Usuarios (P2P)

¡La gran novedad! Ahora puedes vender objetos de tu inventario a otros jugadores de forma segura.

**Comando:** `/vender [item] [precio] [cantidad] [usuario]`

- **Autocompletado**: Selecciona fácilmente qué objeto de tu inventario quieres vender.
- **Seguridad**: El comprador recibe una oferta por MD con botones para **✅ Aceptar** o **✖️ Rechazar**.
- **Validación**: El sistema verifica automáticamente que el vendedor tenga el ítem y el comprador tenga el dinero antes de procesar la transacción.

### 🌿 Sistema Ilegal (Beta)

- **`/plantacion`**:
  - Gestión interactiva con botones para **Plantar**, **Regar** 💧 y **Cosechar** ✂️.
  - Crecimiento en tiempo real.
- **`/lavar dinero`**: Convierte tu dinero negro a dinero bancario (con comisión).

### 🏠 Sistema de Viviendas y Propiedades

Nuevo sistema para gestionar tus inmuebles dentro del servidor.

- **`/vivienda registrar`**: Registra tus propiedades compradas, paga impuestos y habilita su almacenamiento.
- **`/vivienda guardar/sacar`**: Usa tu casa como almacén secundario (hasta 30 objetos).
- **`/vivienda ver`**: Revisa tus propiedades, direcciones y niveles de almacenamiento con barras de progreso visuales.
  - **Ejemplo**: `[🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜] 40%`

### 🪪 Sistema de Identidad (INE y Pasaporte)

Hemos renovado completamente la gestión de documentos de identidad con gráficos mejorados y verificación.

- **`/tramitar`**: Inicia el proceso para obtener tu INE o Pasaporte.
  - **Subcomandos**: `ine`, `pasaporte`.
  - **Integración con Roblox**: Vincula tu cuenta de Roblox para que tu foto aparezca automáticamente en el documento.
  - **Generación Realista**: Las credenciales se generan dinámicamente con tus datos, CURP válida y firma.
- **`/revisar`**: Consulta los documentos de cualquier ciudadano.
  - **Subcomandos**: `ine [usuario]`, `pasaporte [usuario]`.
  - **Validación**: Muestra el documento oficial generado en alta calidad.

---

## 🛠️ Notas Técnicas

- Se han corregido errores de "Unknown Interaction" en ventas lentas.
- Todos los comandos ahora validan permisos y montos correctamente (no más números negativos).
- Optimización de respuestas para evitar spam en los canales (mensajes efímeros).

¡Esperamos que disfruten de esta nueva economía! Cualquier bug, por favor repórtenlo en el canal correspondiente.

**Atte. El Equipo de Desarrollo MXRP** 🛠️
