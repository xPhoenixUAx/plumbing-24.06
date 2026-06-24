# Project Handoff: FlowCore Plumbing

Date: 2026-06-24  
Project path: `c:\Users\User\Desktop\plumbing-24.06`

## Project Summary

This is a static HTML/CSS/JavaScript website for a plumbing service aggregator / provider matching platform.

The site is positioned as a free referral and lead-generation service that helps homeowners connect with independent local plumbing providers. It should not read like a direct plumbing contractor site.

Core company data is stored in:

```text
js/site-config.js
```

Reusable business information should continue to come from config via `data-*` attributes where possible:

- company name
- phone
- email
- website
- address
- service area
- business hours
- company ID
- footer text and copyright

## Main Pages

Root pages:

- `index.html`
- `about.html`
- `services.html`
- `contact.html`
- `privacy-policy.html`
- `terms-and-conditions.html`
- `cookie-policy.html`
- `search.html`

Service pages:

- `services/residential-plumbing.html`
- `services/commercial-plumbing.html`
- `services/drain-cleaning.html`
- `services/water-heater-service.html`
- `services/sewer-line-repair.html`
- `services/fixture-installation.html`

Assets:

- `assets/css/styles.css`
- `assets/images/*.webp`
- `assets/images/favicon.svg`
- `js/main.js`
- `js/site-config.js`

## Work Completed In This Session

### Header

- Made the full `header` sticky.
- Fixed sticky conflict by changing `html/body` from `overflow-x: hidden` to `overflow-x: clip`.
- Made `topbar-inner` more responsive on medium widths.
- Added a `max-width: 1180px` breakpoint to compress brand/contact/button spacing before the 980px mobile layout.
- Improved small mobile header sizing around 380px.

Important CSS areas:

- `header`
- `.topbar-inner`
- `.quick-contact`
- `@media (max-width: 1180px)`
- `@media (max-width: 640px)`
- `@media (max-width: 380px)`

### Search

- Replaced the old search shortcut behavior with real site search.
- Added `search.html`.
- Search now routes to `search.html?q=...`.
- Added a local search index in `js/main.js`.
- Search results are ranked by title, type, description, and terms.
- Added live search suggestions/dropdown in the header.
- Suggestions work from the first typed letter.
- Suggestions support click, focus, keyboard navigation, and Escape.
- Search paths are aware of `/services/` relative depth.

Important files:

- `search.html`
- `js/main.js`: `searchIndex`, `initSearch`, `initSearchPage`
- `assets/css/styles.css`: `.search-suggestions`, `.search-results`, `.result-card`

### Request Router

Added an interactive aggregator-style request tool on the homepage after the hero/service strip.

Features:

- Issue type selector:
  - Active leak
  - Clogged drain
  - No hot water
  - Sewer concern
  - Fixture install
  - Commercial issue
- Urgency meter:
  - Planned
  - Today
  - Urgent
- Visible signs checkboxes.
- Live request preview.
- Provider verification checklist.
- `Use This Request` button stores selected data in `sessionStorage`.
- On `contact.html`, the contact form is auto-filled from the router request:
  - `Service Category`
  - message textarea with summary, urgency, symptoms, and details.

Mobile behavior:

- Router controls are `<details>` dropdowns on mobile.
- All router dropdowns start closed on mobile.
- On desktop, router dropdowns stay open and cannot be accidentally collapsed.

Important files:

- `index.html`: request router section
- `js/main.js`: `initRequestRouter`, `initRouterDropdowns`, `initRouterContactFill`
- `assets/css/styles.css`: `.request-router-section`, `.router-dropdown`, `.urgency-meter`, `.preview-card`, `.verification-card`

### Contact Form Confirmation Modal

- Added a real confirmation modal on `contact.html`.
- Form submit no longer only shows inline success text.
- Modal displays:
  - name
  - phone
  - selected service
  - submitted details
- Modal can be closed with:
  - Done button
  - close X
  - backdrop click
  - Escape key
- Includes a call button to the priority line.

Important files:

- `contact.html`: modal markup
- `js/main.js`: `showConfirmationModal`, `openModal`
- `assets/css/styles.css`: `.modal-backdrop`, `.confirmation-modal`, `.modal-summary`

### Homepage Service Cards

- Equalized service card heights.
- Pushed `Learn More` links to the bottom of each card.
- On mobile, changed `.services-grid` into a horizontal swipe carousel with scroll snapping.
- Added `Swipe to browse service cards` hint on:
  - `index.html`
  - `services.html`
- Removed vertical scroll from the mobile swipe grid.

Important CSS:

- `.services-grid`
- `.service-card`
- `.service-card-body`
- `.swipe-hint`
- mobile `@media (max-width: 640px)` service carousel styles

### Hero Section

- Smoothed the rotating word animation.
- Avoided awkward fixed-width rotating word spacing.
- Stabilized the hero heading height instead of reserving width inside the sentence.
- Added reduced-motion handling.
- Tuned mobile hero height and padding.

Important CSS:

- `.hero-content h1`
- `.rotating-word`
- `.word-out`
- `.word-in`

### Hero Service Strip

- Converted the visible mini-card icons into large faint background print icons.
- Hid the inline lucide icons visually for `.service-mini`.
- Used SVG masks with `-webkit-mask` support.
- Kept prints inside the card, not clipped at edges.

Important CSS:

- `.service-mini::before`
- `.service-mini:nth-child(...)::before`

### FAQ

- Added FAQ section to homepage after the estimate/control block.
- Split FAQ into two independent columns.
- Opening one FAQ item no longer stretches the item beside it.
- Added smooth open/close animation for answers.

Important files:

- `index.html`: `.faq-section`
- `assets/css/styles.css`: `.faq-grid`, `.faq-column`, `.faq-answer`
- `js/main.js`: `initFaq`

### Page Loaders and Transitions

- Added global page loader generated by JS.
- Loader appears on initial load and internal page transitions.
- Internal links are intercepted for a short transition.
- External links, `mailto:`, `tel:`, downloads, hash links, and new-tab clicks are not intercepted.

Important files:

- `js/main.js`: `ensurePageLoader`, `showPageLoader`, `hidePageLoader`, `initPageTransitions`
- `assets/css/styles.css`: `.page-loader`, `.loader-mark`

### Footer

- Reworked footer spacing, grid, typography, CTA, bottom bar, and disclaimer.
- Brand column is now better aligned.
- Footer columns have consistent headings and link spacing.
- Legal links are grouped in a dedicated `.footer-legal-links` pill-style group.
- Grouped legal links were applied across all HTML pages, including service pages with correct `../` paths.
- Removed footer CTA from `contact.html` only.

Important CSS:

- `.footer`
- `.footer-cta`
- `.footer-main`
- `.footer-bottom`
- `.footer-legal-links`
- `.footer-disclaimer`

### Legal Pages

Legal content was first imported from markdown files, then expanded significantly for an aggregator/lead-generation site.

Updated pages:

- `privacy-policy.html`
- `terms-and-conditions.html`
- `cookie-policy.html`

Legal content now covers:

- provider matching / lead generation model
- independent third-party providers
- no contractor relationship
- no guarantee of availability, price, outcome, or completion
- emergency disclaimer
- communications consent
- provider verification responsibility
- sharing request details with providers and tools
- cookies, analytics, ads, CRM, call/form routing
- user rights, retention, security, opt-out logic

Business data in legal content uses config-driven attributes:

- `data-company`
- `data-email`
- `data-phone`
- `data-address`
- `data-service-area`
- `data-email-link`
- `data-phone-link`

Also added title/meta replacement in `js/main.js` so `FlowCore Plumbing` in `document.title` and meta descriptions is replaced by `site-config.js` company name at runtime.

### Favicon

Added:

```text
assets/images/favicon.svg
```

Linked it across all HTML pages, including service pages with `../assets/images/favicon.svg`.

## Current Important JavaScript Functions

All in `js/main.js`:

- `applyConfig()`
- `initMenu()`
- `initHeadline()`
- `initReveal()`
- `initCounters()`
- `initLogos()`
- `initForms()`
- `showConfirmationModal()`
- `openModal()`
- `initSearch()`
- `initSearchPage()`
- `initRequestRouter()`
- `initRouterDropdowns()`
- `initRouterContactFill()`
- `initFaq()`
- `initPageTransitions()`
- `initParallax()`

## Verification Already Run

Commands used during work:

```powershell
node --check js\main.js
```

Local href/src checks were also run with Node scripts several times. No missing local `href` or `src` targets were found at the time of checking.

A local server was started at one point:

```text
http://localhost:4173/index.html
```

The in-app browser and Playwright were not available in this environment, so visual QA should still be done manually in a real browser.

## Recommended Next QA On Another PC

Open the site locally and check these viewports:

- 1440px desktop
- 1024px tablet
- 768px tablet
- 390px mobile
- 360px mobile

Focus areas:

- sticky header behavior while scrolling
- mobile menu offset and open/close behavior
- search suggestions on desktop and mobile
- `search.html?q=drain`
- Request Router desktop and mobile dropdown behavior
- `Use This Request` flow into `contact.html`
- contact confirmation modal
- mobile service-card swipe carousel
- FAQ open/close animation
- footer legal links on root and `/services/` pages
- legal pages readability with long content

## Known Notes / Decisions

- This is a static site with no backend.
- Contact form does not actually send data anywhere; it shows a confirmation modal only.
- Request Router stores transfer data in `sessionStorage`.
- Search is client-side and uses a hardcoded local index in `js/main.js`.
- Legal content is written for an aggregator/referral model, not a direct contractor.
- Tracking IDs are intentionally not hardcoded.
- The site uses external Lucide icons and Google Fonts.
- Favicon is SVG-only.

## Potential Next Improvements

- Add real form submission endpoint or CRM integration.
- Add optional cookie consent banner if required by deployment target.
- Add schema markup for organization/services if desired.
- Add Open Graph/Twitter meta tags.
- Add a simple `README.md` with deployment steps if this will be handed to another developer.
- Consider normalizing footer/header duplicated HTML into includes only if the project later moves beyond static HTML.

