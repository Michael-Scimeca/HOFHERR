# Project Agent Directives — Hofherr Meat Co.

## 🩺 React Doctor Auto-Check Rule (MANDATORY)

After modifying any React component, hook, or API route in `src/`:
1. **Always run**: `npx react-doctor@latest --scope changed`
2. **Verify score**: Ensure the React Doctor score does NOT regress from 100/100 and no new warnings/errors are introduced.
3. **Auto-fix before completing**: Immediately resolve any flagged issues (e.g. side-effects in state updaters, missing res.ok checks, unversioned localStorage keys, missing dependencies) BEFORE reporting completion to the user or running git commit.

## 🎨 No Static Inline Styles Rule (MANDATORY)

In this project, **never write static values** in `style={{...}}` or `element.style`.
- Use CSS Modules (`*.module.css`), design tokens, or utility classes in `src/app/globals.css`.
- Inline `style` is allowed **only** to pass a CSS custom property (e.g. `style={{ '--var': value }}`) for dynamic runtime values.
- **Exceptions**: GSAP / Lenis physics, canvas / shader / WebGL contexts (`EmbersCanvas`), map pins (`FooterMap`), and external email HTML strings (`email-templates.ts`).

## 🖼️ Image Storage & Naming Convention Rule (MANDATORY)

- **Location**: Always place new images inside `public/assets/<section>/` or `public/images/<section>/` (e.g. `public/assets/cuts/`, `public/assets/bbq/`, `public/assets/catering/`). **Never put images directly in the `public/` root**.
- **Naming**: Use **lowercase kebab-case** descriptive names (e.g. `prime-ribeye-steak.webp`, `smoked-brisket-platter.jpg`).
- **No Raw IDs**: Never use camera IDs, Amazon seller IDs (e.g. `71tQzMjwGaL._SL1500_.jpg`), stock photo hashes, or raw IDs in image filenames.

## 🔤 Typography & Color Hierarchy Rule (MANDATORY)

Use only the type-scale and color tokens (`--red`, `--gold`, `--fg`, `--fg-2`, `--fg-3`, `--fg-muted`). No arbitrary `text-[Npx]`, no inline `fontSize`, no raw hex text colors. One `h1` per page, no skipped heading levels.
**No Pill Badges / Eyebrows Above Headlines**: Never put eyebrow pills, category tags, or pill badges above headlines/h1 titles. Keep headlines clean without preceding decorative badge pills.

## 📐 Section Heading & Spacing Rule (MANDATORY)

Every section heading uses standard section heading hierarchy. Sections are spaced by the parent's gap or `.section` / `.section-sm` classes, never by margins on the heading.
Padding = inside boxes with a visible edge. Gap = between siblings (parent owns it). No margins on components except `mt-auto` / `mx-auto`.
All values on the 8px grid via spacing tokens (no off-grid values like 20px / py-5). Parent gap owns space between siblings; a child's padding must never add to the parent's gap.

## 🏗️ Page Structure Rule (MANDATORY)

Page structure: `<main>` → optional `<header>` with the `h1` → `<section>`s (each with a heading + `aria-labelledby`). Layout divs go inside sections, never beside them. Sidebars are `<aside>`. Form steps are sibling `<section>`s.

## 🔘 Unified Toggle Rule (MANDATORY)

All on/off switches across the site must use `<Toggle>`. Toggle styling lives only in the shared toggle component/styles. Never create hand-built toggle switches or write inline toggle styles. Use `size="sm"` for compact admin tables and dense cards, and `size="md"` for standard forms. Always ensure accessible labels are provided via `label`, or `hideLabel` with `aria-labelledby`.

## 📦 Standard Section Recipe Rule (MANDATORY)

Every section uses the standard `.section` / `.container` (`--max-w: 1800px`) layout pattern. No ad-hoc section spacing, gutter, or heading styles written by hand.

## 🧩 Shared Components & Anti-Duplication Rule (MANDATORY)

Before building a section, check existing components in `src/components/` (`Navbar`, `Footer`, `FaqAccordion`, `CateringCalculator`, `InteractiveTimeline`, `TeamBentoGrid`, `NewsletterInline`, `ChatWidget`). Never build a second version of an existing section type.

## 📑 Section Pattern Rule (MANDATORY)

Page sections = `<section id aria-labelledby className="section|section-sm">` stacked in a flex-col parent. Only the section size class on the `<section>`; layout/background/animation go inside. Heading id = `'<section-id>-heading'`.

## 🔲 Corner Radius Consistency Rule (MANDATORY)

Boxes use consistent radius tokens (`var(--radius)`, `var(--radius-sm)`, `var(--radius-lg)`); pills use `border-radius: 999px` / `rounded-full`; media gets radius on an `overflow-hidden` wrapper. Never redefine radius tokens.

## 🚫 No Content-Boxing / Enclosing Cards in Hero Sections (MANDATORY)

Never wrap hero text, headlines, narrative descriptions, or feature lists in heavy card containers with visible borders, background fills, and internal card padding. Content must sit directly and openly on the hero backdrop/canvas using typography hierarchy, spatial breathing room, and subtle legibility gradients. Avoid heavy bento card containers or boxed-in card wrappers around text content.
