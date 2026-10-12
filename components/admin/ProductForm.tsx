import Image from 'next/image'
import { ArrowLeft, ImagePlus, LoaderCircle, Trash2 } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'

export type ProductFormValues = {
  name: string
  slug: string
  price: string
  category: string
  gender: string
  description: string
  stock: string
  rating: string
  newArrival: boolean
}

type ProductFormProps = {
  action: 'create' | 'edit'
  initialValues: ProductFormValues
  existingImages?: string[]
  error: string
  loading: boolean
  onChange: (values: ProductFormValues) => void
  onSubmit: (values: ProductFormValues, images: FileList | null) => Promise<void>
  onCancel: () => void
  onDelete?: () => void
}

const categories = [
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'watches', label: 'Watches' },
  { value: 'belts', label: 'Belts' },
  { value: 'glasses', label: 'Glasses' },
]

const genders = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
]

export default function ProductForm({
  action,
  initialValues,
  existingImages = [],
  error,
  loading,
  onChange,
  onSubmit,
  onCancel,
  onDelete,
}: ProductFormProps) {
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null)
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  const updateValue = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    onChange({ ...initialValues, [key]: value })
  }

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    setSelectedImages(files)
    setImagePreviewUrls(Array.from(files || []).map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(initialValues, selectedImages)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-gray-700">
            Product name
          </label>
          <input
            id="product-name"
            required
            value={initialValues.name}
            onChange={(event) => updateValue('name', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            placeholder="e.g. Gold Ring"
          />
        </div>

        <div>
          <label htmlFor="product-slug" className="mb-2 block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            id="product-slug"
            required
            value={initialValues.slug}
            onChange={(event) => updateValue('slug', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
            placeholder="gold-ring"
          />
        </div>

        <div>
          <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-gray-700">
            Price (₦)
          </label>
          <input
            id="product-price"
            required
            type="number"
            min="1"
            step="1"
            value={initialValues.price}
            onChange={(event) => updateValue('price', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label htmlFor="product-stock" className="mb-2 block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="product-stock"
            required
            type="number"
            min="0"
            step="1"
            value={initialValues.stock}
            onChange={(event) => updateValue('stock', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="product-category"
            value={initialValues.category}
            onChange={(event) => updateValue('category', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-gender" className="mb-2 block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="product-gender"
            value={initialValues.gender}
            onChange={(event) => updateValue('gender', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          >
            {genders.map((gender) => (
              <option key={gender.value} value={gender.value}>{gender.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-rating" className="mb-2 block text-sm font-medium text-gray-700">
            Rating
          </label>
          <input
            id="product-rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={initialValues.rating}
            onChange={(event) => updateValue('rating', event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <label className="flex min-h-16 cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-gray-700">New arrival</span>
            <span className="block text-xs text-gray-500">Feature this product in the storefront</span>
          </span>
          <input
            type="checkbox"
            checked={initialValues.newArrival}
            onChange={(event) => updateValue('newArrival', event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
        </label>
      </div>

      <div>
        <label htmlFor="product-description" className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="product-description"
          required
          rows={5}
          value={initialValues.description}
          onChange={(event) => updateValue('description', event.target.value)}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          placeholder="Include material, fit, styling, and care details"
        />
      </div>

      <div>
        <label htmlFor="product-images" className="mb-2 block text-sm font-medium text-gray-700">
          Product images
        </label>
        <label htmlFor="product-images" className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-gray-500 hover:bg-white">
          <ImagePlus className="mb-2 h-5 w-5 text-gray-500" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-700">Choose images</span>
          <span className="mt-1 text-xs text-gray-500">JPEG, PNG, or WebP · up to 2 MB each</span>
        </label>
        <input
          id="product-images"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleImageSelection}
        />

        {(existingImages.length > 0 || imagePreviewUrls.length > 0) && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...existingImages, ...imagePreviewUrls].map((image, index) => (
              <div key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={320}
                  height={240}
                  unoptimized={image.startsWith('blob:')}
                  className="h-40 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete product
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? action === 'create' ? 'Creating...' : 'Saving...' : action === 'create' ? 'Create product' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
