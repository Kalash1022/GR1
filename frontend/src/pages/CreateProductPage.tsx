import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { categoriesApi, productsApi } from '../api'
import type { Category, FormFieldSchema } from '../types'
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Plus,
  Tag,
  X,
} from 'lucide-react'

type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
type ExchangeType = 'SELL' | 'EXCHANGE' | 'DONATE'

const typeOptions: { value: ExchangeType; label: string; description: string }[] = [
  { value: 'SELL', label: 'Bán', description: 'Đặt giá bán' },
  { value: 'EXCHANGE', label: 'Trao đổi', description: 'Đổi lấy món khác' },
  { value: 'DONATE', label: 'Tặng', description: 'Cho đi miễn phí' },
]

const conditionOptions: { value: Condition; label: string }[] = [
  { value: 'NEW', label: 'Mới' },
  { value: 'LIKE_NEW', label: 'Như mới' },
  { value: 'GOOD', label: 'Tốt' },
  { value: 'FAIR', label: 'Khá' },
  { value: 'POOR', label: 'Cũ' },
]

const MAX_CATEGORIES = 3

export default function CreateProductPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [price, setPrice] = useState<number | ''>('')
  const [condition, setCondition] = useState<Condition>('GOOD')
  const [type, setType] = useState<ExchangeType>('SELL')
  const [address, setAddress] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')

  // Tags state
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Dynamic attributes state
  const [attributes, setAttributes] = useState<Record<string, any>>({})

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.getAll()
      return data
    },
  })

  // Get merged formSchema from all selected categories
  const mergedFormSchema: FormFieldSchema[] = (() => {
    if (!categories || selectedCategoryIds.length === 0) return []
    const seen = new Set<string>()
    const fields: FormFieldSchema[] = []
    for (const catId of selectedCategoryIds) {
      const cat = categories.find((c) => c.id === catId)
      if (cat?.formSchema) {
        for (const field of cat.formSchema) {
          if (!seen.has(field.name)) {
            seen.add(field.name)
            fields.push(field)
          }
        }
      }
    }
    return fields
  })()

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast.success('Đã đăng tin')
      navigate('/products')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Không thể đăng tin'),
  })

  const handleAddImage = (event: React.FormEvent) => {
    event.preventDefault()
    const nextUrl = imageUrlInput.trim()
    if (!nextUrl) return
    if (images.length >= 5) {
      toast.error('Tối đa 5 ảnh')
      return
    }
    setImages([...images, nextUrl])
    setImageUrlInput('')
  }

  // Category toggle
  const handleToggleCategory = useCallback(
    (catId: string) => {
      setSelectedCategoryIds((prev) => {
        if (prev.includes(catId)) {
          return prev.filter((id) => id !== catId)
        }
        if (prev.length >= MAX_CATEGORIES) {
          toast.error(`Tối đa ${MAX_CATEGORIES} danh mục`)
          return prev
        }
        return [...prev, catId]
      })
    },
    [],
  )

  // Tag handlers
  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const value = tagInput.trim().toLowerCase()
    if (!value) return
    if (tags.includes(value)) {
      toast.error('Tag đã tồn tại')
      setTagInput('')
      return
    }
    if (tags.length >= 10) {
      toast.error('Tối đa 10 tags')
      return
    }
    setTags([...tags, value])
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // Dynamic attribute change
  const handleAttributeChange = (fieldName: string, value: any) => {
    setAttributes((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !description.trim() || selectedCategoryIds.length === 0 || !address.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    if (type === 'SELL' && price === '') {
      toast.error('Vui lòng nhập giá bán')
      return
    }

    // Validate required dynamic fields
    for (const field of mergedFormSchema) {
      if (field.required && !attributes[field.name]) {
        toast.error(`Vui lòng điền "${field.label}"`)
        return
      }
    }

    const hasAttributes = Object.keys(attributes).length > 0

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      categoryIds: selectedCategoryIds,
      condition,
      type,
      price: type === 'SELL' ? Number(price) : undefined,
      images,
      tags: tags.length > 0 ? tags : undefined,
      attributes: hasAttributes ? attributes : undefined,
      location: { address: address.trim() },
    })
  }

  return (
    <div className="animate-slide-up mx-auto flex w-full max-w-5xl flex-col gap-lg">
      <button type="button" onClick={() => navigate(-1)} className="btn-ghost w-fit pl-0">
        <ArrowLeft size={18} />
        Quay lại
      </button>

      <div className="text-left md:text-center">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">
          Đăng tin mới
        </h1>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Chia sẻ sản phẩm của bạn với cộng đồng.
        </p>
      </div>

      {/* Image section */}
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-headline-md text-base text-on-surface">Hình ảnh sản phẩm</h2>
          <span className="text-body-sm text-on-surface-variant">Tối đa 5 ảnh</span>
        </div>

        <form onSubmit={handleAddImage} className="grid gap-3 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <ImagePlus className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={19} />
            <input
              type="url"
              className="input-field h-12 pl-11"
              placeholder="Dán URL ảnh sản phẩm"
              value={imageUrlInput}
              onChange={(event) => setImageUrlInput(event.target.value)}
            />
          </label>
          <button type="submit" className="btn-secondary h-12">
            <Plus size={18} />
            Thêm ảnh
          </button>
        </form>

        <div className="hide-scrollbar grid auto-cols-[140px] grid-flow-col gap-md overflow-x-auto pb-xs md:auto-cols-[180px]">
          <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-primary bg-surface-container-low text-primary">
            <div className="flex flex-col items-center gap-2 text-center">
              <Camera size={34} />
              <span className="font-label-bold text-label-bold">Ảnh chính</span>
            </div>
          </div>

          {images.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container-high shadow-sm">
              <img src={url} alt={`Ảnh sản phẩm ${index + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, imageIndex) => imageIndex !== index))}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-error opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
                aria-label="Xóa ảnh"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {Array.from({ length: Math.max(0, 4 - images.length) }).map((_, index) => (
            <div key={index} className="flex aspect-square items-center justify-center rounded-xl bg-surface-container-high text-outline-variant">
              <ImagePlus size={28} />
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="glass-card mx-auto w-full max-w-4xl rounded-2xl p-md md:p-xl">
        <div className="grid grid-cols-1 gap-x-xl gap-y-lg md:grid-cols-2">
          {/* Title */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="title">
              Tiêu đề
            </label>
            <input
              id="title"
              type="text"
              className="input-field h-14"
              placeholder="VD: Máy ảnh phim Canon AE-1"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          {/* Multi-Category Selector */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="font-label-bold text-label-bold text-on-surface-variant">
                Danh mục <span className="text-xs font-normal text-outline">(tối đa {MAX_CATEGORIES})</span>
              </label>
              <span className="text-xs text-on-surface-variant">
                Đã chọn: {selectedCategoryIds.length}/{MAX_CATEGORIES}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                    {isSelected && <CheckCircle size={16} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dynamic Form Fields */}
          {mergedFormSchema.length > 0 && (
            <div className="flex flex-col gap-md md:col-span-2">
              <div className="flex items-center gap-2 border-l-4 border-secondary pl-3">
                <h3 className="font-headline-md text-base text-on-surface">Thông tin chi tiết</h3>
              </div>
              <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
                {mergedFormSchema.map((field) => (
                  <div key={field.name} className="flex flex-col gap-xs">
                    <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor={`attr-${field.name}`}>
                      {field.label}
                      {field.required && <span className="ml-1 text-error">*</span>}
                    </label>
                    {field.type === 'select' && field.options ? (
                      <select
                        id={`attr-${field.name}`}
                        className="input-field h-12"
                        value={attributes[field.name] ?? ''}
                        onChange={(e) => handleAttributeChange(field.name, e.target.value)}
                        required={field.required}
                      >
                        <option value="">Chọn {field.label.toLowerCase()}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'number' ? (
                      <input
                        id={`attr-${field.name}`}
                        type="number"
                        className="input-field h-12"
                        placeholder={`Nhập ${field.label.toLowerCase()}`}
                        value={attributes[field.name] ?? ''}
                        onChange={(e) => handleAttributeChange(field.name, e.target.value === '' ? '' : Number(e.target.value))}
                        required={field.required}
                      />
                    ) : (
                      <input
                        id={`attr-${field.name}`}
                        type="text"
                        className="input-field h-12"
                        placeholder={`Nhập ${field.label.toLowerCase()}`}
                        value={attributes[field.name] ?? ''}
                        onChange={(e) => handleAttributeChange(field.name, e.target.value)}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Condition */}
          <div className="flex flex-col gap-xs">
            <span className="font-label-bold text-label-bold text-on-surface-variant">Tình trạng</span>
            <div className="flex h-14 overflow-hidden rounded-xl bg-surface-container p-1">
              {conditionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCondition(option.value)}
                  className={`flex-1 rounded-lg text-xs font-bold transition-all sm:text-sm ${
                    condition === option.value
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-bold text-label-bold text-on-surface-variant">
              Tags <span className="text-xs font-normal text-outline">(Enter hoặc dấu phẩy để thêm)</span>
            </label>
            <div className="flex min-h-[3.5rem] flex-wrap items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                >
                  <Tag size={12} />
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                    aria-label={`Xóa tag ${t}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="min-w-[100px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-outline"
                placeholder={tags.length === 0 ? 'VD: iphone, 99%, chính hãng' : 'Thêm tag...'}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
              />
            </div>
          </div>

          {/* Exchange type */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <span className="font-label-bold text-label-bold text-on-surface-variant">Hình thức giao dịch</span>
            <div className="grid gap-sm sm:grid-cols-3">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setType(option.value)
                    if (option.value !== 'SELL') setPrice('')
                  }}
                  className={`rounded-xl border p-md text-left transition-all ${
                    type === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="block font-bold text-on-surface">{option.label}</span>
                  <span className="mt-1 block text-xs">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          {type === 'SELL' && (
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="price">
                Giá bán
              </label>
              <div className="relative">
                <input
                  id="price"
                  type="number"
                  min={0}
                  className="input-field h-14 pr-12 font-price-display text-price-display"
                  placeholder="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value === '' ? '' : Number(event.target.value))}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">đ</span>
              </div>
            </div>
          )}

          {/* Location */}
          <div className={`flex flex-col gap-xs ${type === 'SELL' ? '' : 'md:col-span-2'}`}>
            <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="location">
              Khu vực giao dịch
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={19} />
              <input
                id="location"
                type="text"
                className="input-field h-14 pl-11"
                placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="description">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              id="description"
              className="input-field min-h-[150px] resize-y p-md"
              placeholder="Mô tả tình trạng, thời gian sử dụng, phụ kiện đi kèm..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-xl flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate('/products')} className="btn-secondary">
            Hủy
          </button>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary px-8 py-4">
            {createMutation.isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              <>
                <CheckCircle size={20} />
                Đăng tin ngay
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
