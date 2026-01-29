# Roadmap de Luminaflex OS

Este documento describe la hoja de ruta para el desarrollo y evolución de **Luminaflex OS**, transformando el prototipo actual en un sistema ERP robusto y funcional.

## Fase 1: Fundamentos y Backend (Q1)
- [ ] **Arquitectura del Backend**: Establecer un servidor Node.js/Express o similar para manejar la lógica de negocio.
- [ ] **Base de Datos**: Implementar la conexión persistente con PostgreSQL usando el esquema definido (`schema.sql`).
- [ ] **API RESTful / GraphQL**: Desarrollar endpoints para las operaciones CRUD de cada módulo (Pedidos, Inventario, Producción, etc.).
- [ ] **Seguridad**: Implementar autenticación robusta (JWT/OAuth) y manejo de sesiones seguro.

## Fase 2: Integración del Core (Q2)
- [ ] **Gestión de Usuarios**: Conectar el sistema de Login y Roles (CEO, Admin, Colaborador, Cliente) con la base de datos.
- [ ] **Módulo de Pedidos**: Persistencia de órdenes, generación de IDs únicos y seguimiento de estado real.
- [ ] **Inventario en Tiempo Real**: Sincronización de stock con las ventas y alertas de bajo inventario.
- [ ] **Dashboard en Vivo**: Conectar las métricas del dashboard (KPIs) con datos reales de la base de datos.

## Fase 3: Operaciones y Producción (Q3)
- [ ] **Flujo de Producción**: Implementar el sistema Kanban para el seguimiento de etapas de producción con actualizaciones en tiempo real.
- [ ] **Punto de Venta (POS)**: Funcionalidad completa de caja, escaneo de productos y generación de tickets.
- [ ] **Facturación**: Generación de PDFs de facturas y trazados vectoriales reales (integración con librerías de generación de archivos).

## Fase 4: Automatización y Expansión (Q4)
- [ ] **Hub de Automatización**: Integración real con APIs de terceros (n8n, Google Drive, Chatwoot) para los flujos de trabajo visualizados.
- [ ] **Logística y Envíos**: Integración con APIs de paquetería para seguimiento de guías.
- [ ] **Soporte al Cliente**: Sistema de tickets o chat integrado funcional.
- [ ] **App Móvil / PWA**: Optimización completa para dispositivos móviles y funcionamiento offline.

## Fase 5: Inteligencia Artificial (Futuro)
- [ ] **Asistente IA**: Integración profunda con modelos LLM (como Gemini) para análisis predictivo de ventas e inventario.
- [ ] **Optimización de Recursos**: Algoritmos para optimizar la asignación de personal y materiales.
