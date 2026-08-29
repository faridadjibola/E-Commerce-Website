import type { NextPage } from 'next'

const Shipping: NextPage = () => (
  <div className="max-w-3xl mx-auto space-y-4">
    <h1 className="text-3xl font-semibold">Shipping Information</h1>
    <p className="text-gray-700">
      We offer nationwide delivery across Nigeria. Orders are processed within 24 hours and shipped via trusted logistics partners.
    </p>
    <ul className="list-disc pl-6 text-gray-700 space-y-2">
      <li>Standard delivery takes 3–7 business days.</li>
      <li>Express delivery is available in selected cities.</li>
      <li>Shipping costs are calculated during checkout.</li>
      <li>All deliveries include tracking information once dispatched.</li>
    </ul>
  </div>
)

export default Shipping
