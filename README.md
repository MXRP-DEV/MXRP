# MXRP Monorepo

Monorepo basado en **pnpm workspaces + Turborepo** para alojar servicios del ecosistema MXRP.

## Estructura del monorepo

```text
.
├─ apps/
│  └─ bot/                # Bot de Discord
├─ package.json           # Scripts globales (Turbo)
├─ pnpm-workspace.yaml    # Configuración de workspaces
└─ turbo.json             # Pipeline de tareas
```

## Requisitos

- Node.js `>= 25.6.1`
- pnpm `10.x`

## Comandos principales

Ejecutar desde la raíz del repositorio:

- `pnpm dev`: inicia las apps en modo desarrollo mediante Turbo.
- `pnpm lint`: ejecuta linting en paquetes del monorepo.
- `pnpm format`: aplica Prettier en los archivos configurados.
- `pnpm format:check`: valida formato sin modificar archivos.

> Nota: no existe un script `check` literal en este repositorio. El equivalente recomendado para validación rápida es `pnpm lint && pnpm format:check`.

## Variables de entorno (`apps/bot/.env`)

Copia `apps/bot/.env.example` a `apps/bot/.env` y ajusta valores reales.

| Variable         | Obligatoria | Ejemplo                          | Descripción                                        |
| ---------------- | ----------- | -------------------------------- | -------------------------------------------------- |
| `DISCORD_TOKEN`  | Sí          | `MTIzNDU2...`                    | Token del bot de Discord para autenticación.       |
| `CLIENT_ID`      | Sí          | `123456789012345678`             | Application/Client ID del bot.                     |
| `MONGO_URI`      | Sí          | `mongodb://localhost:27017/mxrp` | URI de conexión a MongoDB.                         |
| `REDIS_URL`      | Sí          | `redis://localhost`              | URL base/protocolo de Redis.                       |
| `REDIS_PORT`     | Sí          | `6379`                           | Puerto del servidor Redis.                         |
| `REDIS_USERNAME` | No          | `default`                        | Usuario para Redis (si la instancia lo requiere).  |
| `REDIS_PASSWORD` | No          | `super-secret`                   | Password para Redis (si la instancia lo requiere). |

## Flujo recomendado de contribución

1. Crear rama nueva desde `main`:
   - `git checkout -b feat/mi-cambio`
2. Instalar dependencias:
   - `pnpm install`
3. Configurar entorno local:
   - `cp apps/bot/.env.example apps/bot/.env`
4. Desarrollar y probar en local:
   - `pnpm dev`
5. Verificar calidad antes de commit:
   - `pnpm lint`
   - `pnpm format:check`
6. Si hace falta, formatear automáticamente:
   - `pnpm format`
7. Hacer commit con mensaje claro y abrir PR.

## Troubleshooting

### Error de conexión a MongoDB

**Síntomas comunes**

- `MONGO_URI environment variable not set`
- `MongoServerSelectionError`
- timeouts al iniciar el bot

**Qué revisar**

1. Que `MONGO_URI` exista en `apps/bot/.env`.
2. Que el host/puerto sean correctos y MongoDB esté levantado.
3. Si usas credenciales, verificar usuario/password y permisos sobre la base.
4. Si usas Docker, validar red/hostname del contenedor.

### Error de conexión a Redis

**Síntomas comunes**

- `ECONNREFUSED`
- `NOAUTH Authentication required`
- `WRONGPASS invalid username-password pair`

**Qué revisar**

1. Que `REDIS_URL` y `REDIS_PORT` coincidan con tu instancia.
2. Si Redis requiere auth, definir `REDIS_USERNAME` y/o `REDIS_PASSWORD`.
3. Verificar firewall/puertos expuestos.
4. Confirmar que Redis esté disponible antes de iniciar el bot.
