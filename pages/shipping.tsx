import type { NextPage } from 'next'

const Shipping: NextPage = () => (
  <div className="max-w-3xl mx-auto space-y-4">
    <h1 className="text-3xl font-semibold">Shipping Information</h1>
    <p className="text-gray-700">
      We offer nationwide delivery across Nigeria, with fast dispatch from Lagos and reliable coverage to major cities including Abuja, Port Harcourt, Ibadan, Kano, Enugu, and beyond.
    </p>
    <ul className="list-disc pl-6 text-gray-700 space-y-2">
      <li>Standard delivery typically takes 3–7 business days within Nigeria.</li>
      <li>Express delivery is available in selected cities for faster arrival.</li>
      <li>Shipping cost is calculated during checkout based on your location.</li>
      <li>All orders include tracking details once dispatched.</li>
    </ul>
  </div>
)

export default Shipping
