# Tochiwears

Tochiwears is a Nigerian fashion accessories storefront built with Next.js, React, TypeScript, and Tailwind CSS. Customers can browse collections, manage a cart, place orders, create accounts, and track their purchases. The project also includes an admin area for managing products and orders.

## Features

- Responsive storefront with home, shop, category, and product pages
- Jewelry, watches, belts, and glasses collections
- Cart and checkout experience with Nigerian naira pricing
- Credentials-based authentication with NextAuth.js
- Customer accounts, order history, and order tracking
- Admin product and order management pages
- API routes for products, carts, orders, authentication, uploads, and payments
- Payment flow placeholders for Paystack, Moniepoint, card, and bank transfer
- OpenAPI reference in [`openapi.yaml`](openapi.yaml)

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/faridadjibola/E-Commerce-Website.git
cd E-Commerce-Website
npm install
```

Create a `.env.local` file for local configuration when needed:

```env
NEXTAUTH_SECRET=replace-with-a-local-secret
ADMIN_EMAIL=admin@tochiwears.ng
NEXT_PUBLIC_API_BASE=
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run Next.js lint checks |
| `npm run check:images` | Validate local photos for the 24 catalog additions |
| `npm run seed:products` | Upsert the 24 products into the local JSON catalog |

### Product catalog and images

The current app has no database. Seeded products are persisted in `lib/seeded-products.json`; run `npm run seed:products` after editing `scripts/products.seed.json`. The script refuses to run with `NODE_ENV=production` unless `--allow-prod` is explicitly passed. Missing photos use `/products/placeholder.svg` until a valid local primary image is uploaded.

See [`public/products/README.md`](public/products/README.md) for all expected photo paths and validation limits. The existing product list still contains legacy Unsplash images, so `images.unsplash.com` remains configured in `next.config.js`; the 24 new seed records use local paths only.

Admin image uploads are stored in Vercel Blob, not the deployment filesystem. Configure `BLOB_READ_WRITE_TOKEN` in `.env.local` for local admin uploads and in deployment secrets for production. Uploads are checked by file signature, capped at 2 MB, and must be at least 800 x 800 pixels.

## Project Structure

```text
components/  Shared UI components
lib/         Client helpers and product, user, and order logic
pages/       Storefront pages and API routes
public/      Static assets
styles/      Global CSS
types/       Shared TypeScript types
```

## Development Notes

Several data and payment integrations are intentionally implemented as local/demo flows. Before deploying to production, connect the API routes to a persistent database, configure real payment-provider credentials, validate webhook signatures, and set secure authentication secrets.

## License

This project is private and intended for the Tochiwears storefront.
