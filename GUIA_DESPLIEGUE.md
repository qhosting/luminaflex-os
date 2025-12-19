
# LUMINAFLEX OS | CHECKLIST DE DESPLIEGUE INDUSTRIAL

Sigue estos pasos para garantizar un despliegue **Persistente** y **Seguro** en tu VPS con EasyPanel.

## 1. Configuración de Base de Datos (EasyPanel)
1. En EasyPanel, crea un nuevo servicio de tipo **PostgreSQL**.
2. Nombre del servicio: `db` (esto es vital para que la red interna lo reconozca).
3. En la pestaña **Volumes**, asegúrate de que `/var/lib/postgresql/data` esté mapeado a un volumen persistente.

## 2. Configuración de Aplicación
1. Crea un nuevo servicio de tipo **App**.
2. Selecciona **Docker Compose** como método de despliegue.
3. Pega el contenido del archivo `docker-compose.yml` generado.
4. Define las siguientes **Environment Variables**:
   - `API_KEY`: Tu llave de Google Gemini.
   - `POSTGRES_USER`: postgres
   - `POSTGRES_PASSWORD`: Tu_Password_Segura
   - `POSTGRES_DB`: lumina_os_db

## 3. Sincronización de Esquema (Primer Despliegue)
Una vez que los contenedores estén corriendo:
1. Entra a la consola del servicio `app`.
2. Ejecuta: `npm run db:sync`.
   - Este comando aplicará el archivo `schema.sql` a tu Postgres persistente.
   - Verás los logs de "Protocolo 741" confirmando el éxito.

## 4. Verificación de Persistencia
1. Crea un usuario o pedido en la aplicación.
2. Reinicia el servicio `db` desde EasyPanel.
3. Si al volver, los datos siguen ahí, tu **Volumen de Persistencia** está funcionando correctamente.

## 5. Notas de Seguridad
- El puerto 5432 de la DB **no debe estar expuesto al público**. Solo la red interna `lumina-network` debe tener acceso.
- La `DATABASE_URL` se construye automáticamente en el Compose usando el nombre del servicio `db`.
