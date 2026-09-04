# archive/

Code that is no longer wired into any running app, kept because it may be
worth bringing back. Nothing in here is built, type-checked, or shipped —
it sits outside every app's project root on purpose.

## archive/landing-page/

Orphaned when the NFC My Place landing page (`landing-page/app/page.tsx`)
was rewritten: the new page renders a different component set, so these
stopped being reachable from any route. They were verified as a closed
island — they only import each other, and nothing live imports them.

| File | What it was |
|---|---|
| `components/Stand3D.tsx` | react-three-fiber 3D acrylic L-Stand, real bent-profile geometry (75° face, 105° arc sweep) with a canvas-drawn decal |
| `components/StickerSection.tsx` | NFC/QR table-sticker customizer: material switch, quantity tiers, live price |
| `components/nfc-showcase.tsx` | Section wrapping the 3D stand + sticker customizer |
| `components/canvas/*` | Scene objects, lighting rig and an alternative L-Stand model |
| `components/SignupForm.tsx` | Klaviyo client-subscription email capture (24h countdown, TR/EN) |
| `components/RestaurantShowcase.tsx` | Live tenant-menu showcase, fetched from the backend |
| `components/DiscountModal.tsx` | Timed discount-code modal |
| `components/AmbientNfcWaves.tsx` | Scroll-driven ambient background |
| `lib/translations.ts` | TR/EN strings for the components above |
| `lib/live-demo.ts` | `LiveDemoItem` type shared by the showcase + sticker section |

### Restoring one

Move the file back under `landing-page/`, keeping the same relative path
(`components/…`, `lib/…`), then import it from a route. The three.js
dependencies (`three`, `@react-three/fiber`, `@react-three/drei`,
`@types/three`) are still declared in `landing-page/package.json`, so the
3D pieces work again as-is.
