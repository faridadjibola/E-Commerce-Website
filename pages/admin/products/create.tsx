import { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const CreateProduct: NextPage = () => {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
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

  async function handleCreate(e: any) {
    e.preventDefault()
    let images: string[] = []
    if (file) {
      const url = await uploadFile(file)
      images = [url]
    }
    const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, images }) })
    if (res.ok) {
      router.push('/admin/products')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <form onSubmit={handleCreate} className="space-y-3 max-w-md">
        <input className="w-full border px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Product name" />
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
        <button className="bg-black text-white px-4 py-2 rounded" type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateProduct
