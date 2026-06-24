import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { productsApi, messagesApi, reportsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Heart,
  Inbox,
  Leaf,
  LoaderCircle,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ShieldAlert,
  Star,
  User,
} from 'lucide-react'

const conditionLabel = {
  NEW: 'Mới',
  LIKE_NEW: 'Như mới',
  GOOD: 'Tốt',
  FAIR: 'Khá',
  POOR: 'Cũ',
} as const

const typeLabel = {
  SELL: 'Bán',
  EXCHANGE: 'Trao đổi',
  DONATE: 'Tặng miễn phí',
} as const

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [chatMessage, setChatMessage] = useState('')
  const [reportDetails, setReportDetails] = useState('')
  const [isReporting, setIsReporting] = useState(false)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await productsApi.getById(id!)
      return data
    },
    enabled: !!id,
  })

  const { data: similarProducts } = useQuery({
    queryKey: ['similar-products', product?.categoryId, product?.id],
    queryFn: async () => {
      const { data } = await productsApi.getAll({
        categoryId: product!.categoryId,
        limit: 5,
      })
      return data.data.filter((item) => item.id !== product!.id).slice(0, 5)
    },
    enabled: !!product?.categoryId,
  })

  const messageMutation = useMutation({
    mutationFn: messagesApi.send,
    onSuccess: () => {
      toast.success('Đã gửi tin nhắn')
      setChatMessage('')
    },
    onError: () => toast.error('Không thể gửi tin nhắn'),
  })

  const reportMutation = useMutation({
    mutationFn: reportsApi.create,
    onSuccess: () => {
      toast.success('Đã gửi báo cáo')
      setIsReporting(false)
      setReportDetails('')
    },
    onError: () => toast.error('Không thể gửi báo cáo'),
  })

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault()
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập')
      navigate('/login')
      return
    }
    if (!product || !chatMessage.trim()) return
    messageMutation.mutate({
      receiverId: product.ownerId,
      content: `Về tin "${product.title}": ${chatMessage.trim()}`,
    })
  }

  const handleReport = (event: React.FormEvent) => {
    event.preventDefault()
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập')
      navigate('/login')
      return
    }
    if (!product) return
    reportMutation.mutate({
      reason: 'SPAM',
      details: reportDetails,
      targetProductId: product.id,
      targetUserId: product.ownerId,
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <LoaderCircle className="animate-spin text-primary" size={38} />
          <span>Đang tải tin đăng...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="glass-card flex min-h-[420px] flex-col items-center justify-center rounded-3xl px-6 text-center">
        <Inbox size={52} className="text-outline" />
        <h1 className="mt-4 font-headline-md text-headline-md text-on-surface">Không tìm thấy tin đăng</h1>
        <button type="button" onClick={() => navigate('/products')} className="btn-secondary mt-5">
          Quay lại danh sách
        </button>
      </div>
    )
  }

  const images = product.images?.map((image) => image.url).filter(Boolean) ?? []
  const activeImage = images[selectedImageIndex] ?? images[0]
  const isOwner = currentUser?.id === product.ownerId
  const ownerInitial = product.owner.name.charAt(0).toUpperCase()
  const priceLabel =
    product.type === 'SELL'
      ? `${product.price?.toLocaleString('vi-VN') ?? 0}đ`
      : product.type === 'EXCHANGE'
        ? 'Trao đổi'
        : 'Tặng miễn phí'

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-ghost pl-0"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-primary" aria-label="Chia sẻ">
            <Share2 size={18} />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-error" aria-label="Lưu tin">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <main className="grid grid-cols-1 gap-lg lg:grid-cols-12 lg:gap-xl">
        <section className="lg:col-span-7 xl:col-span-8">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface-container-high shadow-sm md:aspect-[4/3] lg:aspect-video">
            {activeImage ? (
              <img src={activeImage} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="img-placeholder flex-col gap-2">
                <Inbox size={52} />
                <span className="font-bold">Chưa có ảnh sản phẩm</span>
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${selectedImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`Ảnh ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="no-scrollbar mt-md flex gap-md overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 md:h-24 md:w-24 ${
                    selectedImageIndex === index
                      ? 'border-primary ring-4 ring-primary/10'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-lg lg:col-span-5 xl:col-span-4">
          <div className="space-y-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${
                product.type === 'SELL'
                  ? 'badge-sell'
                  : product.type === 'EXCHANGE'
                    ? 'badge-exchange'
                    : 'badge-donate'
              }`}>
                {typeLabel[product.type]}
              </span>
              <span className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-bold text-on-surface-variant">
                {conditionLabel[product.condition]}
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile leading-tight text-on-surface md:text-headline-lg">
              {product.title}
            </h1>
            <p className="text-3xl font-extrabold text-primary">{priceLabel}</p>
            <div className="flex flex-wrap gap-2 text-body-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1">
                <CalendarDays size={15} />
                {new Date(product.createdAt).toLocaleDateString('vi-VN')}
              </span>
              {product.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1">
                  <MapPin size={15} />
                  {product.location.address}
                </span>
              )}
            </div>
          </div>

          {!isOwner && (
            <form onSubmit={handleSendMessage} className="glass-card rounded-2xl p-md">
              <label className="mb-3 flex items-center gap-2 font-headline-md text-base text-on-surface">
                <MessageCircle size={18} className="text-primary" />
                Nhắn tin cho {product.owner.name}
              </label>
              <textarea
                required
                rows={3}
                className="input-field resize-none"
                placeholder="Hỏi về tình trạng, thời gian hẹn hoặc đề xuất trao đổi..."
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
              />
              <button type="submit" disabled={messageMutation.isPending} className="btn-primary mt-3 w-full">
                {messageMutation.isPending ? <LoaderCircle className="animate-spin" size={18} /> : <Send size={18} />}
                Gửi tin nhắn
              </button>
            </form>
          )}

          <div className="glass-card flex items-center gap-md rounded-2xl p-md">
            {product.owner.avatar ? (
              <img src={product.owner.avatar} alt={product.owner.name} className="h-16 w-16 rounded-full object-cover ring-4 ring-surface-container" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-on-primary ring-4 ring-surface-container">
                {ownerInitial}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-headline-md text-headline-md text-on-surface">{product.owner.name}</h2>
              <div className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
                <Star size={16} className="fill-[#f5b400] text-[#f5b400]" />
                <span className="font-bold">4.8</span>
                <span className="opacity-50">|</span>
                <span>124 đánh giá</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                <User size={14} />
                <span className="truncate">{product.owner.email}</span>
              </div>
              {product.owner.phone && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <Phone size={14} />
                  <span>{product.owner.phone}</span>
                </div>
              )}
            </div>
            <ChevronRight className="text-outline" size={22} />
          </div>

          <div className="space-y-md">
            <h2 className="border-l-4 border-primary pl-3 font-headline-md text-headline-md text-on-surface">
              Mô tả sản phẩm
            </h2>
            <p className="whitespace-pre-line text-body-lg leading-relaxed text-on-surface-variant">
              {product.description}
            </p>
          </div>

          <div className="flex items-start gap-md rounded-2xl border border-primary/10 bg-primary/5 p-md">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf size={20} />
            </span>
            <div>
              <h3 className="font-bold text-primary">Giao dịch xanh và bền vững</h3>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Mỗi món đồ được tái sử dụng là một lần giảm lãng phí và kéo dài vòng đời sản phẩm.
              </p>
            </div>
          </div>

          {!isOwner && (
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-md">
              {!isReporting ? (
                <button
                  type="button"
                  onClick={() => setIsReporting(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-on-surface-variant hover:bg-error-container/40 hover:text-error"
                >
                  <AlertTriangle size={16} />
                  Báo cáo tin đăng
                </button>
              ) : (
                <form onSubmit={handleReport} className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-error">
                    <ShieldAlert size={16} />
                    Lý do báo cáo
                  </h3>
                  <textarea
                    required
                    rows={3}
                    className="input-field resize-none text-sm"
                    placeholder="Mô tả vấn đề bạn gặp phải..."
                    value={reportDetails}
                    onChange={(event) => setReportDetails(event.target.value)}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1 bg-error text-on-error hover:bg-error">
                      Gửi báo cáo
                    </button>
                    <button type="button" onClick={() => setIsReporting(false)} className="btn-secondary">
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </main>

      {similarProducts && similarProducts.length > 0 && (
        <section className="space-y-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-headline-md text-headline-md text-on-surface">Sản phẩm tương tự</h2>
            <Link to={`/products?category=${product.categoryId}`} className="text-sm font-bold text-primary hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-md md:grid-cols-3 lg:grid-cols-5">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="group overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-container-high">
                  {item.images?.[0]?.url ? (
                    <img src={item.images[0].url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="img-placeholder">
                      <Inbox size={26} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-on-surface">{item.title}</h3>
                  <p className="mt-2 font-bold text-primary">
                    {item.type === 'SELL' ? `${item.price?.toLocaleString('vi-VN') ?? 0}đ` : typeLabel[item.type]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!isOwner && (
        <div className="fixed bottom-0 left-0 z-50 flex w-full items-center gap-md border-t border-outline-variant/30 bg-surface-container-lowest/95 px-margin-mobile py-4 shadow-[0px_-8px_24px_rgba(44,62,80,0.10)] backdrop-blur-md md:hidden">
          <button
            type="button"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface"
            onClick={() => window.scrollTo({ top: 360, behavior: 'smooth' })}
            aria-label="Nhắn tin"
          >
            <MessageCircle size={25} />
          </button>
          <button
            type="button"
            className="btn-primary h-14 flex-1"
            onClick={() => window.scrollTo({ top: 360, behavior: 'smooth' })}
          >
            <CheckCircle size={20} />
            Liên hệ ngay
          </button>
        </div>
      )}
    </div>
  )
}
