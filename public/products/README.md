# Product photo uploads

The selected stock images are currently saved as `main.webp` in each product folder. Replace any stock photo with your own product photo by adding `main.jpg`; JPEG, PNG, and WebP are all accepted. Optional additional angles are `2.jpg` and `3.jpg`. The paths below are relative to `public/`.

Requirements: genuine product photos where available; otherwise royalty-free Pexels photos. Do not hotlink images. Each file must be no larger than 2 MB and at least 800 x 800 pixels. Square or 4:5 crops work best; resize originals to a maximum width of 1600 pixels before adding them. The local seed fallback is `/products/placeholder.svg` until a valid primary image is uploaded.

Run `npm run download:stock-images` to download and optimize the 24 selected Pexels examples into the `main.webp` files. This is a local setup helper; it fetches from Pexels, strips embedded metadata through re-encoding, and records photo descriptions/source links in `scripts/stock-images.json`. Stock photography is illustrative and does not verify the exact item, color, material, or features in your inventory. Replace any inaccurate stock file with your own item photo using the same `main` name.
Run `npm run check:images` to report missing and invalid files. Then run `npm run seed:products` again after adding images so product records point to their local photo paths.

## Expected files

```text
products/street-canvas-web-belt/main.webp
products/street-canvas-web-belt/2.jpg
products/street-canvas-web-belt/3.jpg
products/tactical-quick-release-belt/main.webp
products/tactical-quick-release-belt/2.jpg
products/tactical-quick-release-belt/3.jpg
products/silver-chain-belt/main.webp
products/silver-chain-belt/2.jpg
products/silver-chain-belt/3.jpg
products/oversized-buckle-leather-belt/main.webp
products/oversized-buckle-leather-belt/2.jpg
products/oversized-buckle-leather-belt/3.jpg
products/studded-edge-belt/main.webp
products/studded-edge-belt/2.jpg
products/studded-edge-belt/3.jpg
products/braided-stretch-belt/main.webp
products/braided-stretch-belt/2.jpg
products/braided-stretch-belt/3.jpg
products/cuban-link-chain/main.webp
products/cuban-link-chain/2.jpg
products/cuban-link-chain/3.jpg
products/layered-gold-necklace-set/main.webp
products/layered-gold-necklace-set/2.jpg
products/layered-gold-necklace-set/3.jpg
products/stackable-signet-ring-set/main.webp
products/stackable-signet-ring-set/2.jpg
products/stackable-signet-ring-set/3.jpg
products/chunky-chain-bracelet/main.webp
products/chunky-chain-bracelet/2.jpg
products/chunky-chain-bracelet/3.jpg
products/dog-tag-pendant-necklace/main.webp
products/dog-tag-pendant-necklace/2.jpg
products/dog-tag-pendant-necklace/3.jpg
products/hoop-earrings-duo/main.webp
products/hoop-earrings-duo/2.jpg
products/hoop-earrings-duo/3.jpg
products/oversized-square-shades/main.webp
products/oversized-square-shades/2.jpg
products/oversized-square-shades/3.jpg
products/retro-shield-sunglasses/main.webp
products/retro-shield-sunglasses/2.jpg
products/retro-shield-sunglasses/3.jpg
products/rimless-tinted-shades/main.webp
products/rimless-tinted-shades/2.jpg
products/rimless-tinted-shades/3.jpg
products/classic-wayfarer-frames/main.webp
products/classic-wayfarer-frames/2.jpg
products/classic-wayfarer-frames/3.jpg
products/clear-lens-fashion-frames/main.webp
products/clear-lens-fashion-frames/2.jpg
products/clear-lens-fashion-frames/3.jpg
products/blue-light-block-glasses/main.webp
products/blue-light-block-glasses/2.jpg
products/blue-light-block-glasses/3.jpg
products/oversized-chronograph-watch/main.webp
products/oversized-chronograph-watch/2.jpg
products/oversized-chronograph-watch/3.jpg
products/minimalist-leather-watch/main.webp
products/minimalist-leather-watch/2.jpg
products/minimalist-leather-watch/3.jpg
products/retro-digital-watch/main.webp
products/retro-digital-watch/2.jpg
products/retro-digital-watch/3.jpg
products/skeleton-automatic-watch/main.webp
products/skeleton-automatic-watch/2.jpg
products/skeleton-automatic-watch/3.jpg
products/rose-gold-dress-watch/main.webp
products/rose-gold-dress-watch/2.jpg
products/rose-gold-dress-watch/3.jpg
products/matte-black-tactical-watch/main.webp
products/matte-black-tactical-watch/2.jpg
products/matte-black-tactical-watch/3.jpg
```