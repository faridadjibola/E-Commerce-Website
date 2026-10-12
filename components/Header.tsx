import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthProvider'
import { useCart } from './CartProvider'
import SearchBar from './SearchBar'

const collectionLinks = [
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Jewelry', href: '/jewelry' },
  { label: 'Watches', href: '/watches' },
  { label: 'Belts', href: '/belts' },
  { label: 'Glasses', href: '/glasses' },
]

const Header = () => {
  const router = useRouter()
  const auth = useAuth()
  const { items } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const currentPath = router.asPath.split('?')[0].replace(/\/$/, '') || '/'
  const isAdmin = auth.user?.role === 'admin'

  useEffect(() => {
    const updateShadow = () => setScrolled(window.scrollY > 2)
    updateShadow()
    window.addEventListener('scroll', updateShadow, { passive: true })
    return () => window.removeEventListener('scroll', updateShadow)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
      if (event.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus())
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [drawerOpen])

  function closeDrawer() {
    setDrawerOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  function handleLinkKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === 'Enter' || event.key === ' ') closeDrawer()
  }

  const linkClass = (href: string, drawer = false) => {
    const active = currentPath === href || (href !== '/' && currentPath.startsWith(`${href}/`))
    return `${drawer ? 'flex min-h-11 items-center rounded-md px-3 text-sm' : 'rounded-md px-3 py-2 text-[13px]'} whitespace-nowrap font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-gray-900/30 ${active ? 'bg-gray-100 text-gray-950' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-950'}`
  }

  return (
    <header className={`sticky top-0 z-50 border-b border-gray-200 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-none'}`}>
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between gap-2 px-4 sm:px-5 md:justify-start md:gap-4 lg:h-[72px] lg:gap-6 lg:px-8">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setDrawerOpen((value) => !value)}
          className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center justify-self-start rounded-lg text-gray-900 outline-none transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-900/40 md:hidden"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {drawerOpen ? <X size={22} strokeWidth={1.8} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.8} aria-hidden="true" />}
        </button>

        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 rounded outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30" aria-label="Tochiwears home">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-950" aria-hidden="true">
            <Image src="/tochiwears logo.jpeg" alt="" width={78} height={47} priority className="absolute left-1/2 top-1/2 h-[47px] w-[78px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover" />
          </span>
          <span className="whitespace-nowrap text-base font-bold text-neutral-950 lg:text-lg">Tochiwears</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex">
          <Link href="/" aria-current={currentPath === '/' ? 'page' : undefined} className={linkClass('/')}>Home</Link>
          <Link href="/shop" aria-current={currentPath === '/shop' ? 'page' : undefined} className={linkClass('/shop')}>Shop</Link>
          <div className="group relative">
            <button type="button" className={`${linkClass('/collections')} inline-flex items-center gap-1`} aria-haspopup="true" aria-expanded={collectionsOpen} onClick={() => setCollectionsOpen((value) => !value)} onBlur={(event) => { if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node)) setCollectionsOpen(false) }}>
              Collections <ChevronDown size={15} aria-hidden="true" className={`transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`${collectionsOpen ? 'block' : 'hidden group-hover:block group-focus-within:block'} absolute left-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg`}>
              {collectionLinks.map((item) => <Link key={item.href} href={item.href} aria-current={currentPath === item.href ? 'page' : undefined} onClick={() => setCollectionsOpen(false)} className="flex min-h-10 items-center rounded-md px-3 text-sm text-gray-700 outline-none hover:bg-gray-50 hover:text-gray-950 focus-visible:bg-gray-50">{item.label}</Link>)}
            </div>
          </div>
          <Link href="/about" aria-current={currentPath === '/about' ? 'page' : undefined} className={linkClass('/about')}>About</Link>
          <Link href="/contact" aria-current={currentPath === '/contact' ? 'page' : undefined} className={linkClass('/contact')}>Contact</Link>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-[4px] md:gap-2">
          <div className="hidden lg:block">
            <SearchBar className="group w-[176px] transition-[width] duration-300 ease-out focus-within:w-[320px]" inputClassName="h-10" compact />
          </div>

          {auth.user && <div className="relative hidden md:block">
            <button type="button" onClick={() => setAccountOpen((value) => !value)} className="inline-flex h-10 max-w-36 items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-800 outline-none transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/30" aria-expanded={accountOpen} aria-haspopup="menu">
              <UserRound size={17} aria-hidden="true" /><span className="truncate">{auth.user.name?.split(' ')[0] || 'Account'}</span><ChevronDown size={14} aria-hidden="true" />
            </button>
            {accountOpen && <div role="menu" className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
              <Link role="menuitem" href="/account" onClick={() => setAccountOpen(false)} className="flex min-h-10 items-center rounded-md px-3 text-sm text-gray-800 hover:bg-gray-50">Profile</Link>
              <Link role="menuitem" href="/account/orders" onClick={() => setAccountOpen(false)} className="flex min-h-10 items-center rounded-md px-3 text-sm text-gray-800 hover:bg-gray-50">My Orders</Link>
              {isAdmin && <Link role="menuitem" href="/admin" onClick={() => setAccountOpen(false)} className="flex min-h-10 items-center rounded-md px-3 text-sm text-gray-800 hover:bg-gray-50">Admin</Link>}
              <button role="menuitem" type="button" onClick={() => auth.logout()} className="flex min-h-10 w-full items-center whitespace-nowrap rounded-md px-3 text-left text-sm text-gray-800 hover:bg-gray-50">Logout</button>
            </div>}
          </div>}

          {!auth.user && !auth.loading && <div className="hidden items-center gap-2 md:flex">
            <Link href="/auth/signin" className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-900 outline-none transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/30">Sign in</Link>
            <Link href="/register" className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-neutral-950 px-3 text-sm font-semibold text-white outline-none transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-gray-900/40">Register</Link>
          </div>}

          <button type="button" onClick={() => setMobileSearchOpen((value) => !value)} className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg text-gray-900 outline-none transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-900/40 lg:hidden" aria-label="Search" aria-expanded={mobileSearchOpen} aria-controls="mobile-search-row">
            <Search size={20} aria-hidden="true" />
          </button>

          <Link href="/cart" className="relative inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg text-gray-900 outline-none transition hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-900/40" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.8} aria-hidden="true" />
            {itemCount > 0 && <span aria-hidden="true" className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-950 px-1 text-[10px] font-semibold leading-none text-white">{itemCount > 99 ? '99+' : itemCount}</span>}
          </Link>
        </div>
      </div>

      <div id="mobile-search-row" className={`${mobileSearchOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid overflow-hidden border-t border-gray-200 bg-white transition-[grid-template-rows] duration-200 lg:hidden`}>
        <div className="min-h-0">
          <div className="mx-auto max-w-[1280px] px-4 py-3 sm:px-5">
            <SearchBar className="w-full" inputClassName="h-11" />
          </div>
        </div>
      </div>

      <div className={`md:hidden ${drawerOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <button type="button" tabIndex={drawerOpen ? 0 : -1} aria-label="Close menu overlay" onClick={closeDrawer} className={`site-drawer-overlay fixed inset-x-0 bottom-0 top-[64px] z-40 bg-black/40 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside id="mobile-navigation-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Main menu" aria-hidden={!drawerOpen} className={`site-drawer fixed bottom-0 left-0 top-[64px] z-50 flex w-[min(86vw,360px)] flex-col border-r border-gray-200 bg-white pb-[max(16px,env(safe-area-inset-bottom))] shadow-xl ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            {auth.user ? <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-800"><UserRound size={20} aria-hidden="true" /></span>
              <span className="min-w-0"><span className="block truncate text-sm font-semibold text-gray-950">{auth.user.name || 'Your account'}</span><span className="block truncate text-xs text-gray-500">{auth.user.email}</span></span>
            </div> : <span className="text-sm font-semibold text-gray-900">Your account</span>}
            <button type="button" onClick={closeDrawer} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-700 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-900/30" aria-label="Close menu"><X size={21} aria-hidden="true" /></button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {auth.user ? <div className="mb-4 grid gap-2">
              <Link href="/account" onClick={closeDrawer} className="flex min-h-11 items-center whitespace-nowrap rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-800 outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/30">Profile</Link>
              <Link href="/account/orders" onClick={closeDrawer} className="flex min-h-11 items-center whitespace-nowrap rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-800 outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/30">My Orders</Link>
              {isAdmin && <Link href="/admin" onClick={closeDrawer} className="flex min-h-11 items-center whitespace-nowrap rounded-lg bg-neutral-950 px-3 text-sm font-semibold text-white outline-none hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-gray-900/40">Admin</Link>}
              <button type="button" onClick={() => { closeDrawer(); void auth.logout() }} className="flex min-h-11 w-full items-center whitespace-nowrap rounded-lg border border-gray-200 px-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/30">Logout</button>
            </div> : !auth.loading && <div className="mb-4 grid gap-2">
              <Link href="/auth/signin" onClick={closeDrawer} className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-900 outline-none transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-900/30">Sign in</Link>
              <Link href="/register" onClick={closeDrawer} className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white outline-none transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-gray-900/40">Register</Link>
            </div>}

            <div className="mb-4">
              <SearchBar className="w-full" inputClassName="h-11" onResultSelect={closeDrawer} />
            </div>

            <nav aria-label="Mobile navigation" className="grid gap-1">
              <Link href="/" onClick={closeDrawer} onKeyDown={handleLinkKeyDown} aria-current={currentPath === '/' ? 'page' : undefined} className={linkClass('/', true)}>Home</Link>
              <Link href="/shop" onClick={closeDrawer} onKeyDown={handleLinkKeyDown} aria-current={currentPath === '/shop' ? 'page' : undefined} className={linkClass('/shop', true)}>Shop</Link>
              <div>
                <button type="button" onClick={() => setCollectionsOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm font-medium text-gray-700 outline-none transition hover:bg-gray-50 hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-900/30" aria-expanded={collectionsOpen} aria-controls="mobile-collections">
                  Collections <ChevronDown size={16} aria-hidden="true" className={`transition-transform duration-200 ${collectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                <div id="mobile-collections" className={`grid overflow-hidden pl-3 transition-[grid-template-rows,opacity] duration-200 ${collectionsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} motion-reduce:transition-none`}>
                  <div className="min-h-0 overflow-hidden">
                    {collectionLinks.map((item) => <Link key={item.href} href={item.href} onClick={closeDrawer} onKeyDown={handleLinkKeyDown} aria-current={currentPath === item.href ? 'page' : undefined} className={`${linkClass(item.href, true)} ml-1`}>{item.label}</Link>)}
                  </div>
                </div>
              </div>
              <Link href="/about" onClick={closeDrawer} onKeyDown={handleLinkKeyDown} aria-current={currentPath === '/about' ? 'page' : undefined} className={linkClass('/about', true)}>About</Link>
              <Link href="/contact" onClick={closeDrawer} onKeyDown={handleLinkKeyDown} aria-current={currentPath === '/contact' ? 'page' : undefined} className={linkClass('/contact', true)}>Contact</Link>
            </nav>
          </div>

          <div className="border-t border-gray-200 px-4 pt-3">
            <a href="https://wa.me/message/HLJIV7IE6GKAG1" target="_blank" rel="noreferrer" onClick={closeDrawer} className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-gray-100 px-3 text-sm font-semibold text-gray-900 outline-none transition hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-900/30">Chat with us on WhatsApp</a>
          </div>
        </aside>
      </div>
    </header>
  )
}

export default Header
