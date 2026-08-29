import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const AdminProducts: NextPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return // wait for session to be available
    (async () => {
      // check admin
      if (!session.user?.email || session.user.email !== 'admin@tochiwears.ng') {
        router.push('/auth/signin')
        return
      }
      try {
        const res = await fetch('/api/admin/products')
        const data = await res.json()
        setProducts(data)
      } catch (e) {
        setProducts([])
      }
    })()
  }, [session, router])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/create" className="bg-black text-white px-3 py-2 rounded">Create Product</Link>
      </div>
      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">SKU: {p.sku}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/products/${p.id}`} className="text-blue-600">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProducts
