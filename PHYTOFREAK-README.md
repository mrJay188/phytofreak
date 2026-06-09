# PhytoFreak Shopify Theme — Quick Setup

## Upload & publish

1. Zip the entire `theme/` folder (not the parent project).
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip**.
3. Click **Publish** on the uploaded theme.
4. Hard-refresh the storefront (Ctrl+Shift+R).

## CSS (no Dawn, no CDN)

The theme loads **only**:

- `tailwind-full.css` — compiled from all HTML templates + sections (run `npm run build:css` in `theme/` after class changes)
- `custom.css` — your original design system (unchanged)
- `shopify-shell.css` — minimal Shopify wrapper reset

Dawn `base.css` is **not** loaded.

## Dynamic content checklist

| What | How |
|------|-----|
| **Products on homepage** | Add products in Admin → Products. Featured section auto-shows from **All products** (or pick a collection in theme editor). |
| **Navigation** | Admin → **Content → Menus** → assign **main-menu** to header (fallback links show if empty). |
| **Product tabs** | Tab headings auto-pull from product: **Description** → product description; **Feeding Guide** → metafield `custom.feeding_guide`; **Ingredients** → `custom.ingredients`; etc. |
| **Product badges** | Metafield `custom.badge` on each product (optional). |
| **Bundle section** | Auto-shows other products from the same collection, or add product blocks manually. |
| **Images** | Upload in theme editor, or use built-in Pexels/Unsplash fallbacks until you upload. |

## Product metafields (Settings → Custom data → Products)

Create these **rich text** metafields in namespace `custom`:

- `feeding_guide`
- `ingredients`
- `storage`
- `shipping`
- `faq`
- `badge` (single line text)
- `tagline` (single line text)

## Rebuild Tailwind after edits

```bash
cd theme
npm install
npm run build:css
```

Then re-upload the theme zip.
