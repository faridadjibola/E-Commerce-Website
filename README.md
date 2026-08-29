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
