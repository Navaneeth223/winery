# ORÉE — a cinematic winery experience

> From the fruit of the earth to the wine in your glass.

A single-page, scroll-driven "film" for a fictional estate winery. The scroll
position is the timeline: the visitor travels through the vineyard, into a
grape, through its skin into living juice, down into the cellar, up into the
bottle, through the pour, and finally into the shop.

ORÉE is a demonstration brand — every claim is invented and every asset is
either generated (SVG bottle, canvas liquid) or openly sourced photography.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build
```

## The film (chapter map)

| Scene component        | Chapter                 | What happens |
| ---------------------- | ----------------------- | ------------ |
| `HeroScene`            | 01 · The Land           | Golden-hour vineyard; slow dolly-in; title choreography |
| `VineDollyScene`       | 02 · The Fruit          | Travelling shot through the rows → cluster grows from a circular mask → the harvest hands |
| `PressScene`           | 04 · The Press          | Grape fills the frame; a ring of light "passes through the skin" into a living canvas of juice that darkens and calms |
| `FermentationScene`    | 05 · The Cellar         | Rack focus out of darkness; fermentation numbers count themselves; barrels; the winemaker's creed |
| `CraftScene`           | 06 · The Craft          | Editorial spread with sticky creed and drifting photographs |
| `BottleRevealScene`    | 07 · The Bottle         | The estate bottle as a 250-frame film scrubbed by scroll; story arrives in passes; real add-to-cart |
| `PourScene`            | 08 · The Pour           | A 300-frame cinematic pour, frame-by-frame with the scroll |
| `CollectionScene`      | 09 · The Collection     | Daylight. The shop: six wines, filters, quick add, wishlist |
| `TableScene`           | 10 · The Table          | Asymmetric editorial gallery with parallax |
| `EstateScene`          | 11 · The Estate         | Aerial pan; experiences; visit request form |
| `FinalScene`           | 12 · The Final Moment   | "FROM EARTH. TO BOTTLE. TO MOMENT." |

## Architecture

```
src/
  data/       brand.ts (replace to rebrand), wines.ts (the collection)
  store/      zustand — UI state + persisted cart/wishlist
  lib/        gsap setup, lenis smooth-scroll integration
  hooks/      usePrefersReducedMotion, useInView
  components/
    graphics/ BottleGraphic (ONE bottle everywhere: cards, cart, detail)
    canvas/   ImageSequence (scroll-scrubbed film), JuiceCanvas,
              DustCanvas (visibility-gated)
    chrome:   Preloader, Navbar, Chrome (rails/grain), CartDrawer,
              ProductDetail, Toast, Footer
  scenes/     one component per chapter — each owns its scroll timeline
  styles/     tokens.css (design system), base.css, chrome.css, scenes.css
```

### Design decisions

- **One bottle, drawn once.** `BottleGraphic` is an SVG used by the bottle
  reveal, the pour scene, product cards, the cart and the detail view — the
  product never changes shape, only tone (glass, foil, label per wine).
- **Asset continuity.** Photography was curated per scene with verified
  subjects (`scripts/fetch-assets.mjs search|download`) and shares one grade
  (`.ph` + `.grade` overlay) so the whole site reads as one production.
- **Performance.** Canvases render only while visible; images are lazy,
  self-hosted WebP; JS is split (gsap / vendor / app); nothing animates
  off-screen.
- **Accessibility.** `prefers-reduced-motion` collapses the film into a
  readable still storyboard; dialogs are focus-managed with Esc + backdrop
  close; the cart and detail views are ARIA dialogs; skip link included.
- **Honest commerce.** Checkout is a demonstration state; the footer states
  that ORÉE is fictional.

## Rebranding

Everything identity-related lives in `src/data/brand.ts` and
`src/data/wines.ts` — name, region, story, the six wines with their tones.
The bottle, the palette and the type remain consistent automatically.

## Scroll films (image sequences)

Chapters 07 and 08 play real frame sequences, scrubbed by the scroll:

```
public/sequences/bottle/    frame-001.jpg … frame-250.jpg   (CH. 07)
public/sequences/pouring/   frame-001.jpg … frame-300.jpg   (CH. 08)
```

- Frames preload in playback order (10-at-a-time pool, ~10 MB total) and
  the player always draws the newest contiguous ready frame — early
  scrolling degrades gracefully instead of stuttering.
- Only repaints when the frame index changes; renders only while visible.
- `prefers-reduced-motion` shows a single deliberate still.
- To swap or extend a film: replace frames in the folder (zero-padded,
  sortable names) and run `npm run sequences` to regenerate the manifest.
