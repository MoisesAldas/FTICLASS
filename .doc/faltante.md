# Auditoría Técnica de Faltantes - FITCLASS (Estado Real vs. UI)

Tras una inspección profunda de la base de datos **Supabase (ljxlritlazwcxpnxbbcg)** y del código fuente, este es el reporte de lo que actualmente falta para tener un sistema funcional y escalable.

---

## 1. Brecha de Implementación: "Mock Data" (Prioridad 1)

> [!WARNING]
> La mayoría de las interfaces actuales muestran datos falsos (`mockData`). Aunque el diseño es excelente, no están conectadas a las tablas que inspeccioné en Supabase.

### Módulos que requieren Conectividad Real Inmediata:
- **KPIs Financieros** (`PaymentKpis`): Actualmente usa constantes `$45,280.00`. Debe consultar la tabla `public.payments`.
- **Listado de Atletas** (`AthleteTable`): Debe consultar `public.athletes` con un Join a `public.profiles`.
- **Membresías de Usuarios** (`MembresiasPage`): Muestra planes fijos; debe leer de `public.athlete_memberships`.
- **Historial de Pagos**: La tabla muestra datos de ejemplo; debe leer de `public.payments`.

---

## 2. Auditoría de Base de Datos (MCP Inspection)

La base de datos tiene una estructura sólida, pero hemos detectado las siguientes **ausencias críticas** en el esquema para soportar el flujo de negocio completo:

### A. Lógica de "Lista de Espera" (Waitlists)
- **Estado Actual**: La tabla `class_enrollments` solo tiene estados básicos.
- **Falta**: Una columna `priority` o una tabla `class_waitlists` para manejar cuando el cupo (`max_capacity`) de una clase se llena.

### B. Módulo de Inventario y Ventas (POS)
- **Estado Actual**: Existe la tabla `services`, pero es para servicios intangibles (clases).
- **Falta**: Una tabla `products` (stock, precio costo, precio venta) y `sale_items` para cuando un atleta compra agua, suplementos o accesorios en el box.

### C. Configuración Avanzada de Horarios
- **Estado Actual**: Existe `class_schedules`, pero no maneja "Excepciones" (Días festivos, cierres temporales, cambios de coach de último minuto).
- **Falta**: Una tabla `schedule_exceptions` o lógica de "Overriding".

---

## 3. Funciones de Servidor Faltantes (Edge Functions)

En Supabase faltan las "automatizaciones" que disparan acciones sin intervención humana:

1. **Calculador de Vencimientos (Cron-Job)**: Lógica para cambiar automáticamente el `status` de una membresía de `active` a `expired` cuando llega la `end_date`.
2. **Generador de Invoices**: Aunque la tabla `invoices` existe, falta la función que convierta un `payment` exitoso en un PDF real y lo suba a Supabase Storage.
3. **Notificaciones de Cobro**: Integración con un servicio de mensajería (Email/WhatsApp) para avisar al atleta antes de que venza su plan.

---

## 4. Seguridad y RLS (Row Level Security)

> [!IMPORTANT]
> Al ser un SaaS, la seguridad es crítica.
> - **Verificación de Multi-tenancy**: Debemos asegurar que **todas** las políticas RLS usen `get_my_gym_id()` para filtrar. Actualmente, algunas tablas podrían estar expuestas si no se refinan las políticas de `SELECT` y `UPDATE`.

---

## 5. Próximos Pasos Técnicos Sugeridos

| Tarea | Impacto | Esfuerzo |
| :--- | :--- | :--- |
| **Migración a React Query** | Muy Alto | Medio |
| **Persistencia de Check-ins** | Alto | Bajo |
| **Logic de Facturación Real** | Medio | Alto |
| **Portal de Atleta (MVP)** | Alto | Alto |

---
**Generado por Antigravity AI**  
*Fecha: 2026-04-02*
