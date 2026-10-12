import { NextPage } from 'next'

const faqs = [
  { q: 'How long does delivery take?', a: 'Delivery usually takes 3–7 business days within Nigeria, depending on your location and selected courier service.' },
  { q: 'Can I return an item?', a: 'Yes, eligible items can be returned within 7 days of delivery if they are unused and in their original packaging.' },
  { q: 'Do you offer cash on delivery?', a: 'Selected areas may support cash on delivery, while other orders can be paid through bank transfer, card, or mobile payment options.' },
  { q: 'Do you ship outside Nigeria?', a: 'Currently, we focus on local delivery within Nigeria. International shipping may be available later.' },
]

const FAQ: NextPage = () => (
  <div className="max-w-3xl mx-auto">
    <h1 className="text-3xl font-semibold mb-6">FAQ</h1>
    <div className="space-y-4">
      {faqs.map((item) => (
        <div key={item.q} className="border rounded p-4">
          <h3 className="font-semibold">{item.q}</h3>
          <p className="text-gray-600 mt-2">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
)

export default FAQ
