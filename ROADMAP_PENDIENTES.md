# Pendientes de Implementación Técnica (Luminaflex OS)

Este listado detalla las tareas técnicas específicas pendientes para llevar el código actual de "prototipo de alta fidelidad" a "producción".

## General
- [ ] **Eliminar Mock Data**: Reemplazar todos los `useState` inicializados con datos estáticos (ej. `projects` en `ProductionManager`, `orders` en `OrdersManager`) por llamadas a API (`useEffect` + `fetch`/`axios`).
- [ ] **Health Check Real**: Reemplazar el `setTimeout` en `App.tsx` con un endpoint real de verificación de estado del backend/DB (`/api/health`).
- [ ] **Manejo de Errores Global**: Implementar un sistema de notificaciones (Toasts) conectado a las respuestas de error de la API.

## Autenticación (Auth)
- [ ] **Login**: Conectar `LoginPage.tsx` con endpoint `/api/auth/login`.
- [ ] **Persistencia**: Implementar manejo de tokens (JWT) en `localStorage` o Cookies seguras para mantener la sesión al recargar.
- [ ] **Protección de Rutas**: Crear componentes de ruta protegida para evitar acceso a vistas sin login.

## Módulo: Pedidos (OrdersManager)
- [ ] **CRUD de Órdenes**: Conectar creación, lectura, actualización y eliminación de órdenes a la DB.
- [ ] **Filtros Servidor**: Mover la lógica de filtrado (por estado, búsqueda) al backend para manejar grandes volúmenes de datos.
- [ ] **Generación de IDs**: Asegurar que los IDs (ej. `LX-ORD-101`) se generen secuencialmente o vía UUID en el backend.

## Módulo: Producción (ProductionManager)
- [ ] **Drag & Drop / Cambio de Estado**: Implementar lógica de backend para validar y persistir los cambios de etapa (`stage`).
- [ ] **WebSockets**: Implementar Socket.io para que los cambios de estado se reflejen instantáneamente en las pantallas de todos los usuarios (vital para producción).

## Módulo: Inventario (InventoryManager)
- [ ] **Sincronización**: Restar stock automáticamente cuando se completa una venta o se confirma una orden.
- [ ] **Carga de Imágenes**: Implementar subida real de imágenes de productos a un servicio de almacenamiento (AWS S3, Cloudinary, etc.).

## Módulo: Automatización (AutomationManager)
- [ ] **Conexión Real**: Los nodos visualizados (Chatwoot, Drive, n8n) son estáticos. Conectar con sus respectivas APIs para mostrar estado real (Online/Offline, Última ejecución).
- [ ] **Logs en Tiempo Real**: Conectar el panel de logs a un stream de logs del servidor o servicio de automatización.

## Módulo: Configuración (SettingsManager)
- [ ] **Persistencia de Configuración**: Guardar preferencias (Logo, Modo Mantenimiento) en la base de datos o archivo de configuración del servidor.

## Otros Componentes
- [ ] **POSManager**: Implementar lógica de carrito de compras, cálculo de impuestos y conexión con pasarela de pagos (si aplica) o registro de efectivo.
- [ ] **StaffManager**: Implementar ABM (Alta, Baja, Modificación) de usuarios y asignación de roles reales.
