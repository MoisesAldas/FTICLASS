# Auditoría Full de Requerimientos vs. Estado Real (FITCLASS)

Este reporte contrasta los **30 Requerimientos Funcionales (RF)** solicitados con la implementación actual en **Next.js y Supabase**.

---

## ⚠️ Nota de Arquitectura (RNF04)
El documento original menciona **Angular y Firebase**. El proyecto actual está construido sobre **Next.js 15 y Supabase**. Hemos mapeado las funcionalidades para que sean equivalentes en este stack moderno.

---

## 1. Matriz de Cumplimiento de Requerimientos

| ID | Requerimiento | Estado | Observaciones Técnicas |
| :--- | :--- | :--- | :--- |
| **3.1** | **Autenticación y Registro** | | |
| RF01 | Registro de Usuarios | 🟡 Parcial | Usa Clerk, pero falta el formulario público de autoregistro. |

| RF02 | Estado 'Pendiente de Aprobación' | ❌ Pendiente | Actualmente el Admin crea al usuario ya activo. Falta flujo de espera. |
| RF03 | Notificar espera de aprobación | ❌ Pendiente | Requiere integración con Resend para el "Aviso de Recibido". |
| RF04 | Admin aprueba/rechaza cuentas | 🟡 Parcial | Existe botón "Desactivar" en Atletas, pero no un flujo de "Aprobación". |
| RF05 | Notificación por correo al aprobar | 🟢 Hecho | Implementado en `createAthleteAction` (Email de Bienvenida). |
| RF06 | Login con Email/Password | 🟢 Hecho | Gestionado nativamente por Clerk. |
| RF07 | Cambio de contraseña primer ingreso | ❌ Pendiente | Clerk lo permite, pero no está forzado por código. |
| RF08 | Manejo de Roles (Admin/User) | 🟢 Hecho | Implementado en `profiles` y `gym_members` (gym_owner, coach, athlete). |
| **3.2** | **Gestión de Usuarios** | | |
| RF09 | Crear usuarios manualmente | 🟢 Hecho | Funcional en `/dashboard/atletas/nuevo`. |
| RF10 | Almacenar datos personales | 🟢 Hecho | Tablas `profiles` y `athletes` con DNI, Teléfono, etc. |
| RF11 | Visualizar información personal | 🟡 Parcial | Existe la página `/dashboard/ajustes`, pero es limitada. |
| **3.3** | **Suscripciones** | | |
| RF12 | Estados: Activa, Inactiva, Pendiente | 🟢 Hecho | Tabla `athlete_memberships.status` (active, expired, pending). |
| RF13 | Registro de pagos con comprobante | 🟡 Parcial | Tabla `payments` tiene campo `notes`, pero falta `upload` de imagen. |
| RF14 | Ciclo Mensual | 🟢 Hecho | Configurado en `membership_plans`. |
| RF15 | Calcular días restantes | 🟢 Hecho | Lógica visual implementada en `MembresiasPage`. |
| RF16 | Usuario visualiza su estado | 🟢 Hecho | Implementado en la página de Membresías del dashboard. |
| RF17 | Rechazo si no hay comprobante | ❌ Pendiente | Falta lógica de validación en la acción de "Aprobar Pago". |
| **3.4** | **Notificaciones y Tareas** | | |
| RF18 | Tabla de solicitudes para Admin | ❌ Pendiente | Falta una vista de "Inbox" o "Solicitudes" para el Admin. |
| RF19 | Estados de solicitud | ❌ Pendiente | Requiere tabla de logs de solicitudes de registro. |
| RF20-22 | Gestión de comprobantes y notif. | ❌ Pendiente | No hay flujo de "Subir Pago -> Esperar Validación". |
| **3.5** | **Gestión de Clases** | | |
| RF23 | CRUD Clases (Admin) | 🟢 Hecho | Implementado en `/dashboard/clases/nuevo` y edición. |
| RF24 | Fecha, Hora, Coach, Cupos | 🟢 Hecho | Columnas presentes en `class_sessions`. |
| RF25 | Usuario visualiza clases | 🟢 Hecho | Vista de Agenda/Calendario funcional. |
| **3.6** | **Reservas** | | |
| RF26 | Usuario reserva clases | 🟡 Parcial | El botón existe, pero falta el `insert` real en `class_enrollments`. |
| RF27 | Limitar cupos | 🟡 Parcial | Existe la columna `max_capacity`, falta el check en la acción de reserva. |
| RF28 | Visualizar sus reservas | ❌ Pendiente | Falta una sección de "Mis Clases" para el atleta. |
| **3.7** | **Eventos** | | |
| RF29 | Admin crea eventos | 🟡 Parcial | Tabla `events` existe, falta el formulario en el Frontend. |
| RF30 | Mostrar eventos futuros | ❌ Pendiente | No hay UI para visualizar eventos. |

---

## 2. Análisis del Backend (Supabase)

Usando el **MCP de Supabase**, confirmamos que la DB está preparada para soportar lo que falta, pero requiere estos ajustes:

1.  **Tabla `payments`**: Agregar columna `receipt_url` (text) para guardar el link al comprobante en el Storage.
2.  **Tabla `profiles`**: Agregar columna `status` (text) con default 'pending_approval' para cumplir con RF02.
3.  **Realtime**: Activar para que el Admin vea las solicitudes llegar al instante.

---

## 3. Próximos Pasos Prioritarios

1.  **Implementar flujo RF02-RF05**: Modificar el registro para que los usuarios queden "pendientes" y crear la vista de aprobación para el Admin.
2.  **Activar Reservas Reales**: Conectar el botón de reserva con la tabla `class_enrollments`.
3.  **Subida de Archivos**: Configurar Supabase Storage para que los atletas suban fotos de sus comprobantes de transferencia.

---
**Generado por Antigravity AI**  
*Archivo: .doc\auditoria_full.md*
