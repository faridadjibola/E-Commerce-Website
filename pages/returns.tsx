import type { NextPage } from 'next'

const Returns: NextPage = () => (
  <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 lg:px-12">
    <div className="mb-8">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">Refund &amp; Returns Policy</p>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">Refund &amp; Returns Policy</h1>
      <p className="mt-4 text-sm text-gray-500">Last Updated: August 29, 2026</p>
    </div>

    <div className="space-y-6 text-gray-700">
      <p className="text-base leading-7">
        At <span className="font-semibold text-gray-900">Tochiwears</span>, we value our customers and want you to be satisfied with your purchase. This Refund &amp; Returns Policy explains the conditions under which items may be returned, exchanged, or refunded.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">1. Eligibility for Returns</h2>
        <p className="text-base leading-7">You may request a return or exchange if:</p>
        <ul className="list-disc space-y-2 pl-6 text-base leading-7">
          <li>You received the wrong item.</li>
          <li>You received a damaged or defective item.</li>
          <li>The item you received is significantly different from what you ordered.</li>
          <li>Your item has an issue caused before delivery.</li>
        </ul>
        <p className="text-base leading-7">
          To be eligible, you must contact us within <span className="font-semibold text-gray-900">24 hours</span> of receiving your order.
        </p>
        <p className="text-base leading-7">
          Items must be returned in their original condition, unused, and with all original packaging where applicable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">2. Non-Returnable Items</h2>
        <p className="text-base leading-7">
          For hygiene, safety, or product-condition reasons, some items may not be eligible for return or refund if they have been used, damaged after delivery, or are no longer in their original condition.
        </p>
        <p className="text-base leading-7">Items may also be ineligible if:</p>
        <ul className="list-disc space-y-2 pl-6 text-base leading-7">
          <li>The item has been worn or used.</li>
          <li>The item was damaged due to misuse or improper handling after delivery.</li>
          <li>The return request is made after the specified return period.</li>
          <li>The original product has been altered or modified.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">3. Damaged or Incorrect Orders</h2>
        <p className="text-base leading-7">
          If you receive a damaged, defective, or incorrect item, please contact Tochiwears as soon as possible.
        </p>
        <p className="text-base leading-7">You may be asked to provide:</p>
        <ul className="list-disc space-y-2 pl-6 text-base leading-7">
          <li>Your order number</li>
          <li>Clear photographs or videos of the item</li>
          <li>A description of the issue</li>
        </ul>
        <p className="text-base leading-7">
          We will review your request and, where appropriate, offer a replacement, exchange, or refund.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">4. Refund Process</h2>
        <p className="text-base leading-7">
          Once we receive and inspect the returned item, we will notify you of the outcome of your refund request.
        </p>
        <p className="text-base leading-7">
          If your refund is approved, the refund will be processed through an appropriate method, which may include the original payment method or another agreed method where necessary.
        </p>
        <p className="text-base leading-7">
          Refund processing times may vary depending on your bank or payment provider.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">5. Exchanges</h2>
        <p className="text-base leading-7">
          Where an exchange is approved, we may replace the item with:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-base leading-7">
          <li>The same product, where available; or</li>
          <li>Another product of similar value, subject to agreement.</li>
        </ul>
        <p className="text-base leading-7">
          If there is a price difference, additional payment or a partial refund may apply.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">6. Delivery and Return Costs</h2>
        <p className="text-base leading-7">
          If the return is due to an error by Tochiwears, such as sending the wrong or defective item, we may cover the reasonable return or replacement delivery costs.
        </p>
        <p className="text-base leading-7">
          If the return is due to a change of mind or another reason not caused by Tochiwears, the customer may be responsible for applicable delivery or return costs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">7. Order Cancellation</h2>
        <p className="text-base leading-7">
          Orders may only be cancelled before they have been processed or dispatched.
        </p>
        <p className="text-base leading-7">
          Once an order has been dispatched, cancellation may no longer be possible. However, you may contact us to discuss available options.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">8. Contact Us</h2>
        <p className="text-base leading-7">
          If you have questions or would like to request a return, exchange, or refund, please contact us using the contact details provided on the <span className="font-semibold text-gray-900">Tochiwears</span> website.
        </p>
        <p className="text-base leading-7">
          Please include your order number and relevant details to help us process your request promptly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">9. Changes to This Policy</h2>
        <p className="text-base leading-7">
          Tochiwears reserves the right to update this Refund &amp; Returns Policy at any time. Any changes will be posted on this page with an updated revision date.
        </p>
      </section>
    </div>
  </div>
)

export default Returns
