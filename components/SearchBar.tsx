import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { LoaderCircle, Search, X } from 'lucide-react'

type SearchProduct = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  images: string[]
}

type SearchBarProps = {
  className?: string
  inputClassName?: string
  compact?: boolean
  onSearch?: () => void
  onResultSelect?: () => void
}

const SEARCH_DEBOUNCE_MS = 300

export default function SearchBar({
  className = '',
  inputClassName = '',
  compact = false,
  onSearch,
  onResultSelect,
}: SearchBarProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (normalizedQuery.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ query: normalizedQuery, limit: '5' })
        const response = await fetch(`/api/product-search?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Unable to load suggestions.')
        setResults(await response.json())
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setResults([])
      } finally {
        setLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  const submitSearch = (value = query) => {
    const normalizedQuery = value.trim()
    if (!normalizedQuery) return
    setOpen(false)
    setActiveIndex(-1)
    router.push({ pathname: '/shop', query: { search: normalizedQuery } })
    onSearch?.()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitSearch()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
      return
    }

    if (!open && event.key === 'ArrowDown') setOpen(true)
    if (!open) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => Math.min(current + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter' && results.length > 0 && activeIndex >= 0) {
      event.preventDefault()
      router.push(`/product/${results[activeIndex].slug}`)
      onResultSelect?.()
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form role="search" onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)
            setOpen(Boolean(nextQuery.trim()))
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(Boolean(query.trim()))}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          role="combobox"
          aria-label="Search products"
          aria-expanded={open}
          aria-controls="product-search-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={open && activeIndex >= 0 ? `product-search-result-${activeIndex}` : undefined}
          className={`w-full rounded-lg border border-gray-200 bg-gray-50 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-100 ${compact ? 'h-10 pl-9 pr-9' : 'h-11 pl-9 pr-9'} ${inputClassName}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 outline-none transition hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/30"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </form>

      {open && (
        <div id="product-search-suggestions" role="listbox" aria-label="Product suggestions" className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-5 text-sm text-gray-600">
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching products...
            </div>
          ) : query.trim().length < 2 ? (
            <p className="px-3 py-3 text-sm text-gray-500">Type at least two characters to search.</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-gray-600">No products found</p>
          ) : (
            <>
              <div className="space-y-1">
                {results.map((product, index) => (
                  <Link
                    id={`product-search-result-${index}`}
                    key={product.id}
                    href={`/product/${product.slug}`}
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setOpen(false)
                      onResultSelect?.()
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${activeIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <Image src={product.images[0] || '/tochiwears logo.jpeg'} alt="" width={48} height={48} unoptimized className="h-12 w-12 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900">{product.name}</span>
                      <span className="block text-xs capitalize text-gray-500">{product.category}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-gray-900">₦{product.price.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
              <Link href={`/shop?search=${encodeURIComponent(query.trim())}`} onClick={() => setOpen(false)} className="mt-2 block rounded-lg border-t border-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950">
                View all results
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
