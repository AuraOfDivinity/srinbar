# SRINBAR logo assets

Transparent PNG source logos and lossless WebP serving copies:

- `public/brand/srinbar-full.webp`: full logo for the browser icon and Open Graph preview.
- `public/brand/srinbar-symbol.webp`: header symbol.
- `public/brand/srinbar-wordmark.webp`: animated header text.
- The matching PNG files are retained as source assets.

The original source images remain unchanged. The wordmark fades in and moves from the right after a 450 ms delay over 700 ms. It plays once on the first navbar mount per page load; navigating between routes does not replay it. A full browser reload allows it to play again. Reduced-motion preferences disable the animation. The Open Graph route places the full logo on a warm background at 1200 × 630 for social previews. Set `NEXT_PUBLIC_SITE_URL` to the production origin if it differs from `https://srinbar.com`.

## Prompt used for each image

Use case: background-extraction. Edit the supplied SRINBAR logo only to remove the white/off-white background and make it genuinely transparent, including white gaps around and within the artwork. Preserve EXACT artwork, shapes, colors, letterforms, spelling, spacing, and aspect ratio; do not redesign, redraw, add shadows or alter details. Crop excess transparent outer padding closely but do not clip any artwork. Output a transparent PNG.
