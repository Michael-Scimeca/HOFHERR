---
name: forge-brandkit
description: "Brand kit image generation - logo systems, color/type/grid boards, photography direction, applications. Six to twelve board set with a single visual register held throughout. Eight canonical registers (minimalist tech / editorial / dark-tech / luxury / cultural / gaming / developer-tool / consumer-app). Contains prompt template + 9 worked board prompts. Use when producing brand guideline boards, identity decks, and logo concept sheets."
---

# forge-brandkit

You are art-directing brand kit images - the kind that go in a design review deck or an investor pitch. Default image-gen output for "brand kit" is the same beige board with three logo lockups, two type samples, and a "Lifestyle" photo of someone with a laptop. This skill exists to produce brand boards that look like they came from a design studio, not a stock template.

The deliverable: **6-12 boards that, viewed together, communicate the brand system:** logo, palette, typography, voice, applications. Each board does one job; the set tells the brand story.

## Quick reference (the things you must never ship)

1. A "kitchen sink" board with logo + color + type + photo all in one frame.
2. The "beige + sage + terracotta + matte black" AI default palette.
3. Floating logo on a multicolor gradient background.
4. "TechCorp" or "Acme Studio" as the brand name in renders.
5. Stock photography of laptops / team meetings.
6. Logo construction with overly-dramatic golden-ratio overlays implying more design than there is.
7. Six different fonts shown across the kit.
8. A "moodboard" board that is just stock images.
9. Photography from a different visual register than the logo (mixed identity).
10. Six boards with the same composition (deck-template feel).

## Hard rules

### Board structure

**1. One concept per board. Not a kitchen sink.** Boards: cover, logo construction, color, primary type, secondary type, grid system, photography direction, voice samples, applications (business cards, signage, packaging, web). 6-12 boards total.

**2. 16:9 or 21:9 for slide-deck friendly. Square for social-friendly.** Pick one shape for the set.

**3. Negative space is mandatory.** Brand boards that feel cramped read as student work.

**4. Boards labeled, but labels are typographic, not boxed.** A small `01 / LOGO` corner label beats a bordered "TITLE BOX."

### Logo board

**5. Show the logo at three scales:** tiny (favicon), medium (header), large (hero). Demonstrates the mark survives at production sizes.

**6. Construction grid optional but high-prestige.** Hairline grid lines showing how the mark was built communicates "this was designed, not generated."

**7. Lockup variants: horizontal, stacked, monogram, monochrome on both backgrounds.** Even if you only ship one, show the family.

**8. Background variants: light AND dark.** Premium brand kits show both.

### Color board

**9. Five to seven core colors maximum.** Primary, secondary, two-three neutrals, two functional. More feels indecisive.

**10. Each color shown as a swatch with hex, RGB, CMYK (if print-relevant), and a usage note.** "Primary accent: signal, action, call-to-action only - never as a fill for body content."

**11. Color in context.** Beyond swatches, one or two compositions using the palette so relationships are visible.

### Type board

**12. Display + body + monospace (if used). Three families maximum.**

**13. Full character set at one size, then a type scale (display, h1, h2, h3, body, caption).** Real characters, not lorem ipsum.

**14. A pull quote at large size demonstrates voice.** Real-sounding sentence in brand tone, not "the quick brown fox."

**15. Mention licensing where relevant.** "Söhne by Klim Type Foundry, licensed for x users."

### Photography direction

**16. Treatment more than subject.** Brand kits define light, color grading, composition - not specific subjects. "Warm-toned, slightly underexposed, off-center subject, environmental context."

**17. Show 4-6 reference photos sharing treatment.** Consistent grade is the brand signal.

### Applications

**18. At least three application mockups:** business card, signage, packaging or merch, web home page.

**19. Mockups are restrained and realistic.** Not floating cards on gradient. A business card photographed at slight angle on textured surface beats a vector mockup.

**20. The application uses the brand correctly.** Not a generic mockup with a placeholder logo.

### Voice / messaging board (optional)

**21. 3-5 tone samples: tagline, social post, error message, marketing headline.** Same voice across all five.

**22. Voice principles in one sentence each.** "Confident without bragging. Specific over vague. We use 'we' not 'the platform.'"

### Visual register

**23. Pick the brand's register and hold it across every board.** Editorial / minimal / dark-tech / luxury / cultural / gaming / developer-tool / consumer-app. The register itself should be visible from the cover board alone.

### Eight registers + notes

| Register | Palette / type / logo / applications |
| --- | --- |
| **Minimalist tech** | Bone or near-white bg, near-black fg, one warm-orange or signal-red accent. Söhne / Inter Display / Geist. Geometric monogram-friendly mark. Apps: web, business card, signage. |
| **Editorial / magazine** | Cream or warm-white, dark fg, restrained accent. Serif primary (Tiempos, Source Serif, Editorial Old) + sans secondary. Custom-drawn wordmark. Apps: newsletter, masthead, print covers. |
| **Dark-tech / dev-tool** | Deep midnight bg, warm off-white fg, single warm-orange or terminal-green accent. Mono prominent (JetBrains, Berkeley). Geometric mark with subtle code-symbol DNA. Apps: terminal, web docs, conference badge. |
| **Luxury / premium** | Warm cream or near-black, single muted accent (deep teal, oxblood, gold-leaf). Refined serif or refined sans (Tiempos, Söhne, custom). Wordmark in tight kerning. Apps: foil-stamped card, packaging, hospitality signage. |
| **Cultural / regional** | Palette borrows from a regional tradition without literal pastiche. One specific typographic move that signals the region (script accent, regional numeral set). Apps: contextual to the culture. |
| **Gaming / entertainment** | High-contrast palette: deep dark + saturated accent. Display type with character (custom or modified). Emblematic logo. Apps: capsule art, launcher, merch. |
| **Consumer-app** | Warm, friendly but not childish. Soft serif or rounded sans (Tiempos Headline, Söhne Breit, GT Walsheim). Approachable mark. Apps: App Store screens, in-app illustration. |

## Common AI-output patterns to reject

| Pattern | Why slop | Fix |
| --- | --- | --- |
| Beige + sage + terracotta + matte black | AI brand-board default | Anything else |
| Floating logo on gradient | Lazy presentation | Restrained mockup, textured surface, real context |
| "TechCorp" / "Acme Studio" | Fake brand | Real name or `[BRAND]` placeholder |
| Stock photo of laptops / meetings | Default photography | Treatment-defined real-looking photo |
| Logo construction with golden-ratio overlays implying more design than there is | Performative | Skip the construction board, or be honest about the grid actually used |
| 6 fonts on the type board | Identity sprawl | Three families max, ideally two |
| "Moodboard" board of stock images | No identity statement | Photography-direction board with treatment notes |
| One register on cover, different on applications | Mixed identity | Hold register across the entire set |
| Six boards same composition | Deck-template feel | Vary - some typographic, some photographic, some grid-based |
| No application mockups | Floats in theory | At least 3 real-context applications |

## Prompt template

```
BOARD:        [cover | logo | color | type | grid | photography | voice | application_business_card | application_web | etc]
ASPECT:       16:9 or 21:9 or 1:1
REGISTER:     [minimalist tech | editorial | dark-tech | luxury | cultural | gaming | consumer-app]
PALETTE:      bg #..., fg #..., accent #..., optional second accent #...
TYPE:         [primary face, secondary face]
BRAND_NAME:   [actual name or placeholder like "BRAND"]
SUBJECT:      [what this specific board shows]
COMPOSITION:  [layout description]
ANTI:         [things to avoid]
```

## Worked example: 9 boards for a dark-tech dev-tool brand

```
COMMON across all 9:
  REGISTER: dark-tech / dev-tool
  PALETTE: bg #0B0E13, fg #F4F4F2, accent #FF5C2B, mid #6B6B6B
  TYPE: Geist for headlines, JetBrains Mono for labels and data
  BRAND_NAME: FORGE
  ASPECT: 16:9
  STYLE: editorial, restrained, document-coded
  ANTI: no purple-pink gradient, no stock photo, no extra decorative elements, no light-mode preview crammed in

01_COVER      Big "FORGE" wordmark centered, slightly off-center to the
              right. Tiny mono "BRAND GUIDELINES / V0.4 / 2026.05" top-left
              corner. Vast negative space. Single thin orange underline
              under "FORGE" - the only accent.

02_LOGO       Mark shown at three scales (tiny / medium / large). Hairline
              construction grid behind, very faint. Both background
              variants (dark and light) side by side. Mono caption "FORGE
              MARK / GEOMETRIC / 2026" small below.

03_COLOR      5 swatches in a horizontal row across the lower third. Hex
              codes in mono caps below each. Large accent swatch on the
              left taking 30% width with the brand name in negative space.
              Eyebrow "02 / COLOR" top-left.

04_TYPE       Full character set at one size (top half). Type scale below
              with real sentences: display / h1 / h2 / body / caption.
              Showcase pull quote in display: "Discipline beats
              configuration."

05_GRID       Visible 12-column grid with hairline guides. Sample layout
              with type and logo placed on the grid. Annotations in mono
              for column widths, gutters, baseline grid.

06_PHOTOGRAPHY 4 reference photos, all same treatment: warm-shadow, off-
              center subject, dark background, sparse composition.
              Subjects: a single piece of hardware (a vintage typewriter,
              an anvil, a soldering iron, a notebook). All in same lighting.
              Mono caption "PHOTO DIRECTION / WARM-SHADOW / OFF-CENTER".

07_VOICE      5 voice samples typeset in display: tagline ("Skills with
              teeth."), social post excerpt, error message, marketing
              headline, support reply. Each in different size to show
              hierarchy. Voice principles in mono down the right margin.

08_APP_CARD   Business card photographed at slight angle on textured dark
              surface (concrete or aged leather). Brand mark on one side,
              minimal info (name + role + URL) on the reverse. Subtle key
              light.

09_APP_WEB    Browser frame mockup showing the marketing home page in this
              register: dark workshop palette, large display headline,
              single accent moment. Subtle realistic shadow under the
              browser frame.
```

What this demonstrates: 9 boards, one concept each (rule 1); 16:9 throughout (rule 2); single register held (rule 23); type board with full character set + scale + voice pull quote (rules 12-14); color board with hex + usage context (rule 10); photography board defines treatment not subject (rule 16); 3 application mockups (rule 18); no fake brand name (rule 4 of quick-ref); single accent moment per board (the orange underline on cover, the warm-shadow on photos).

## Workflow

When building a brand kit:

1. **Define the register.** One of the named categories above + a one-sentence statement of voice.
2. **Pick palette, type, logo direction.** These three carry 80% of the brand.
3. **List the boards.** 6-12.
4. **Generate the cover first.** Sets the register for everything else.
5. **Color and type boards next.** Foundational.
6. **Logo board next.**
7. **Application mockups last.**
8. **Contact-sheet the set. Verify consistency.**

## Verification

Manual checklist:

- [ ] 6-12 boards, one concept per board.
- [ ] Register identifiable from cover alone.
- [ ] Palette + type consistent across all boards.
- [ ] Logo shown at multiple scales, both background variants.
- [ ] At least three application mockups.
- [ ] No beige+sage+terracotta default palette.
- [ ] No stock photography.
- [ ] No floating-logo-on-gradient.

## When to skip this skill

- A single logo concept, not a full brand kit.
- Marketing site comps (use [`forge-imagegen-web`](../forge-imagegen-web/SKILL.md)).
- Mobile app screens (use [`forge-imagegen-mobile`](../forge-imagegen-mobile/SKILL.md)).
- Real client work that needs a designer, not AI generation. Generated brand kits are a starting point, not a finished system.

## Related skills

- [`forge-imagegen-web`](../forge-imagegen-web/SKILL.md) - landing-page comps in the same register.
- [`forge-imagegen-mobile`](../forge-imagegen-mobile/SKILL.md) - mobile screens in the same register.
- [`forge-soft`](../../design/forge-soft/SKILL.md), [`forge-brutalist`](../../design/forge-brutalist/SKILL.md), [`forge-minimalist`](../../design/forge-minimalist/SKILL.md) - implementation registers that consume the brand.
