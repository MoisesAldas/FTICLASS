# Roadmap del SaaS - FITCLASS 🏋️‍♂️

A continuación, se detalla el plan de acción estructurado en fases para llevar el proyecto desde su estado actual hasta un software completamente operativo y cobrable para cualquier Box de CrossFit o Gimnasio.

---

## 📍 FASE 1: Core de Cobranza y Gestión de Atletas
*El objetivo de esta fase es asegurar que el gimnasio pueda llevar el control de quién le debe dinero y qué plan tiene contratado cada persona.*

- [x] **Perfil del Atleta (Vista Detallada)**
  - Diseño de la interfaz donde se ve la información personal, plan activo, fecha de próximo cobro y estatus (Activo, Moroso, Pendiente).
- [x] **Asignación y Renovación de Membresías**
  - Modal/Flujo para activar una membresía a un usuario, fijar el día de corte y el precio.
  - Registro de pagos manual (efectivo, transferencia) y botones de renovación rápida.
- [x] **Panel de Estado de Cuenta (CRM)**
  - Tabla principal en `/dashboard/atletas` con filtros rápidos: "Ver morosos", "Ver próximos a vencer" (en 3 días).

## 📍 FASE 2: Control Operativo y Clases (Reservas y Asistencia)
*El objetivo de esta fase es controlar el aforo y la asistencia diaria a las clases, evitando sobrecupo.*

- [x] **Panel de Front-Desk (Asistencia Diaria)**
  - Vista rápida de las clases de hoy (por hora) con el profesor a cargo.
  - Funcionalidad de Check-in (marcar asistencia física).
- [x] **Sistema de Reservas (Cupos Limitados)**
  - Lógica visual para que un atleta se apunte a una clase (ej. "Cupo 12/15").
- [x] **Listas de Espera (Waitlists)**
  - Si una clase está llena, añadir a lista de espera. Si alguien cancela, entra el siguiente.

## 📍 FASE 3: Progreso y Comunidad (Pizarra Digital)
*El objetivo es fidelizar al usuario mediante gamificación y tracking de resultados (clave en CrossFit).*

- [x] **Digital Whiteboard (Leaderboard)**
  - Interfaz donde se muestra el WOD del día y los resultados (time, AMRAP) de todos los asistentes de ese día.
- [x] **Dashboard Personal del Atleta (PRs Tracker)**
  - Registro de Marcas Personales (Ej. Back Squat, Deadlift, Fran, etc.) y gráficos de evolución.

## 📍 FASE 4: Ingresos Extra y Análisis 
*Finalizando el producto con características de grado enterprise.*

- [ ] **Punto de Venta Expreso (POS)**
  - Pantalla para vender "Productos Rápidos" (Agua, bebidas deportivas, muñequeras).
- [ ] **Reportes Financieros (Analytics)**
  - Dashboard para el dueño: MRR (Rentabilidad mensual), Tasa de Retención vs. Abandono (Churn), Clases más populares.
- [ ] **Automatización de Mensajes**
  - Alertas/Notificaciones (WhatsApp o Correo) para avisar al atleta que "Faltan 2 días para tu pago".

---
> [!NOTE]  
> Utilizaremos este documento (`.doc/roadmap.md`) como punto de verdad. Conforme vayamos avanzando, yo iré marcando las casillas con una `[x]`. 

> [!IMPORTANT]
> **Revisión Requerida:** ¿Estás de acuerdo con el orden de estas Fases? Si es así, podemos arrancar de inmediato con la **Fase 1**.
