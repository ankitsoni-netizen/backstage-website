# Backstage design system

Original visual identity for Backstage. Principles were taken from editorial talent-agency sites (warm paper, oversized type, confident colour, scroll rhythm) without copying layout, copy, or assets.

## Brand thesis

Backstage is a full-stack partner for the creator economy: deals, content strategy, brand collaborations, legal, finance and IP. The system should feel like a premium editorial house, not a SaaS dashboard.

## Colour

Public site tokens:

| Token | Hex | Role |
| --- | --- | --- |
| `ink` | `#161310` | Near-black, slightly warm. Text and primary fills. |
| `paper` | `#f3eee4` | Bone / warm paper. Default canvas. |
| `muted` | `#6d6458` | Secondary copy. Contrast against paper is AA for body sizes. |
| `line` | `#d8d0c3` | Hairline borders. Prefer sharp edges over cards. |
| `signal` | `#c8f04c` | Chartreuse accent. Use sparingly: rules, focus on ink, primary emphasis. |
| `orange` | `#ff4b12` | Electric orange. Photography fallbacks, rare signals. |
| `powder` | `#c5d8ea` | Powder blue. Photography fallbacks, occasional fields. |
| `blush` | `#f1c4c8` | Soft pink. Occasional fields, never body text. |

Admin tokens (`data-theme="admin"`):

| Token | Hex | Role |
| --- | --- | --- |
| `admin-canvas` | `#f4f2ee` | Neutral working surface |
| `admin-ink` | `#1d1c1a` | Body text |
| `admin-muted` | `#6a6762` | Meta copy |
| `admin-line` | `#d6d2cb` | Borders |
| `admin-fill` | `#eae7e1` | Quiet fills |
| `admin-danger` | `#9f2d1f` | Errors |

Admin chrome does not use chartreuse or orange. Semantic `foreground`, `surface`, `muted` and `line` remap under `data-theme="admin"`.

## Typography

Two families only. Inter does the work; Tempting is an accent.

- **Inter** (primary: `font-sans` / `font-display` / `text-display` / `text-title`) — body, wordmark, navigation, buttons, UI chrome, and every heading. Use Regular for copy, Medium for labels and controls, Semibold/Bold for titles and in-sentence stress, plus underline for links and selected phrases.
- **Tempting** (secondary: `font-script` / `text-highlight` via `Highlight`) — one word inside a sentence, never a full heading, label, or paragraph. Never italicise, never fake-bold, never set in all-caps.

Body copy is Inter at 16px (`text-base`) and 1.6 line-height.

Place a licensed `Tempting.woff2` in `public/fonts/` for production. Inter is loaded with `next/font/google`.

## Components

| Component | Path | Notes |
| --- | --- | --- |
| Container | `src/components/ui/Container.tsx` | Responsive gutters, `default` / `narrow` / `wide` |
| SectionLabel | `src/components/ui/SectionLabel.tsx` | Inter, uppercase, underline + chartreuse rule |
| Highlight | `src/components/ui/Highlight.tsx` | Tempting on a single word |
| Button | `src/components/ui/Button.tsx` | `primary`, `signal`, `ghost`, `inverse`; square corners; 44px min height |
| TextLink | `src/components/ui/TextLink.tsx` | Persistent underline |
| Field | `src/components/ui/Field.tsx` | Label, hint, error, 16px controls |
| CreatorImage | `src/components/ui/CreatorImage.tsx` | 4:5 crop, initials fallback, `onError` fallback |
| EmptyState | `src/components/ui/EmptyState.tsx` | Bordered, no card shadow |
| LoadingBlock | `src/components/ui/LoadingBlock.tsx` | Status text plus pulse bars (honours reduced motion) |
| SkipLink | `src/components/ui/SkipLink.tsx` | Keyboard skip to `#main-content` |
| SiteHeader / MobileNav | `src/components/website/` | Sticky header, dialog menu with text controls |
| SiteFooter | `src/components/website/SiteFooter.tsx` | Thesis + underlined links |
| Wordmark | `src/components/shared/Wordmark.tsx` | Inter lockup |

## Motion

Public site only. Admin (`data-theme="admin"`) does not load Lenis or decorative Motion.

- Lenis smooths wheel scrolling on the window. Keyboard, touch, hash links, and history stay native. It is not mounted when `prefers-reduced-motion` is set.
- Motion for React handles page-entry, heading reveals, staggered cards, the editorial ticker, section washes, sticky heading shift, and the mobile menu. Transforms and opacity only.
- Image hover scale is CSS `transform` inside an overflow clip. No layout shift.
- Decorative motion is skipped entirely under `prefers-reduced-motion`. Content remains readable without JavaScript.

## Accessibility

- Body copy 16px minimum
- `:focus-visible` rings; signal-coloured on ink surfaces
- Semantic headings and landmarks
- Mobile menu uses a native `dialog`, Escape to close, `aria-expanded`
- Link names are always visible; hover only strengthens decoration
- `overflow-x: clip` on `body` to prevent mobile horizontal scroll
