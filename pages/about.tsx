import { NextPage } from 'next'
import PageMeta from '../components/PageMeta'

const About: NextPage = () => (
  <div>
    <PageMeta title="About Tochiwears" description="Learn about Tochiwears, our curated accessories, and our commitment to quality and style." canonicalPath="/about" />
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 lg:px-12">
      <div className="mb-10 max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-gray-500">About us</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl">We create everyday essentials that elevate personal style.</h1>
      </div>

      <div className="space-y-8 text-gray-700">
      <p className="text-lg leading-8">
        At Tochiwears, we believe accessories are more than finishing touches — they are expressions of identity, confidence, and taste.
        We curate modern, premium pieces that help people look polished, feel elevated, and move through daily life with intention.
      </p>

      <p className="text-base leading-7 md:text-lg">
        From watches and jewelry to belts, glasses, and refined everyday essentials, our collections are selected for quality, versatility,
        and timeless appeal. We focus on pieces that blend functionality with craftsmanship, giving customers a smarter way to build a wardrobe that feels both elegant and effortless.
      </p>

      <div className="grid gap-5 pt-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Quality first</h2>
          <p className="text-sm leading-6 text-gray-600">
            We source and present stylish accessories designed to deliver lasting value, durability, and everyday wearability.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Thoughtful curation</h2>
          <p className="text-sm leading-6 text-gray-600">
            Each product is chosen to meet a modern standard of taste, practicality, and versatility across a wide range of lifestyles.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Customer care</h2>
          <p className="text-sm leading-6 text-gray-600">
            We are committed to a smooth, reliable shopping experience and responsive support from order to delivery.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <p className="text-base leading-7 md:text-lg">
          Our mission is simple: to make premium accessories accessible, stylish, and easy to shop for. We serve customers who value quality, confidence,
          and a more elevated standard in the way they present themselves every day.
        </p>
      </div>
      </div>
    </div>
  </div>
)

export default About
