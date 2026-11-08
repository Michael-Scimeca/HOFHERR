# Test Project Context: Hofherr Meat Co.

## Purpose
Automated end-to-end and integration test suite for the **Hofherr Meat Co.** craft butcher shop, meat-packing, BBQ, and catering platform (Northfield, IL). Ensures high-reliability across online meat/depot ordering (`/online-orders`), custom cut guides (`/cut-guide`), catering & pig roast calculators (`/catering`, `/bbq`), weekly specials (`/specials`), gift cards (`/gift-cards`), customer dashboard (`/dashboard`), and admin inventory/order management (`/admin`).

## Tech Stack
- **E2E Testing**: Playwright (`@playwright/test`)
- **Unit / Component Testing**: Vitest (`vitest` v4.1+) & `@testing-library/react`
- **Accessibility Testing**: `@axe-core/playwright`
- **Application Framework**: Next.js 16 (App Router)
- **UI & State**: React 19, CSS Modules & Design Tokens (`--max-w: 2400px`), GSAP, Lenis Smooth Scroll
- **Runtime & Language**: Node.js >= 20, TypeScript v5
- **Backend / Database**: Sanity CMS, NextAuth v5, Stripe Checkout, Nodemailer, Twilio

## Test Project Conventions

### Test Code Style
- **File Naming**: Kebab-case with `.spec.ts` suffix (e.g. `tests/mobile-safari.spec.ts`, `tests/visual-hierarchy-audit.spec.ts`).
- **Locators Priority**:
  1. Accessible role queries: `page.getByRole('button', { name: '...' })`, `page.getByRole('listbox')`
  2. Label queries: `page.getByLabel('...')`
  3. Stable test IDs: `page.locator('[data-testid="..."]')`
  4. Avoid unstable CSS utility classes that can shift across design refactors.
- **Timing & Waiting**:
  - Always rely on Playwright auto-waiting, `waitFor({ state: 'visible' })`, or `waitForURL()`.
- **Quality Gates**:
  - `npx react-doctor@latest --scope changed` must score 100/100.
  - TypeScript zero-error compile (`npm run typecheck`).

### Test Architecture Patterns
- **Isolation**: Each test is self-contained with fresh context; tests can run in parallel without cross-contamination.
- **Arrange-Act-Assert**: Clear structural separation in every test.
- **Visual & Responsive Testing**: Validate across desktop (`1440x900`) and mobile (iPhone 15 / iPhone SE Safari touch viewports).

### Testing Strategy
- **Framework**: Playwright + Vitest
- **Spec Format**: SpecTest (human-readable test specifications in `spectest/specs/`)
- **Proposals & Changes**: Spec-first proposals in `spectest/changes/[change-id]/` with required `#### Scenario:` deltas.
- **Execution & Reports**:
  - E2E: `npx playwright test` (generates HTML report in `playwright-report/` and failure artifacts in `test-results/`)
  - Unit/Integration: `npm test` (`vitest run`)

### Git Workflow
- Feature branches branched from `main`.
- Spec changes proposed in `spectest/changes/`, validated with `spectest validate <id> --strict`, and archived upon implementation with `spectest archive <id> --yes`.

## Domain Context
- **Online Ordering (`/online-orders`)**: Dual-store ordering system supporting the Butcher Shop (`?store=butcher`) and The Depot (`?store=depot`), dynamic pickup date/time slot generation based on Chicago store hours, cart persistence, coupons, tips, and Stripe / In-Store payment flows.
- **BBQ & Catering (`/bbq`, `/catering`)**: Catering packages, interactive portion/pricing calculators, and inquiry flows.
- **Cut Guide & Specials (`/cut-guide`, `/specials`)**: Interactive primal cut diagrams, cooking tips, and seasonal/weekly butcher specials.
- **Gift Cards (`/gift-cards`)**: Instant Square eGift cards and physical mail-order gift cards.

## Important Constraints
- Dev server runs on `http://localhost:3001` (or `PORT` environment variable).
- Strict adherence to the `No Static Inline Styles Rule` and `React Doctor Auto-Check Rule` in `.agents/AGENTS.md`.
