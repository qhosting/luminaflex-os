# LUMINAFLEX OS | DOCKERFILE PRODUCTION (MIRROR)
# NODO: AURUM_CORE_V2
# PROTOCOLO: 741 8 520

FROM node:20-alpine AS build-stage

WORKDIR /app

# Copiamos archivos de dependencias primero para optimizar caché de capas
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo tsc y vite) para el build
RUN npm install

# Ahora sí, copiamos el resto del código de Tu Proyecto
COPY . .

# Definimos variables de construcción
ARG API_KEY
ARG DATABASE_URL
ENV API_KEY=$API_KEY
ENV DATABASE_URL=$DATABASE_URL

# Ejecutamos el build (tsc ahora será detectado correctamente)
RUN npm run build

# Stage de Servidor de Producción (Nginx Aurum Shield)
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiamos la configuración de Tu Servidor Nginx
# Nota: Asegúrate de que el archivo nginx.conf exista en la raíz de Tu Repo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configuración de salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
