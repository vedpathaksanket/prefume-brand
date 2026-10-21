# Aura — Haute Parfumerie Digital Flagship

An immersive luxury e-commerce and brand showcase for **Aura**, an artisanal perfume maison. The experience combines a dark atmospheric canvas with luminous gold accents, liquid-glass surfaces, an interactive olfactory scent pyramid (top, heart, and base notes), multi-category fragrance exploration, and a custom sample kit curation suite.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed based on your preferences:
> - **Visual Identity**: Luxurious dark mood (`#08090C` / deep obsidian charcoal) accented with warm champagne gold (`#D4AF37` / `#E5C378`) and tactile liquid-glassmorphic cards.
> - **Fragrance Discovery Engine**: Interactive 3-tier Olfactory Scent Pyramid allowing visitors to deconstruct perfumes into Head (Top), Heart, and Base notes with accords and longevity ratings.
> - **Interactive Product & Discovery Suite**: Deep-dive Product Detail modal (variant bottle sizing: 30ml, 50ml, 100ml, notes breakdown, sillage indicator) plus a 3-vial bespoke Discovery Sample Kit Builder.

---

### 1. Overview & Core Concept

- **What It Does**: Presents Aura's luxury perfume collection across distinct olfactory families (Floral, Woody, Oriental, Fresh, Amber/Gourmand). Visitors can explore individual perfumes, interact with a visual scent pyramid that isolates top/heart/base notes, inspect full accords in an expansive modal, build a custom 3-scent discovery sample set, and manage an interactive shopping bag.
- **Target Audience**: Connoisseurs of artisanal perfumery, luxury fragrance collectors, and seekers of signature bespoke scents who appreciate fine olfactory notes, bottle craftsmanship, and ritualistic scent layering.
- **Key Value**: Bridges the sensory gap between digital browsing and physical scent discovery by visualizing scent pyramids, notes, intensity, and accords while providing low-friction sample kit curation.

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Color Palette**:
  - Dominant Canvas (60%): Deep obsidian navy/charcoal (`#07090E` to `#0B0F17`) providing an atmospheric nocturnal backdrop.
  - Structural Surfaces (30%): Liquid glass cards with subtle gold hairline rim highlights (`rgba(212, 175, 55, 0.15)`), dark smoke containers, and warm ivory body text.
  - Accent Touch (10%): Brushed champagne gold (`#D4AF37`, `#E6CA65`) applied strictly to active filter tabs, pyramid selection rings, primary CTAs, and price points.
- **Typography & Scale**:
  - Brand & Headlines: `Cormorant Garamond` / `Playfair Display` serif for timeless luxury editorial grandeur.
  - Body & Micro-labels: Clean geometric sans (`Plus Jakarta Sans` / `Inter`) with wide tracking on scent notes and tabular figures (`tabular-nums`) for currency and dimensions.
- **Zero-Pill & Metadata Discipline**: Unboxed metadata separated by quiet middots (`Floral · Eau de Parfum · 100ml`), eliminating candy badges.

#### Key User Flows & Sections
1. **Top Bar Contract**:
   - Zone 1: `Aura` wordmark in high-contrast luxury serif.
   - Zone 2: 4 single-line links (`Collection`, `Olfactory Pyramid`, `Discovery Kit`, `Maison`).
   - Zone 3: Interactive Cart trigger displaying live item count.
2. **Hero Campaign Section**:
   - High-impact editorial headline: *"Scents woven from midnight memories & golden dawn."*
   - Immediate entry into either the complete collection or the Interactive Scent Pyramid.
3. **Category Explorer & Fragrance Collection**:
   - Category filtering bar: `All`, `Woody & Smoky`, `Solar & Floral`, `Spiced Oriental`, `Aqua & Fresh`.
   - Rich product cards featuring studio bottle imagery, olfactory family, key notes kicker, and direct affordances ("Explore Notes" / "Quick Add").
4. **Interactive Olfactory Scent Pyramid**:
   - Interactive 3D/layered pyramid module:
     - **Top Notes (First 15-30 mins)**: High-volatile citrus, bergamot, pink pepper, cardamom.
     - **Heart Notes (2-4 hours)**: Rich florals, Turkish rose, orris root, leather, jasmine sambac.
     - **Base Notes (6-12+ hours)**: Sensual woods, aged oud, ambergris, Madagascar vanilla, musk.
   - Clicking a note dynamically filters perfumes containing that ingredient.
5. **Product Detail Modal (PDP)**:
   - Contiguous purchase module with bottle size selector (30ml, 50ml, 100ml), scent concentration (Extrait de Parfum vs Eau de Parfum), scent pyramid visualizer, sillage & longevity meters, and "Add to Bag".
6. **Curated Discovery Sample Kit Builder**:
   - Interactive 3-slot wooden/gold tray where users select 3 miniature 5ml vials to test at home before buying full bottles.
7. **Slide-Out Cart Drawer**:
   - Full order subtotal, itemized list, quantity adjustment, complimentary sample selector, and simulated checkout flow.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Interactive Olfactory Scent Pyramid**:
  - *Chosen Approach*: An interactive visual hierarchy where selecting a tier (Top, Heart, Base) highlights the active aromatics and shows how long each phase lingers on the skin.
  - *Why*: Perfume buying online is notoriously difficult without smelling. Visualizing evaporation curves and notes builds sensory anticipation and trust.
- **Decision 2: Bespoke 3-Vial Sample Kit Builder**:
  - *Chosen Approach*: A physical-style sample tray allowing direct drag/click allocation of three 5ml trial vials with complimentary voucher deduction towards full bottles.
  - *Why*: Industry standard for luxury niche fragrance brands (like Le Labo, Byredo, MFK), significantly lowering customer purchase hesitation.
- **Decision 3: Single-Page Architecture with Smooth Anchors & Modals**:
  - *Chosen Approach*: Fast, cohesive React SPA with rich interactive drawers and modals rather than slow multi-page routing.
  - *Why*: Preserves unbroken auditory and visual immersion, instant filtering, and responsive state synchronization.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AURA MAISON WEB APP                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Top Bar Navigation & Cart                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│  ┌─────────────────────────────┴────────────────────────────────────┐  │
│  │                     Hero Section & Brand Ethos                   │  │
│  └─────────────────────────────┬────────────────────────────────────┘  │
│                                │                                       │
│  ┌─────────────────────────────┴────────────────────────────────────┐  │
│  │              Category Filter (Woody · Floral · Oriental · Fresh) │  │
│  └─────────────────────────────┬────────────────────────────────────┘  │
│                                │                                       │
│        ┌───────────────────────┴───────────────────────┐               │
│        ▼                                               ▼               │
│  ┌───────────────────────────┐           ┌───────────────────────────┐ │
│  │   Product Catalog Grid    │           │ Olfactory Pyramid Engine  │ │
│  │  (Bottle shots, notes,    │◄─────────►│ (Interactive Top, Heart,  │ │
│  │   sizing, quick view)     │           │  Base notes breakdown)    │ │
│  └─────────────┬─────────────┘           └─────────────┬─────────────┘ │
│                │                                       │               │
│                ▼                                       ▼               │
│  ┌───────────────────────────┐           ┌───────────────────────────┐ │
│  │    Product Detail Modal   │           │ Discovery Kit Builder     │ │
│  │ (Sizes, accords, sillage) │           │ (3-Vial customizable set) │ │
│  └─────────────┬─────────────┘           └─────────────┬─────────────┘ │
│                │                                       │               │
│                └───────────────────┬───────────────────┘               │
│                                    ▼                                   │
│                      ┌───────────────────────────┐                     │
│                      │   Cart & Checkout Drawer  │                     │
│                      │  (Subtotal, items, toast) │                     │
│                      └───────────────────────────┘                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### Fragrance Catalog State & Data Structure
- `perfumes`: Array of rich fragrance objects:
  - `id`, `name`, `tagline`, `category` (`Woody`, `Floral`, `Oriental`, `Fresh`, `Amber`)
  - `price` (by size: 30ml, 50ml, 100ml)
  - `concentration`: Extrait de Parfum (30% oil) / Eau de Parfum (20% oil)
  - `pyramid`:
    - `top`: Array of strings (e.g. `Bergamot`, `Pink Pepper`, `Saffron`)
    - `heart`: Array of strings (e.g. `Damask Rose`, `Orris`, `Black Tea`)
    - `base`: Array of strings (e.g. `Smoked Oud`, `Vetiver`, `Benzoin`)
  - `accords`: Array of percentage accords (`Smoky 85%`, `Woody 70%`, `Floral 40%`)
  - `mood`, `sillage` (Intimate / Moderate / Enveloping), `longevity` (`8 - 12h`)
  - `image`: Photorealistic studio perfume bottle asset

#### Visual Assets Strategy
- Invoking `generate_image` in a single parallel batch for:
  - Hero campaign perfume bottle on obsidian travertine pedestal with golden light reflections.
  - 4 distinct luxury fragrance bottle imagery (Obsidian Oud, Celestial Rose, Amber Velvet, Citrus Ether).
  - Discovery sample kit box presentation.
