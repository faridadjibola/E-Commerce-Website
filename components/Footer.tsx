import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Customer Service</h4>
          <ul className="text-sm space-y-2">
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/shipping">Shipping Information</Link></li>
            <li><Link href="/returns">Returns & Refunds</Link></li>
            <li><Link href="/tracking">Order Tracking</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="text-sm space-y-2">
            <li><Link href="/men">Men</Link></li>
            <li><Link href="/women">Women</Link></li>
            <li><Link href="/jewelry">Jewelry</Link></li>
            <li><Link href="/belts">Belts</Link></li>
            <li><Link href="/watches">Wristwatches</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="text-sm space-y-2">
            <li><Link href="/about">About Tochiwears</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm">Phone: 09027951472</p>
          <div className="flex items-center gap-3 mt-3">
            <a href="https://www.instagram.com/tochi_wears?igsh=YWczeDE4M2E2YzEx&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.1-3.2a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@tochiwears?_r=1&_d=f31e5k26cm227e&sec_uid=MS4wLjABAAAA94C_V0FOmwpmCp6vAxO6EMpiKfwCUanklZT_-OKVeGR7mL-UGz53mZx7E8GOx4SP&share_author_id=7501675187046761527&sharer_language=en&source=h5_m&u_code=ek74l5c24hldef&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=4918F45B-528E-488A-8334-623401DFA6DE&user_id=7501675187046761527&sec_user_id=MS4wLjABAAAA94C_V0FOmwpmCp6vAxO6EMpiKfwCUanklZT_-OKVeGR7mL-UGz53mZx7E8GOx4SP&social_share_type=4&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233" target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M14.5 3c.55 1.55 1.76 2.7 3.47 3.07v2.42a6.03 6.03 0 0 1-3.47-1v6.68a4.69 4.69 0 1 1-4.69-4.69c.26 0 .52.02.77.08v2.57a2.13 2.13 0 1 0 1.36 2.05V3h2.56Z"/>
              </svg>
            </a>
            <a href="https://wa.me/message/HLJIV7IE6GKAG1" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white transition hover:bg-green-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M19.05 4.95A9.9 9.9 0 0 0 12 2a9.9 9.9 0 0 0-7.05 16.95L2 22l3.2-1.02A9.9 9.9 0 0 0 12 22a9.9 9.9 0 0 0 7.05-16.95ZM12 19.4a8.1 8.1 0 0 1-4.1-1.12l-.29-.17-1.9.61.63-1.85-.19-.3A8.1 8.1 0 1 1 12 19.4Zm4.46-6.15c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.07 3.58.57.25 1.02.4 1.37.51.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-4 text-sm text-center">
          © 2026 Tochiwears. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
