import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useEffect as useEff } from 'react'

const EditProduct: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<any>(null)
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const res = await fetch(`/api/admin/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
        setName(data.name)
      }
    })()
  }, [id])

  const { data: session } = useSession()
  useEff(() => {
    if (!session) return
    if (session.user?.email !== 'admin@tochiwears.ng') router.push('/auth/signin')
  }, [session])

  async function uploadFile(f: File) {
    const reader = new FileReader()
    return new Promise<string>((resolve, reject) => {
      reader.onload = async () => {
        const data = reader.result as string
        const filename = `${Date.now()}-${f.name}`
        const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, data }) })
        const j = await res.json()
        resolve(j.url)
      }
      reader.onerror = () => reject(new Error('File read error'))
      reader.readAsDataURL(f)
    })
  }

  async function handleSave(e: any) {
    e.preventDefault()
    let images = product.images || []
    if (file) {
      const url = await uploadFile(file)
      images = [url, ...images]
    }
    await fetch(`/api/admin/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, images }) })
    router.push('/admin/products')
  }

  async function handleDelete() {
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  if (!product) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <form onSubmit={handleSave} className="space-y-3 max-w-md">
        <input className="w-full border px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded" type="submit">Save</button>
          <button type="button" className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDelete}>Delete</button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
