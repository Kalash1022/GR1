import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { productsApi, usersApi } from '../api'
import { useAuth } from '../context/AuthContext'
import {
  Bookmark,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Edit3,
  HelpCircle,
  History,
  Inbox,
  List,
  LoaderCircle,
  LogOut,
  MapPin,
  Package,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  User,
  X,
} from 'lucide-react'

const typeLabel = {
  SELL: 'Bán',
  EXCHANGE: 'Trao đổi',
  DONATE: 'Tặng',
} as const

const conditionLabel = {
  NEW: 'Mới',
  LIKE_NEW: 'Như mới',
  GOOD: 'Tốt',
  FAIR: 'Khá',
  POOR: 'Cũ',
} as const

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await usersApi.getProfile()
      setName(data.name)
      setPhone(data.phone || '')
      setAddress(data.address || '')
      return data
    },
  })

  const { data: myProducts, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const { data } = await productsApi.getMyProducts()
      return data
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      toast.success('Đã cập nhật hồ sơ')
      setIsEditing(false)
      refetchProfile()
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Không thể cập nhật hồ sơ'),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => productsApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái')
      refetchProducts()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success('Đã xóa tin đăng')
      refetchProducts()
    },
  })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <LoaderCircle className="animate-spin text-primary" size={38} />
      </div>
    )
  }

  const activeCount = myProducts?.filter((product) => product.status === 'AVAILABLE').length ?? 0
  const completedCount = myProducts?.filter((product) => product.status !== 'AVAILABLE').length ?? 0
  const memberYear = profile?.createdAt ? new Date(profile.createdAt).getFullYear() : new Date().getFullYear()
  const avatarInitial = profile?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="animate-slide-up mx-auto flex w-full max-w-5xl flex-col gap-lg">
      <section className="glass-card flex flex-col items-center gap-md rounded-xl p-md text-center md:gap-lg md:p-xl">
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-24 w-24 rounded-full border-4 border-primary-container object-cover shadow-md md:h-36 md:w-36"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary-container bg-primary text-4xl font-extrabold text-on-primary shadow-md md:h-36 md:w-36 md:text-5xl">
            {avatarInitial}
          </div>
        )}

        <div className="flex flex-col items-center gap-xs">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">
            {profile?.name}
          </h1>
          <p className="flex items-center justify-center gap-sm text-body-lg text-on-surface-variant">
            <CalendarDays size={20} />
            Thành viên từ {memberYear}
          </p>
          <span className="mt-sm inline-flex items-center gap-xs rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
            <ShieldCheck size={18} />
            Đã xác thực
          </span>
        </div>

        <button type="button" onClick={() => setIsEditing(true)} className="btn-secondary">
          <Edit3 size={18} />
          Chỉnh sửa hồ sơ
        </button>
      </section>

      {isEditing && (
        <section className="glass-card rounded-xl p-md md:p-xl">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              updateProfileMutation.mutate({ name, phone, address })
            }}
            className="grid gap-md md:grid-cols-3"
          >
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="profile-name">
                Họ tên
              </label>
              <input
                id="profile-name"
                type="text"
                className="input-field"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="profile-phone">
                Số điện thoại
              </label>
              <input
                id="profile-phone"
                type="text"
                className="input-field"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant" htmlFor="profile-address">
                Địa chỉ
              </label>
              <input
                id="profile-address"
                type="text"
                className="input-field"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div className="flex flex-col-reverse gap-sm md:col-span-3 md:flex-row md:justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                <X size={18} />
                Hủy
              </button>
              <button type="submit" disabled={updateProfileMutation.isPending} className="btn-primary">
                {updateProfileMutation.isPending ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
                Lưu hồ sơ
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="grid grid-cols-3 gap-sm md:gap-lg">
        <div className="glass-card flex flex-col items-center justify-center gap-xs rounded-xl p-md md:p-lg">
          <Store className="text-secondary" size={32} />
          <span className="font-headline-md text-headline-md text-on-surface md:text-headline-lg">{activeCount}</span>
          <span className="text-center font-label-bold text-label-bold text-on-surface-variant">Đang bán</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center gap-xs rounded-xl p-md md:p-lg">
          <ShoppingBag className="text-secondary" size={32} />
          <span className="font-headline-md text-headline-md text-on-surface md:text-headline-lg">{completedCount}</span>
          <span className="text-center font-label-bold text-label-bold text-on-surface-variant">Hoàn tất</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center gap-xs rounded-xl p-md md:p-lg">
          <Star className="fill-[#f5b400] text-[#f5b400]" size={32} />
          <span className="font-headline-md text-headline-md text-on-surface md:text-headline-lg">4.8</span>
          <span className="text-center font-label-bold text-label-bold text-on-surface-variant">Đánh giá</span>
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-xl">
        <nav className="flex flex-col">
          {[
            { label: 'Tin đăng của tôi', Icon: List },
            { label: 'Sản phẩm đã lưu', Icon: Bookmark },
            { label: 'Lịch sử giao dịch', Icon: History },
            { label: 'Thiết lập tài khoản', Icon: Settings },
            { label: 'Trợ giúp', Icon: HelpCircle },
          ].map(({ label, Icon }, index, items) => (
            <a
              key={label}
              href="#my-listings"
              className={`group flex items-center justify-between p-md transition-colors hover:bg-surface-container-low md:p-lg md:px-xl ${
                index < items.length - 1 ? 'border-b border-outline-variant/40' : ''
              }`}
            >
              <span className="flex items-center gap-md text-on-surface md:gap-lg md:text-lg">
                <Icon className="text-on-surface-variant transition-colors group-hover:text-primary" size={26} />
                {label}
              </span>
              <ChevronRight className="text-on-surface-variant transition-transform group-hover:translate-x-1" size={26} />
            </a>
          ))}
        </nav>
      </section>

      <section id="my-listings" className="space-y-md">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Tin đăng của tôi
          </h2>
          <Link to="/products/new" className="btn-primary hidden sm:inline-flex">
            Đăng tin mới
          </Link>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-16">
            <LoaderCircle className="animate-spin text-primary" size={32} />
          </div>
        ) : myProducts && myProducts.length > 0 ? (
          <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {myProducts.map((product) => (
              <article key={product.id} className="glass-card overflow-hidden rounded-2xl">
                <div className="relative h-36 bg-surface-container-high">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="img-placeholder">
                      <Package size={30} />
                    </div>
                  )}
                  <span className={`badge absolute left-3 top-3 ${
                    product.type === 'SELL'
                      ? 'badge-sell'
                      : product.type === 'EXCHANGE'
                        ? 'badge-exchange'
                        : 'badge-donate'
                  }`}>
                    {typeLabel[product.type]}
                  </span>
                  {product.status !== 'AVAILABLE' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-on-primary">
                        <CheckCircle size={14} />
                        Hoàn tất
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-sm p-md">
                  <div>
                    <h3 className="truncate font-bold text-on-surface">{product.title}</h3>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {conditionLabel[product.condition]}
                      {product.type === 'SELL' && product.price ? ` · ${product.price.toLocaleString('vi-VN')}đ` : ''}
                    </p>
                    {product.location?.address && (
                      <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-on-surface-variant">
                        <MapPin size={14} />
                        <span className="truncate">{product.location.address}</span>
                      </p>
                    )}
                  </div>

                  {product.status === 'AVAILABLE' && (
                    <div className="flex gap-sm">
                      <button
                        type="button"
                        onClick={() => statusMutation.mutate({
                          id: product.id,
                          status: product.type === 'SELL' ? 'SOLD' : product.type === 'EXCHANGE' ? 'EXCHANGED' : 'DONATED',
                        })}
                        className="btn-primary flex-1 px-3 py-2 text-xs"
                      >
                        <CheckCircle size={14} />
                        Hoàn tất
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Xóa tin đăng này?')) deleteMutation.mutate(product.id)
                        }}
                        className="btn-secondary px-3 py-2 text-error"
                        aria-label="Xóa tin đăng"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
            <Inbox size={44} className="text-outline" />
            <p className="mt-3 font-bold text-on-surface">Bạn chưa có tin đăng nào.</p>
            <Link to="/products/new" className="btn-primary mt-5">
              <Package size={18} />
              Đăng tin đầu tiên
            </Link>
          </div>
        )}
      </section>

      <section className="flex justify-center">
        <button type="button" onClick={handleLogout} className="inline-flex items-center gap-sm rounded-lg px-lg py-md font-headline-md text-error transition-colors hover:bg-error-container/30">
          <LogOut size={24} />
          Đăng xuất
        </button>
      </section>
    </div>
  )
}
