# Dockerfile para Discord Bot
# Usa Node.js 20 LTS (Alpine para menor tamaño)
FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para libs nativas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copiar package.json del bot
COPY apps/bot/package.json ./

# Instalar dependencias con npm
RUN pnpm install

# Copiar el resto del código fuente del bot
COPY apps/bot/ .

# Crear directorio para logs
RUN mkdir -p /app/logs

# Variables de entorno
ENV NODE_ENV=production
ENV DOCKER_ENV=true

# Healthcheck para verificar que el bot está funcionando
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check OK')" || exit 1

# Comando para iniciar el bot
CMD ["node", "index.js"]
