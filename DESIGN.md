---
version: alpha
name: ElevenLabs-inspired-project-design
description: A cinematic editorial design language adapted from the ElevenLabs analysis for this personal introduction and poetry site. Use an off-white canvas, warm ink, restrained pill CTAs, hairline borders, soft card elevation, and pastel atmospheric orbs. Preserve the project's Chinese poetry typography and existing React/Tailwind structure.
---

# ElevenLabs-Inspired Project Design

This project uses an ElevenLabs-inspired visual direction: a quiet editorial magazine atmosphere with cinematic imagery, warm ink typography, off-white surfaces, subtle hairlines, and pastel gradient orbs as the only expressive color moments.

This is an adaptation for the current personal introduction and poetry site, not an official ElevenLabs brand system. Keep the existing content identity, routes, local assets, and Tailwind architecture.

## Visual Direction

- Editorial rather than dashboard-like: generous whitespace, calm pacing, and restrained UI chrome.
- Cinematic rather than colorful: use imagery and atmosphere for emphasis, not saturated action colors.
- Warm and tactile: off-white canvas, near-black ink, white cards, soft borders, and gentle shadows.
- Audio-inspired atmosphere: waveform-like lines, subtle radial orbs, and measured motion may support poetry and media content, but must not imply unavailable audio functionality.
- The existing poetry pages remain literary: Ma Shan Zheng is reserved for poetry titles and reading content.

## Color Tokens

Use these semantic roles instead of adding one-off colors:

| Role | Value | Usage |
| --- | --- | --- |
| Canvas | `#f5f5f5` | Main page background |
| Canvas soft | `#fafafa` | Alternating bands and soft sections |
| Ink | `#0c0a09` | Display text, primary controls, dark bands |
| Primary ink | `#292524` | Default primary CTA |
| Body | `#4e4e4e` | Running text |
| Muted | `#777169` | Captions and supporting text |
| Muted soft | `#a8a29e` | Disabled or low-priority text |
| Card | `#ffffff` | Content cards and raised surfaces |
| Strong surface | `#f0efed` | Badges, icon plates, quiet controls |
| Hairline | `#e7e5e4` | Default dividers and card borders |
| Strong hairline | `#d6d3d1` | Input and emphasized outlines |
| Dark surface | `#0c0a09` | Featured sections and inverted cards |
| Dark elevated | `#1c1917` | Cards on dark surfaces |

Atmospheric gradients are decorative only:

- Mint: `#a7e5d3`
- Peach: `#f4c5a8`
- Lavender: `#c8b8e0`
- Sky: `#a8c8e8`
- Rose: `#e8b8c4`

Do not use these gradients as button fills, text colors, or status colors.

## Typography

### Roles

- Display headlines: use a light editorial serif at approximately `300` weight, falling back to `Georgia` or `Times New Roman` when no licensed display font is available.
- General UI and body: use the local Google Sans family through the `font-sans` role; keep body weight at `400` or `500` for readability.
- Monospace content: use the system monospace stack through the `font-mono` role.
- Poetry: retain `font-mashanzheng` for poetry titles and long-form poetry content.
- Captions and labels: small sans/utility text, medium weight, uppercase only when it improves hierarchy.

### Scale

- Hero display: approximately `64px`, `font-weight: 300`, line-height near `1.05` on wide screens; reduce to `32px` on mobile.
- Section display: `32px` to `48px`, light weight and slightly negative tracking.
- Component title: `18px` to `20px`, weight `500`.
- Body: `16px`, line-height around `1.5`, with subtle positive tracking.
- Caption: `12px` to `14px`, muted, optionally uppercase with wide tracking.

Never make the editorial display style bold. Use weight and spacing contrast in body text instead.

## Layout and Spacing

- Use a 4px base spacing rhythm: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `48`, and `96px` section rhythm.
- Prefer a centered content width around `1200px` for new page layouts. Reuse the existing `base-container` utility where it already owns the page alignment.
- Keep hero and CTA bands spacious, with approximately `96px` vertical padding on wide screens and smaller responsive values on mobile.
- Keep content cards 16px to 24px apart; use whitespace between sections rather than decorative separators.
- Poetry reading content remains narrow and text-led. Do not stretch prose to marketing-page widths.

## Shape, Depth, and Borders

- Primary buttons and badges use pill geometry (`9999px`).
- Feature and content cards use `16px` radius; larger atmospheric cards may use `24px`.
- Inputs use approximately `8px` radius.
- Prefer a 1px hairline border and one soft shadow tier: roughly `0 4px 16px rgba(0, 0, 0, 0.04)`.
- Avoid stacked shadows, heavy outlines, bevels, and excessive rounded containers.

## Components

### Navigation

- Use a clean, quiet top navigation over the canvas surface.
- Keep the existing sticky behavior and responsive menu structure.
- Navigation links should be medium-weight, compact, and low contrast until interaction.
- Primary navigation actions use an ink pill, not a saturated accent button.

### Buttons

- Primary: near-black ink pill, white text, approximately `40px` high, `10px 20px` padding.
- Secondary: transparent pill with a 1px strong hairline border.
- Tertiary: inline ink text link with a restrained arrow or underline treatment.
- Keep the existing `Button` component and Tailwind variants; update tokens before adding new variants.

### Hero

- Use a spacious hero band with a light display headline, short supporting copy, and one clear primary CTA.
- Add a soft radial gradient orb behind or beside the copy when atmosphere is needed.
- Use cinematic imagery as the hero's visual weight; do not cover the page with multiple competing gradients.

### Cards

- Use white cards on the off-white canvas with a hairline border, 16px radius, and restrained padding.
- Framework and tool cards should feel like quiet content surfaces, not colorful product tiles.
- Featured cards may invert to the dark surface with white text; use inversion instead of a colored ribbon.

### Poetry and Media

- Poetry entrance images may use a full-bleed crop, a dark cinematic overlay, and a light calligraphic title.
- Catalog rows use hairline dividers and generous vertical padding.
- A waveform motif can be used as a visual metaphor for voice, rhythm, or poetry, but it must remain decorative unless real audio behavior exists.
- Keep image motion slow and subtle, around `500ms` to `700ms` ease-out.

### Forms and Overlays

- Inputs use white/card surfaces, ink text, an 8px radius, and a strong hairline focus state.
- Modals use a quiet fixed overlay and a clear centered content surface.
- Preserve keyboard focus, readable contrast, and semantic controls.

### Footer

- Keep the footer calm and spacious with muted body text and low-contrast links.
- Use a canvas or dark inverted band; do not introduce a new accent color just for the footer.

## Responsive Behavior

- Mobile first: one-column layouts, reduced hero type, compact card padding, and a collapsed navigation menu.
- At approximately `640px`, allow two-column feature arrangements where content supports it.
- At approximately `768px`, keep touch targets at least `40px` high and maintain comfortable row spacing.
- At approximately `1024px`, allow full navigation and multi-column sections.
- Above `1280px`, cap content width and expand whitespace rather than endlessly widening text.
- Gradient orbs shrink at smaller widths but should not overpower or obscure text.

## Motion

- Use motion to create atmosphere or clarify interaction.
- Prefer the existing `300ms`, `500ms`, and `700ms` timing language.
- Use opacity, small scale, and color transitions; avoid bounce, aggressive parallax, and perpetual motion that distracts from poetry.
- Respect reduced-motion preferences when adding new animations.

## Do's and Don'ts

### Do

- Read this file before changing UI.
- Use semantic color roles and Tailwind utilities.
- Favor ink, hairlines, whitespace, imagery, and atmospheric orbs over saturated decoration.
- Keep Google Sans as the default interface typeface and Ma Shan Zheng for poetry.
- Reuse existing containers, buttons, cards, and dark-mode conventions.
- Keep new pages visually consistent with a cinematic editorial portfolio.

### Don't

- Do not copy ElevenLabs logos, wordmarks, proprietary illustrations, or branded assets.
- Do not turn the project into a generic audio dashboard or invent audio functionality.
- Do not use pastel orbs as button backgrounds or text colors.
- Do not make display headlines bold or use saturated colors for primary actions.
- Do not introduce a new font, color scale, radius system, or global CSS layer for one component.
- Do not remove the existing poetry typography or dark-mode support without an explicit design decision.

## Agent Workflow

1. Read this file and inspect the owning route/module before writing UI.
2. Reuse the existing Tailwind utilities and component variants.
3. Choose semantic tokens from this document before adding a raw value.
4. Build mobile-first, then add responsive behavior at the existing breakpoints.
5. Check both light and dark states, including borders, shadows, overlays, and muted text.
6. Keep the result editorial, cinematic, restrained, and compatible with the project's poetry content.
7. Run the project build before handing off UI changes.

## Source Note

This project adaptation is based on the publicly available ElevenLabs design analysis at https://getdesign.md/elevenlabs/design-md. It is an independent visual reference, not an official ElevenLabs design system.
