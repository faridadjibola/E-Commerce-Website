import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const EditProduct: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    category: 'jewelry',
    gender: 'unisex',
    description: '',
    stock: '0',
    rating: '4.5',
    newArrival: false,
    images: [] as string[],
  })

  useEffect(() => {
    if (!session) return
    const isAdmin = Boolean((session.user as any)?.role === 'admin' || (session.user as any)?.isAdmin)
    if (!isAdmin) {
      router.replace('/auth/signin?callbackUrl=/admin/products')
      return
    }

    if (!id || typeof id !== 'string') return

    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${id}`)
        if (!response.ok) throw new Error('Unable to load product.')
        const data = await response.json()
        setProduct(data)
        setForm({
          name: data.name || '',
          slug: data.slug || '',
          price: String(data.price ?? ''),
          category: data.category || 'jewelry',
          gender: data.gender || 'unisex',
          description: data.description || '',
          stock: String(data.stock ?? 0),
          rating: String(data.rating ?? 4.5),
          newArrival: Boolean(data.newArrival),
          images: Array.isArray(data.images) ? data.images : [],
        })
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load product.')
      }
    }

    loadProduct()
  }, [id, session, router])

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return []

    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('File read failed.'))
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `${Date.now()}-${file.name}`, data: dataUrl }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.error || 'Image upload failed.')
      }
      uploaded.push(json.url)
    }

    return uploaded
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    if (!id || typeof id !== 'string') return

    setError('')
    setSubmitting(true)

    try {
      const imageInput = document.getElementById('edit-product-images') as HTMLInputElement | null
      const uploadedImages = await uploadFiles(imageInput?.files || null)
      const payload = {
        name: form.name,
        slug: form.slug || form.name,
        price: Number(form.price),
        category: form.category,
        gender: form.gender,
        description: form.description,
        stock: Number(form.stock),
        rating: Number(form.rating),
        newArrival: form.newArrival,
        images: uploadedImages.length ? uploadedImages : form.images,
      }

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save product.')
      }

      router.push('/admin/products')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!id || typeof id !== 'string') return

    const confirmed = window.confirm('Delete this product?')
    if (!confirmed) return

    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (response.ok) {
      router.push('/admin/products')
      return
    }

    const data = await response.json().catch(() => ({}))
    setError(data.error || 'Unable to delete product.')
  }

  if (!product) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">Loading product...</div>
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Catalog</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Edit product</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Product name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Slug</label>
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Price (₦)</label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            >
              <option value="jewelry">Jewelry</option>
              <option value="watches">Watches</option>
              <option value="belts">Belts</option>
              <option value="glasses">Glasses</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={form.gender}
              onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
            <div>
              <div className="text-sm font-medium text-gray-700">New arrival</div>
              <div className="text-xs text-gray-500">Show in new arrivals</div>
            </div>
            <input
              type="checkbox"
              checked={form.newArrival}
              onChange={(event) => setForm((current) => ({ ...current, newArrival: event.target.checked }))}
              className="h-4 w-4"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Replace images</label>
          <input
            id="edit-product-images"
            type="file"
            multiple
            accept="image/*"
            className="block w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={handleDelete} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500">
            Delete product
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
