import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProductForm, { ProductFormValues } from '../../../components/admin/ProductForm'

const initialValues: ProductFormValues = {
  name: '',
  slug: '',
  price: '',
  category: 'jewelry',
  gender: 'unisex',
  description: '',
  stock: '0',
  rating: '4.5',
  newArrival: true,
}

export default function CreateProduct() {
  const router = useRouter()
  const { data: session } = useSession()
  const [form, setForm] = useState(initialValues)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) return
    const isAdmin = Boolean((session.user as any)?.role === 'admin' || (session.user as any)?.isAdmin)
    if (!isAdmin) router.replace('/auth/signin?callbackUrl=/admin/products/create')
  }, [session, router])

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return []

    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `${Date.now()}-${file.name}`, data: dataUrl }),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(json.error || 'Image upload failed.')
      uploaded.push(json.url)
    }
    return uploaded
  }

  async function handleSubmit(values: ProductFormValues, files: FileList | null) {
    setError('')
    setLoading(true)
    try {
      const images = await uploadFiles(files)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          price: Number(values.price),
          stock: Number(values.stock),
          rating: Number(values.rating),
          images,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to create product.')
      router.push('/admin/products')
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Unable to create product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Catalog</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Create product</h1>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <ProductForm
          action="create"
          initialValues={form}
          error={error}
          loading={loading}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/products')}
        />
      </div>
    </div>
  )
}
