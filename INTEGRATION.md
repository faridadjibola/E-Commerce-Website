# Tochiwears Frontend Integration Guide

This document provides a concise contract for backend engineers integrating with the Tochiwears frontend.

Base URL
- Frontend expects backend endpoints under the same origin (relative paths) or set `NEXT_PUBLIC_API_BASE` to the API root.

Auth
- Registration: POST `/api/auth/register` with `{ name, email, password }` -> returns user.
- Sign-in: frontend uses `next-auth` credentials provider (client side `signIn('credentials', { email, password })`). Backend should support authentication or the team can switch NextAuth to a DB adapter.

Products
- GET `/api/products` -> list of products
- GET `/api/products/{slug}` -> single product

Cart
- GET `/api/cart` -> returns cart items for session/user
- POST `/api/cart` -> `{ productId, quantity }` adds item
- DELETE `/api/cart?productId=...` -> removes item

Orders
- POST `/api/orders` -> accepts `CreateOrderRequest` (see `openapi.yaml`) and returns created order with `id` and `status`.
- GET `/api/orders/{id}` -> order details

Payments (Moniepoint, Bank Transfer, Card)
- Moniepoint: POST `/api/payments/moniepoint/initiate` with `{ amount, email }` -> returns `{ reference, authorization_url }` to redirect the customer for payment.
- Card: POST `/api/payments/card/initiate` with `{ amount, email }` -> returns `{ reference, authorization_url }` for 3DS or hosted checkout.
- Bank Transfer: POST `/api/payments/bank/initiate` with `{ amount, email }` -> returns bank instructions: `{ reference, account_number, account_name, bank_name }` for customer to pay via bank transfer.
- Webhooks: implement webhook endpoints for your chosen providers (e.g. `/api/payments/moniepoint/webhook`, `/api/payments/card/webhook`, `/api/payments/bank/webhook`) and verify signatures according to provider docs.

Notes:
- Amounts: agreed convention is to use the smallest currency unit (kobo) for NGN when required by providers; document per-provider.
- The frontend will open `authorization_url` in the same tab for redirect flows. For bank transfers, the frontend will display bank details and poll order/payment status.

Security & Data
- Use cookies or JWT for authenticated endpoints. Frontend currently uses `next-auth` JWT session strategy.
- Return consistent error shapes: `{ error: 'message' }` and proper HTTP status codes.

Helpful examples
- Initialize Paystack (server-side): call Paystack initialize endpoint with `amount` (in kobo if using NGN), `email`, return `authorization_url` to frontend.

Example cURL (register):

```bash
curl -X POST https://api.tochiwears.ng/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret"}'
```

OpenAPI
- Full contract available at `openapi.yaml` in the repo root. Use it to generate client SDKs or server stubs.

Contact
- If you have questions about payloads or want a sample seed DB, ping the frontend owner.

Newsletter
- Configure `NEWSLETTER_WEBHOOK_URL` with a trusted server-side endpoint that accepts `POST` JSON `{ email, source }` and returns a 2xx response after recording the subscription.
- Optionally configure `NEWSLETTER_WEBHOOK_API_KEY`; it is sent as a Bearer token and is never exposed to the browser.
