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
          <div className="mt-3 flex items-center gap-3">
            <a href="https://www.instagram.com/tochi_wears?igsh=YWczeDE4M2E2YzEx&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition duration-200 hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40">
              <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-current" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.1-3.2a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@tochiwears?_r=1&_d=f31e5k26cm227e&sec_uid=MS4wLjABAAAA94C_V0FOmwpmCp6vAxO6EMpiKfwCUanklZT_-OKVeGR7mL-UGz53mZx7E8GOx4SP&share_author_id=7501675187046761527&sharer_language=en&source=h5_m&u_code=ek74l5c24hldef&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=4918F45B-528E-488A-8334-623401DFA6DE&user_id=7501675187046761527&sec_user_id=MS4wLjABAAAA94C_V0FOmwpmCp6vAxO6EMpiKfwCUanklZT_-OKVeGR7mL-UGz53mZx7E8GOx4SP&social_share_type=4&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="group flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition duration-200 hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40">
              <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-current" aria-hidden="true">
                <path d="M14.5 3c.55 1.55 1.76 2.7 3.47 3.07v2.42a6.03 6.03 0 0 1-3.47-1v6.68a4.69 4.69 0 1 1-4.69-4.69c.26 0 .52.02.77.08v2.57a2.13 2.13 0 1 0 1.36 2.05V3h2.56Z"/>
              </svg>
            </a>
            <a href="https://wa.me/message/HLJIV7IE6GKAG1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition duration-200 hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50">
              <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.149-.67.149-.198.297-.768.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347Z"/>
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
