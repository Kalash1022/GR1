import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { categoriesApi, productsApi } from '../api'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.getAll()
      return data
    },
  })

  // Fetch recent products
  const { data: recentProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['recent-products'],
    queryFn: async () => {
      const { data } = await productsApi.getAll({ limit: 4 })
      return data?.data || []
    },
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Pre-defined category icon mappings based on Stitch design
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('thời trang') || lower.includes('quần áo') || lower.includes('fashion')) return 'checkroom'
    if (lower.includes('điện tử') || lower.includes('công nghệ') || lower.includes('device') || lower.includes('phone')) return 'devices'
    if (lower.includes('gia dụng') || lower.includes('nhà') || lower.includes('home')) return 'chair'
    if (lower.includes('sách') || lower.includes('book')) return 'menu_book'
    return 'more_horiz'
  }

  const getCategoryBgColor = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('thời trang')) return 'bg-secondary-container text-on-secondary-container'
    if (lower.includes('điện tử')) return 'bg-tertiary-container text-on-tertiary-container'
    if (lower.includes('gia dụng')) return 'bg-primary-container text-on-primary-container'
    if (lower.includes('sách')) return 'bg-surface-variant text-on-surface-variant'
    return 'bg-surface-container-high text-on-surface-variant'
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 md:space-y-16 py-6 animate-fade-in">
      
      {/* ── Search Bar ─────────────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-3xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline text-2xl">search</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm, người dùng..."
          className="block w-full pl-14 pr-6 py-4 border border-outline-variant rounded-2xl bg-surface-container-lowest text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-sm text-base shadow-sm transition-all"
        />
      </form>

      {/* ── Hero Banner ────────────────────────────────── */}
      <div className="relative w-full aspect-[21/9] min-h-[16rem] rounded-3xl overflow-hidden shadow-lg group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200')" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 md:px-16 max-w-2xl text-left">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-white mb-6 drop-shadow-md leading-tight text-3xl md:text-5xl font-bold">
            Trao đổi đồ cũ<br className="hidden sm:block"/>Bảo vệ môi trường
          </h2>
          <Link 
            to="/products"
            className="bg-primary text-white font-semibold py-3.5 px-8 rounded-2xl shadow-xl hover:brightness-110 transition-all active:scale-95 text-base"
          >
            Tham gia ngay
          </Link>
        </div>
      </div>

      {/* ── Categories ─────────────────────────────────── */}
      <section>
        <div className="flex justify-between items-end mb-8 text-left">
          <h3 className="font-headline-md text-headline-md text-on-surface text-2xl font-bold">Danh mục</h3>
        </div>
        <div className="flex overflow-x-auto space-x-6 md:space-x-10 pb-6 no-scrollbar -mx-6 px-6">
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className="flex-shrink-0 flex flex-col items-center group"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-lg transition-all active:scale-95 ${getCategoryBgColor(cat.name)}`}>
                <span className="material-symbols-outlined text-3xl md:text-4xl">
                  {getCategoryIcon(cat.name)}
                </span>
              </div>
              <span className="font-body-sm text-on-surface-variant group-hover:text-primary transition-colors font-medium text-sm">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Product Grid ("Khám phá") ──────────────────── */}
      <section>
        <div className="flex justify-between items-center mb-8 text-left">
          <h3 className="font-headline-md text-headline-md text-on-surface text-2xl font-bold">Khám phá</h3>
          <Link 
            to="/products" 
            className="font-semibold text-base text-secondary hover:underline flex items-center gap-1.5"
          >
            Xem tất cả <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-surface-container-low rounded-3xl aspect-[3/4] border border-outline-variant/20" />
            ))}
          </div>
        ) : recentProducts && recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {recentProducts.map((product: any) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 flex flex-col hover:shadow-2xl transition-all cursor-pointer group text-left"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                  {product.images && product.images[0] ? (
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      src={product.images[0].url}
                      alt={product.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined text-[48px]">image</span>
                    </div>
                  )}
                  {product.type === 'DONATE' && (
                    <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center space-x-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">eco</span>
                      <span className="font-label-bold text-[11px] text-on-surface uppercase font-semibold">Quyên góp</span>
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h4 className="font-body-sm font-semibold text-base line-clamp-2 mb-3 group-hover:text-primary transition-colors text-on-surface">
                    {product.title}
                  </h4>
                  <div className="mt-auto">
                    {product.type === 'SELL' ? (
                      <p className="font-price-display text-secondary text-lg mb-3 font-bold">
                        {product.price?.toLocaleString()}đ
                      </p>
                    ) : (
                      <div className="inline-flex items-center bg-primary-container/15 text-primary px-3 py-1.5 rounded-xl border border-primary-container/20 mb-3">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">
                          {product.type === 'EXCHANGE' ? 'sync_alt' : 'volunteer_activism'}
                        </span>
                        <span className="font-label-bold text-xs font-semibold">
                          {product.type === 'EXCHANGE' ? 'Trao đổi' : 'Quyên góp'}
                        </span>
                      </div>
                    )}
                    {product.location && (
                      <div className="flex items-center text-on-surface-variant text-[13px]">
                        <span className="material-symbols-outlined text-[18px] mr-1.5 text-outline">location_on</span>
                        <span className="truncate">{product.location.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container rounded-3xl text-on-surface-variant">
            Chưa có sản phẩm nào được đăng gần đây.
          </div>
        )}
      </section>

    </div>
  )
}
