# SRINBAR logo assets

Transparent PNGs generated with the built-in imagegen tool from the three supplied logo images:

- `public/brand/srinbar-full.png`: full logo for the browser icon and Open Graph preview.
- `public/brand/srinbar-symbol.png`: header symbol.
- `public/brand/srinbar-wordmark.png`: animated header text.

The original source images remain unchanged. The wordmark fades in and moves from the right after a 450 ms delay over 700 ms. It plays once on the first navbar mount per page load; navigating between routes does not replay it. A full browser reload allows it to play again. Reduced-motion preferences disable the animation. The Open Graph route places the full logo on a warm background at 1200 × 630 for social previews. Set `NEXT_PUBLIC_SITE_URL` to the production origin if it differs from `https://srinbar.org`.

## Prompt used for each image

Use case: background-extraction. Edit the supplied SRINBAR logo only to remove the white/off-white background and make it genuinely transparent, including white gaps around and within the artwork. Preserve EXACT artwork, shapes, colors, letterforms, spelling, spacing, and aspect ratio; do not redesign, redraw, add shadows or alter details. Crop excess transparent outer padding closely but do not clip any artwork. Output a transparent PNG.
