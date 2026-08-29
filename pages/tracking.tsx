import type { NextPage } from 'next'

const Tracking: NextPage = () => (
  <div className="max-w-3xl mx-auto space-y-4">
    <h1 className="text-3xl font-semibold">Order Tracking</h1>
    <p className="text-gray-700">
      Once your order is shipped, you will receive a tracking number and delivery update by email or SMS.
    </p>
    <div className="border rounded p-5 bg-gray-50">
      <p className="font-medium">Need to check the status of your order?</p>
      <p className="text-sm text-gray-600 mt-2">Please contact our support team with your order number and email address.</p>
    </div>
  </div>
)

export default Tracking
