---
name: fitclass-design-system
description: Sistema de diseño FITCLASS "Expert UI-UX". Consultar SIEMPRE antes de crear o modificar cualquier interfaz. Prohíbe mayúsculas forzadas, itálicas y difuminados para un estándar de alta fidelidad y rendimiento.
---

# FITCLASS Design System — Expert UI-UX (High Fidelity)

Este documento es la **fuente única de verdad** para la interfaz de FITCLASS. Define una estética madura, técnica y de alto rendimiento, priorizando la legibilidad extrema y la sofisticación visual.

---

## 1. Principios de Diseño (Core Principles)

- **Expert UI-UX**: NO a las mayúsculas forzadas (`uppercase`). NO a las itálicas decorativas.
- **Pureza Visual**: Sin difuminados (`backdrop-blur`). Superficies sólidas, oscuras y elegantes.
- **Legibilidad**: Uso estricto de *Sentence Case* (Mayúscula inicial) para escaneo rápido.
- **Radios**: Grandes y suaves (`rounded-2xl` a `rounded-[32px]`) para un look moderno y prémium.
- **Densidad**: Limpia y espaciada, evitando la saturación de información.
- **Elite Layout**: Uso de espaciado `gap-10` y herencia de padding global para una interfaz de "Monitor Total".

---

## 2. Topología Tipográfica (The Expert Scale)

La jerarquía visual se define por tamaño y peso, no por transformación de texto.

| Nivel | Clase Tailwind | Peso | Uso |
|-------|----------------|------|-----|
| **H1 (Hero)** | `text-4xl` | `font-bold` | Títulos de página principales |
| **H2 (Sección)**| `text-2xl` | `font-bold` | Títulos de secciones o modales |
| **H3 (Sub)** | `text-lg` | `font-bold` | Subtítulos de grupo |
| **Card Label** | `text-sm` | `font-semibold`| Etiquetas de KPI o cabeceras de tabla |
| **Cuerpo/Valores**| `text-base`| `font-bold` | Valores principales (en blanco) |
| **Metadatos** | `text-xs` | `font-medium`| Descripciones, links secundarios |
| **Micro-copy** | `text-[11px]` | `font-medium`| Errores o texto complementario |

> [!IMPORTANT]
> **Prohibido**: `italic`, `uppercase` (excepto en siglas/IDs), `font-black`.
> *Excepción única: El nombre de marca **FITCLASS** (Logo/Sidebar) puede usar `italic`, `uppercase` y `font-black` para mantener su identidad visual.*

---

## 3. Paleta de Colores Expert

| Token | Valor | Uso |
|-------|-------|-----|
| **Background** | `#000000` | Negro puro (Fitclass Total Black) |
| **Surface** | `#131315` | Superficie de cards y widgets sólida |
| **Border** | `white/5` | Bordes ultra-delgados y sutiles |
| **Primary** | `#5e5ce6` | Indigo Core (Acento principal) |
| **Muted** | `#a1a1aa` | Zinc 400 (Texto secundario) |

---

## 4. Componentes Reutilizables (The Expert Library)

Utilizar siempre estos componentes para garantizar consistencia.

- **ActionCard**: Primitivo central de diseño en grillas y dashboards (`apps/web/components/shared/action-card.tsx`).
    - **Geometría Primaria**: Usar obligatoriamente `<ActionCardAvatar>` para el anclaje visual (iconos) y `<ActionCardTags>` para píldoras estandarizadas de categoría/horario.
    - **Métricas Cuantificables**: Implementar `<ActionCardProgress>` en lugar de crudos contadores de texto plano para representar aforos o capacidades.
    - **Organización Interna (Job Chip Philosophy)**: Evitar muros de texto crudo. Empaquetar tuplas de información (como WOD/Coach) en módulos `bg-[#131315]/80` y trazar divisiones superiores para bloques descriptivos (Specs. Técnicas).
    - **Bottom Balance**: El pie de tarjeta (`ActionCardFooter`) impone una distribución de botones de acción 50/50 (`flex-1`, `h-11`) produciendo bloques sólidos que eliminan los vacíos asimétricos.
- **ActionButton**: El disparador principal de acciones en todo el sistema (`apps/web/components/shared/action-button.tsx`). Usa la variante `fitclass-primary` con sombra Indigo Core.
- **DatePicker**: Selector de fecha prémium basado en Shadcn Popover + Calendar (`apps/web/components/shared/date-picker.tsx`). Reemplaza `input[type="date"]`.
- **SelectPrimitive**: `apps/web/components/shared/select-primitive.tsx` (Reemplaza los selectores nativos con un sistema de Popover basado en Zinc-950).
- **ModalPrimitive**: `apps/web/components/shared/modal-primitive.tsx` (Estandariza todos los diálogos).
    - **Regla Global**: SE DEBE USAR este componente para cada nuevo diálogo en la administración.
    - **Look Elite**: Sin itálicas en el título, tipografía `font-black` y `uppercase`, bordes `32px`.
    - **Acciones**: Usar obligatoriamente `ActionButton` como disparador y como botón de confirmación dentro del formulario.
- **Buttons (`fitclass-*`)**: Variantes en `Button.tsx`. Sin mayúsculas, pesos `bold/semibold`.
- **Switch**: Toggle prémium (`@workspace/ui/components/switch`). Reemplaza checkboxes tradicionales.
- **KPICard**: Estructura sólida para métricas (Etiqueta arriba, valor grande abajo).
- **Tablas**: Estilo limpio, sin bordes entre filas, cabeceras en gris suave.
- **Inputs**: Fondos `zinc-900/50`, radios `rounded-2xl`, altura `h-11`.

---

## 6. Arquitectura de Dashboards (Elite Layout)

Para mantener la coherencia con el dashboard de **Atletas**, todas las páginas nuevas deben seguir esta estructura:

- **Padding Global**: NO aplicar padding (`p-6`, etc.) en el componente de la página. El `SidebarInset` ya provee el espaciado necesario.
- **Cabecera (Page Header)**:
    - **Título**: `text-4xl font-bold tracking-tight text-white`. (Sentence Case: "Atletas", "Ajustes").
    - **Iconografía**: NO usar iconos en el título principal para mantener un look limpio y profesional.
    - **Subtítulo**: `text-zinc-500 text-sm font-medium max-w-xl`.
    - **Acciones**: Botones de acción (`h-11`, `px-8`) alineados a la derecha en `md:flex-row`.
- **Espaciado Vertical**: Usar `flex flex-col gap-10` como contenedor raíz para separar cabecera, tablas y KPIs.

---

## 7. Navegación Vertical (Complex Views)

Para vistas de configuración o perfiles detallados:

- **Grid Layout**: `grid md:grid-cols-[280px_1fr] gap-10`.
- **Menú Lateral**:
    - **Botones**: `px-5 py-4 rounded-2xl font-bold text-sm`.
    - **Estado Activo**: Fondo `bg-white/5` + Borde `ring-1 ring-white/10` + Indicador de punto indigo (`size-2`) a la derecha con sombra.
    - **Iconos**: `size-5` (Zinc 600 inactivo / Indigo 500 activo).
- **Separador de Contenido**: El área de contenido debe tener un borde izquierdo `md:border-l border-white/5` y un padding de respiro `md:pl-12`.

---

## 8. Checklist Final de Calidad

- [x] ¿El texto usa **Sentence Case** exclusivamente?
- [x] ¿Se eliminaron todos los efectos de **Blur/Difuminado**?
- [x] ¿Se hereda el padding del layout global (sin duplicar `p-6`)?
- [x] ¿El título de página es `text-4xl font-bold tracking-tight`?
- [x] ¿Se respetan los radios de curvatura (`2xl/4xl`)?
- [x] ¿La tipografía sigue la **Topología Expert**?
- [x] ¿Se utilizan los componentes prémium (**Switch**, **Buttons**)?