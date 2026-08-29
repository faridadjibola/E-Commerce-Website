import { NextPage } from 'next'

const Contact: NextPage = () => (
  <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 lg:px-12">
    <h1 className="mb-10 text-[1.1rem] font-bold tracking-[0.12em] text-gray-900 md:text-[1.35rem]">CONTACT</h1>

    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-800 text-gray-900">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M20.5 16.5a2.6 2.6 0 0 1-2.6 2.6c-.33 0-.65-.05-.96-.15a15.6 15.6 0 0 1-6.8-3.5A15.7 15.7 0 0 1 6.6 9.1c-.1-.31-.15-.63-.15-.96A2.6 2.6 0 0 1 9 5.5h1.7a.8.8 0 0 1 .8.7l.7 3.2a.8.8 0 0 1-.22.74L10.8 11a13.3 13.3 0 0 0 5.7 5.7l.8-.9a.8.8 0 0 1 .74-.22l3.2.7a.8.8 0 0 1 .7.8V16.5Z"/>
          </svg>
        </div>

        <div className="space-y-1">
          <a href="https://wa.me/2349027951472" target="_blank" rel="noreferrer" className="block text-[1.05rem] font-medium text-gray-900 transition hover:text-gray-700 md:text-[1.15rem]">
            WhatsApp
          </a>
          <a href="tel:+2349027951472" className="block text-[0.96rem] text-gray-700 transition hover:text-gray-900">
            09027951472
          </a>
          <a href="https://wa.me/2349027951472" target="_blank" rel="noreferrer" className="block text-[0.82rem] text-gray-600 transition hover:text-gray-900">
            Chat with us on WhatsApp
          </a>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-800 text-gray-900">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.4 1.1 5.6 4.2 5.6-4.2v-.2a.6.6 0 0 0-.6-.6h-11a.6.6 0 0 0-.6.6v.2Zm11.2 9.4V8.7l-5.3 4a1 1 0 0 1-1.2 0l-5.3-4v8.3a.6.6 0 0 0 .6.6h11a.6.6 0 0 0 .6-.6Z"/>
          </svg>
        </div>

        <div className="space-y-1">
          <div className="text-[1.05rem] font-medium text-gray-900 md:text-[1.15rem]">Email</div>
          <a href="mailto:hello@tochiwears.com" className="block text-[0.96rem] text-gray-700 transition hover:text-gray-900">
            hello@tochiwears.com
          </a>
          <div className="text-[0.82rem] text-gray-600">We reply within 24hrs</div>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-800 text-gray-900">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M12 2a7 7 0 0 1 7 7c0 4.8-6.2 11.9-6.5 12.2a1 1 0 0 1-1.4 0C11.2 20.9 5 13.8 5 9a7 7 0 0 1 7-7Zm0 9.8A2.8 2.8 0 1 0 9.2 9 2.8 2.8 0 0 0 12 11.8Z"/>
          </svg>
        </div>

        <div className="space-y-1">
          <div className="text-[1.05rem] font-medium text-gray-900 md:text-[1.15rem]">Address</div>
          <div className="text-[0.96rem] text-gray-700">Lagos, Nigeria (Online Store)</div>
        </div>
      </div>
    </div>
  </div>
)

export default Contact
