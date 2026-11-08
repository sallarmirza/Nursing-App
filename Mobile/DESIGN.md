# Design System — Digital Nursing Assistant (DNA)

**Product context:** Clinical tool for nurses. Used in hospital environments under time pressure.  
**Audience:** Nurses managing multiple patients, charting vitals, writing handover notes.  
**Design job:** Speed, trust, legibility. Every screen must be scannable in under 2 seconds.

---

## Identity

The visual language is calm and professional — not cold. The off-white backgrounds (`#F4F3F3` / `#F3EFEF`) have a very slight warmth that keeps the UI from reading clinical-sterile. The `#1D9BF0` primary is deliberate: familiar, trustworthy, action-oriented without evoking emergency.

The violet accent (`#A78BFA`) is the one personality note — used exclusively for avatars/person icons, never for actions or status.

---

## Color Tokens

Source of truth: `src/theme/colors.ts`

> ⚠️  `src/theme/token.ts` has different values (sky-blue palette) and is **not used** anywhere in the app. Do not reference it.

### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| `colors.background` | `#F4F3F3` | Main tab screens (dashboard, login, signup) |
| `colors.backgroundAlt` | `#F3EFEF` | Secondary screens (patients, notes, calculators) |
| `colors.white` | `#FFFFFF` | Cards, inputs, header bar |

### Text

| Token | Hex | Usage |
|---|---|---|
| `colors.textPrimary` | `#000000` | Body text, default text |
| `colors.textHeading` | `#1F2937` | Card titles, section headers |
| `colors.textSecondary` | `#6B7280` | Subtitles, meta text |
| `colors.textMuted` | `#8E8D8A` | Placeholders on light bg, divider text |
| `colors.textFaint` | `#9CA3AF` | Least prominent meta |
| `colors.placeholder` | `#C4B5FD` | Input placeholder text (lavender) |
| `colors.inputValue` | `#8B5CF6` | Filled input text on calculator screens |

### Brand / Actions

| Token | Hex | Usage |
|---|---|---|
| `colors.primary` | `#1D9BF0` | Primary buttons, active states, links, filter pills |
| `colors.primaryAlt` | `#2089DC` | Auth screen buttons and links |
| `colors.accent` | `#A78BFA` | Avatar icon tint — person icon only |
| `colors.accentBg` | `#EDE9FE` | Avatar circle background |

### Status

| Token | Hex | Usage |
|---|---|---|
| `colors.success` | `#16A34A` | Checkmarks, "Completed" badge text |
| `colors.successBg` | `#DCFCE7` | "Completed" badge background |
| `colors.successAlt` | `#10B981` | Modal checkmark circle |
| `colors.danger` | `#DC2626` | Delete actions, critical errors |
| `colors.dangerAlt` | `#EF4444` | Inline error text, "Draft" badge text |
| `colors.warning` | `#84CC16` | Low-stock / IV bag low status |

### Borders / Dividers

| Token | Hex | Usage |
|---|---|---|
| `colors.border` | `#E5E7EB` | Card borders, input outlines, dividers |
| `colors.borderLight` | `#F3F4F6` | Subtle separators inside cards |
| `colors.divider` | `#D0D0D0` | Horizontal divider lines (auth screens) |

### Misc

| Token | Hex | Usage |
|---|---|---|
| `colors.badgeNeutralBg` | `#E5E7EB` | Neutral / "Draft" badge background |
| `colors.overlay` | `rgba(0,0,0,0.4)` | Modal backdrops |

---

## Typography

No custom fonts loaded — uses the system font stack (San Francisco on iOS, Roboto on Android). This is intentional for a clinical tool: system fonts load instantly and are maximally legible.

### Scale (as used in practice)

| Role | Size | Weight | Color token |
|---|---|---|---|
| Screen greeting / page title | 22–28px | 600–700 | `textPrimary` |
| Card title / section heading | 15–17px | 600–700 | `textHeading` |
| Body / list item | 14–15px | 400 | `textPrimary` |
| Meta / subtitle | 13px | 400 | `textSecondary` |
| Badge / label | 11px | 600 | varies by tone |
| Small detail | 12–13px | 400 | `textMuted` |

### Rules
- Sentence case everywhere. No ALL CAPS labels.
- Button labels: active verb, what happens on press ("Save", "Calculate Dosage", "Delete Patient").
- Errors: specific — say what went wrong and what to do. Never "Something went wrong."
- Empty states: an invitation to act, not a dead end.

---

## Spacing & Layout

Base unit: **4px**. All spacing is multiples: 4, 8, 12, 16, 20, 24.

Screen-level padding: `px-5` (20px) horizontal, `pt-4`/`pt-5` (16–20px) top.

Card internal padding: `p-4` (16px) or `p-5` (20px).

Gap between cards/sections: `gap-3` (12px) or `gap-4` (16px).

Form field gap: `gap-4` (16px) between fields; `gap-[6px]` between label and input.

---

## Component Specifications

### `PrimaryButton`
- Height: 50px
- Border radius: 8px
- Font: 16px, weight 600
- Filled: `colors.primary` bg, white text
- Outline: white bg, `colors.primary` border and text
- Disabled: `opacity: 0.5`
- Loading: pass `loading={true}` — shows spinner, hides label
- Override bg color (e.g. delete): pass `style={{ backgroundColor: colors.danger }}`

### `FormInput`
- Height: 48px
- Background: `colors.white`
- Border radius: 8px
- Padding horizontal: 16px
- Font: 15px
- Placeholder color: `colors.placeholder` (lavender `#C4B5FD`)
- `filled` prop: switches text color to `colors.inputValue` (violet — for calculator result display)

### `ScreenHeader`
- Height: 56px
- Background: `colors.white`
- Bottom border: 1px `colors.border`
- Title: 16px, weight 700, centered
- Side slots: 32px wide (left = back button, right = optional action/element)
- Use `showBack={false}` on tab root screens (dashboard, profile, notes list)

### `BackButton`
- Size: 32×32px tap target (with 8px hitSlop extension)
- Icon: `chevron-back`, 24px, `colors.textPrimary`
- Auto-navigates: `router.back()` if history exists, else `router.replace("/(tabs)/dashboard")`

### `PersonAvatar`
- Default size: 36px
- Background: `colors.accentBg` (#EDE9FE)
- Icon: `person`, `colors.accent` (#A78BFA)
- Icon size: `size * 0.55` by default

### `ToolCard`
- Background: `colors.white`
- Border radius: 12px
- Padding: 16px vertical, 18px horizontal
- Title: 16px, weight 600, `textPrimary`
- Subtitle: 13px, `textMuted`
- Right: chevron-forward icon, `textHeading`

### `StatusBadge`
- Border radius: 4px
- Padding: 12px horizontal, 4px vertical
- Font: 11px, weight 600
- Tones: `success`, `danger`, `warning`, `neutral`

---

## Screen Patterns

### List screens (patients, notes)
```
SafeAreaView [backgroundAlt]
  ScreenHeader
  ScrollView [px-5 pt-5 pb-10]
    Section heading row (title left, action button right)
    Rounded card [bg-white rounded-xl]
      Patient row × N  [border-b border-gray-200 between rows]
```

### Detail / form screens
```
SafeAreaView [backgroundAlt]
  ScreenHeader [showBack]
  KeyboardAvoidingView (iOS: padding)
    ScrollView [p-5 gap-4 pb-10]
      FormInput sections
      PrimaryButton [mt-4]
      Error text (dangerAlt, below button)
```

### History screen (notes/history)
Uses custom header (no `ScreenHeader`) because it carries a patient-name subtitle.
Structure: `BackButton` + title/subtitle stack + `PersonAvatar` — all in a `flex-row`.

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `colors.*` tokens for every color value | Hardcode hex strings anywhere in screens |
| Use `BackButton` for all back navigation | Duplicate back-chevron logic inline |
| Use `PersonAvatar` for all person representations | Build avatar circles inline |
| Use `PrimaryButton` with label-change for loading state | Render a standalone `ActivityIndicator` below an already-labeled loading button |
| Show ward in patient list meta (`yrs · gender · ward`) | Omit ward when it's available |
| Use `ScreenHeader` on all screens except history | Build custom headers unless a subtitle is needed |
| `router.back()` via `BackButton` | `router.replace("/(tabs)/dashboard")` as default back |

---

## Known Issues (not yet fixed)

- `token.ts` (`src/theme/token.ts`) has stale values from a previous palette and is not used anywhere — safe to delete
- History screen "Draft" badge is neutral-bg + danger-text, which reads as an error state rather than a work-in-progress state — worth revisiting
