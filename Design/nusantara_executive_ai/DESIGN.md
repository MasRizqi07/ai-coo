---
name: Nusantara Executive AI
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#e1bfff'
  on-tertiary: '#490080'
  tertiary-container: '#ce9bff'
  on-tertiary-container: '#6400ac'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-num:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
---

## Brand & Style
The design system powers an executive-grade AI Chief Operating Officer engineered specifically for Indonesian MSMEs (UMKM). It blends authoritative corporate intelligence with the agility required by modern business operators. The aesthetic evokes strategic command, high-precision clarity, and unwavering dependability, transforming complex business metrics, supply chains, and cash flows into actionable operational decisions.

The design movement combines **Minimalist High-Contrast** architecture with restrained **Dark Glassmorphism**. Dark slate canvases provide deep visual quiet, allowing high-contrast typography, hairline borders, and localized amber luminescence to signal strategic focus, executive insight, and operational momentum.

## Colors
The palette leverages deep, low-luminance slate baselines to minimize cognitive fatigue during prolonged operational monitoring, accented with high-chroma signals for instant triage.

### Palette Roles
- **Base Canvas (`#020617`):** The foundational substrate (Slate-950), grounding all full-bleed views.
- **Surface Elevation (`rgba(15, 23, 42, 0.65)` / `#0f172a`):** Deep Slate-900 layer for cards, analytical panels, and conversational cockpit modules.
- **Primary Amber (`#f59e0b` & `#fbbf24`):** The operational driver. Signifies autonomous AI actions, core interactive controls, actionable recommendations, and subtle ambient focal glows.
- **Border & Hairline Division (`rgba(30, 41, 59, 0.8)` / `#1e293b`):** Defines containment lines without visual clutter.
- **Typography & Content:**
  - High-Contrast Primary: `#f8fafc` (Slate-50) for core data points, KPIs, and executive titles.
  - Secondary Readability: `#cbd5e1` (Slate-300) for analytical body text and assistant transcripts.
  - Muted Metadata: `#64748b` (Slate-500) for timestamps, tabular headers, and footnotes.
- **Domain Metrics:**
  - **Growth / Cashflow (`#10b981`):** Positive revenue, margins, and operational health.
  - **Critical Alert / Stockout (`#f43f5e`):** Depleted inventory, late supplier fulfillments, and operational bottlenecks.
  - **VIP / Loyalty Tier (`#a855f7`):** High-margin client accounts and premier vendor channels.

## Typography
The system uses Geist for its crisp geometric legibility, balanced micro-details, and native monospace rendering alignment. 

All monetary representations for Indonesian Rupiah (e.g., `Rp 45.000.000`, `+12.4%`) must enforce `font-feature-settings: "tnum" 1` (tabular numerals) to ensure columns, financial cards, and operational dashboards align reliably across dynamic state changes. Display titles employ tight negative tracking to maintain punchy executive gravity, while labels and data meta-tags preserve slight positive tracking for scannability in dark mode.

## Layout & Spacing
A disciplined 4px base increment informs an 8px modular scale across all spatial boundaries.

- **Desktop Layout (1200px+):** Fluid 12-column grid structure with 24px gutters and 32px external margins. Accommodates dual-panel architecture: persistent operational command stream on the left, high-density metric canvas and supply-chain tables on the right.
- **Tablet Layout (768px – 1199px):** 8-column layout with 20px gutters. Collapses the conversational AI co-pilot into a dockable drawer.
- **Mobile Layout (320px – 767px):** 4-column layout with 16px gutters and 16px padding. Stacks analytical widgets vertically while pinning high-priority AI actions and stock alerts to bottom sheets.

## Elevation & Depth
Depth is constructed through subtle optical separation, translucent glass layering, and restrained radiance rather than heavy drop shadows:

- **Level 0 (Canvas Base):** Solid `#020617`. No elevation.
- **Level 1 (Surface Panels & Metric Cards):** `rgba(15, 23, 42, 0.65)` layered with `backdrop-filter: blur(12px) saturate(180%)`. Bordered by a 1px hairline stroke in `rgba(30, 41, 59, 0.8)`. Soft cast: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`.
- **Level 2 (Executive Drawers, Popovers & AI Menus):** `rgba(15, 23, 42, 0.85)` with `backdrop-filter: blur(16px)`. Border: `1px solid rgba(245, 158, 11, 0.25)`. Elevation shadow: `0 12px 32px -4px rgba(0, 0, 0, 0.7)`.
- **Executive Ambient Glow:** Featured AI recommendations and critical metric peaks leverage radial ambient halos: `radial-gradient(600px circle at var(--x, 50%) var(--y, 0%), rgba(245, 158, 11, 0.08), transparent 70%)`.

## Shapes
The shape language uses balanced rounded geometry to soften the technical density of the dark interface. 

- Primary cards, panels, and data surfaces utilize `rounded-xl` (1rem / 16px) and `rounded-2xl` (1.5rem / 24px).
- Internal form controls, buttons, status badges, and segmented toggles use `rounded-lg` (0.5rem / 8px) to establish a crisp hierarchy against larger container silhouettes.
- Notification badges and status dots maintain circular geometry (`rounded-full`).

## Components

### Buttons
- **Primary AI Action:** Solid background using `#f59e0b` texturing to `#fbbf24` on hover. Label in `#020617` (bold geometric sans). Subtle outer glow: `box-shadow: 0 0 16px -2px rgba(245, 158, 11, 0.45)`.
- **Secondary / Operational:** Background `rgba(30, 41, 59, 0.5)`, border `1px solid rgba(51, 65, 85, 0.8)`, text `#f8fafc`. Hover triggers `border-color: rgba(245, 158, 11, 0.5)` with text shifting to `#fbbf24`.
- **Ghost / Neutral:** Transparent canvas, text `#cbd5e1`, hover background `rgba(30, 41, 59, 0.4)`.

### Cards & Analytical Modules
Constructed with semi-transparent Slate-900 (`rgba(15, 23, 42, 0.65)`), 1px stroke (`rgba(30, 41, 59, 0.8)`), and `backdrop-filter: blur(12px)`. Metric cards feature top-aligned tabular values (`#f8fafc`) flanked by delta micro-badges (`#10b981` or `#f43f5e`).

### Chips & Semantic Badges
- Compact padding (`0.2rem 0.55rem`), `rounded-md` or `rounded-full`.
- **Revenue/Healthy:** Background `rgba(16, 185, 129, 0.12)`, text `#10b981`, border `1px solid rgba(16, 185, 129, 0.25)`.
- **Alert/Stock Out:** Background `rgba(244, 63, 94, 0.12)`, text `#f43f5e`, border `1px solid rgba(244, 63, 94, 0.3)`.
- **VIP Customer/Tier:** Background `rgba(168, 85, 247, 0.12)`, text `#a855f7`, border `1px solid rgba(168, 85, 247, 0.3)`.

### Input Fields & Search Bars
- Background `rgba(2, 6, 23, 0.65)`, border `1px solid #1e293b`, text `#f8fafc`.
- Focus state: border shifts to `#f59e0b` accompanied by a localized focus ring: `0 0 0 2px rgba(245, 158, 11, 0.2)`. Placeholder text formatted in muted `#64748b`.

### Checkboxes & Selection Controls
- Base: `18px x 18px` square, `rounded-md`, border `1px solid #334155`, background `rgba(15, 23, 42, 0.8)`.
- Checked: Background `#f59e0b`, border `#f59e0b`, glyph icon `#020617`.

### AI Operational Prompt Bar
A persistent executive input interface situated at the bottom of the viewport or docked within the command pane. Features full glassmorphic backing (`rgba(15, 23, 42, 0.8)`), border gradient highlighting with amber accent, and inline hotkey cues (`⌘K` / `Ctrl+K`) for rapid command delegation.