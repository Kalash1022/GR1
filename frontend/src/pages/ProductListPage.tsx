import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { categoriesApi, productsApi } from '../api'
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Tag,
  X,
  Compass,
} from 'lucide-react'

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'SELL', label: 'Bán' },
  { value: 'EXCHANGE', label: 'Trao đổi' },
  { value: 'DONATE', label: 'Tặng' },
]

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

const provinces = [
  { value: '', label: 'Tất cả Tỉnh/Thành' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
  { value: 'hn', label: 'Hà Nội' },
  { value: 'dn', label: 'Đà Nẵng' },
  { value: 'ct', label: 'Cần Thơ' },
]

const districtsByProvince: Record<string, { value: string; label: string }[]> = {
  hcm: [
    { value: '', label: 'Tất cả Quận/Huyện' },
    { value: 'hcm-q1', label: 'Quận 1' },
    { value: 'hcm-bt', label: 'Quận Bình Thạnh' },
  ],
  hn: [
    { value: '', label: 'Tất cả Quận/Huyện' },
    { value: 'hn-cg', label: 'Quận Cầu Giấy' },
    { value: 'hn-dd', label: 'Quận Đống Đa' },
  ],
  dn: [
    { value: '', label: 'Tất cả Quận/Huyện' },
    { value: 'dn-hc', label: 'Quận Hải Châu' },
  ],
  ct: [
    { value: '', label: 'Tất cả Quận/Huyện' },
    { value: 'ct-nk', label: 'Quận Ninh Kiều' },
  ],
}

const radiusOptions = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
]

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [tag, setTag] = useState(searchParams.get('tag') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1))

  // Spatial search states
  const [nearMe, setNearMe] = useState(searchParams.get('nearMe') === 'true')
  const [lat, setLat] = useState<number | null>(
    searchParams.get('lat') ? Number(searchParams.get('lat')) : null
  )
  const [lng, setLng] = useState<number | null>(
    searchParams.get('lng') ? Number(searchParams.get('lng')) : null
  )
  const [radiusKm, setRadiusKm] = useState(
    searchParams.get('radiusKm') ? Number(searchParams.get('radiusKm')) : 10
  )

  // Administrative boundary states
  const [provinceId, setProvinceId] = useState(searchParams.get('provinceId') ?? '')
  const [districtId, setDistrictId] = useState(searchParams.get('districtId') ?? '')

  // Sorting
  const [sort, setSort] = useState(searchParams.get('sort') ?? '')
  const [isLocating, setIsLocating] = useState(false)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.getAll()
      return data
    },
  })

  const { data: productsData, isLoading } = useQuery({
    queryKey: [
      'products-search',
      keyword,
      category,
      tag,
      type,
      nearMe,
      lat,
      lng,
      radiusKm,
      provinceId,
      districtId,
      sort,
      page,
    ],
    queryFn: async () => {
      if (nearMe && lat && lng) {
        const { data } = await productsApi.search({
          keyword: keyword || undefined,
          categoryId: category || undefined,
          tag: tag || undefined,
          type: type || undefined,
          lat,
          lng,
          radiusKm,
          sort: sort || undefined,
          page,
          limit: 12,
        })
        return data
      }

      const { data } = await productsApi.search({
        keyword: keyword || undefined,
        categoryId: category || undefined,
        tag: tag || undefined,
        type: type || undefined,
        provinceId: provinceId || undefined,
        districtId: districtId || undefined,
        sort: sort || undefined,
        page,
        limit: 12,
      })
      return data
    },
  })

  const syncParams = (next: Record<string, any>) => {
    const params = new URLSearchParams(searchParams)
    const values = {
      keyword,
      category,
      tag,
      type,
      nearMe: nearMe ? 'true' : 'false',
      lat: lat ? String(lat) : '',
      lng: lng ? String(lng) : '',
      radiusKm: String(radiusKm),
      provinceId,
      districtId,
      sort,
      page,
      ...next,
    }

    Object.entries(values).forEach(([key, value]) => {
      if (!value || value === 'false' || value === 1 || (key === 'radiusKm' && value === '10')) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    setSearchParams(params, { replace: true })
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
    syncParams({ keyword: value, page: 1 })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setPage(1)
    syncParams({ category: value, page: 1 })
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    setPage(1)
    syncParams({ type: value, page: 1 })
  }

  const handleProvinceChange = (value: string) => {
    setProvinceId(value)
    setDistrictId('')
    setPage(1)
    syncParams({ provinceId: value, districtId: '', page: 1 })
  }

  const handleDistrictChange = (value: string) => {
    setDistrictId(value)
    setPage(1)
    syncParams({ districtId: value, page: 1 })
  }

  const handleRadiusChange = (value: number) => {
    setRadiusKm(value)
    setPage(1)
    syncParams({ radiusKm: value, page: 1 })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    setPage(1)
    syncParams({ sort: value, page: 1 })
  }

  const handlePageChange = (value: number) => {
    setPage(value)
    syncParams({ page: value })
  }

  const handleNearMeChange = (checked: boolean) => {
    setNearMe(checked)
    setPage(1)
    if (checked) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false)
          const newLat = position.coords.latitude
          const newLng = position.coords.longitude
          setLat(newLat)
          setLng(newLng)
          setSort('distance') // default sort by distance when GPS is on
          setProvinceId('')
          setDistrictId('')
          syncParams({
            nearMe: 'true',
            lat: String(newLat),
            lng: String(newLng),
            sort: 'distance',
            provinceId: '',
            districtId: '',
            page: 1,
          })
        },
        (error) => {
          setIsLocating(false)
          setNearMe(false)
          setLat(null)
          setLng(null)
          let errMsg = 'Không thể lấy vị trí hiện tại của bạn.'
          if (error.code === error.PERMISSION_DENIED) {
            errMsg = 'Quyền định vị bị từ chối. Vui lòng cho phép quyền truy cập vị trí trên trình duyệt.'
          }
          alert(errMsg)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    } else {
      setLat(null)
      setLng(null)
      const nextSort = sort === 'distance' ? '' : sort
      setSort(nextSort)
      syncParams({
        nearMe: 'false',
        lat: '',
        lng: '',
        sort: nextSort,
        page: 1,
      })
    }
  }

  const clearFilters = () => {
    setKeyword('')
    setCategory('')
    setTag('')
    setType('')
    setNearMe(false)
    setLat(null)
    setLng(null)
    setRadiusKm(10)
    setProvinceId('')
    setDistrictId('')
    setSort('')
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="animate-fade-in space-y-7">
      <div className="page-header flex-wrap">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">
            Khám phá sản phẩm
          </h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {productsData?.meta?.total
              ? `${productsData.meta.total} tin đăng đang khả dụng`
              : 'Tìm đồ cũ, trao đổi và tặng lại trong cộng đồng'}
          </p>
        </div>
        <Link to="/products/new" className="btn-primary hidden md:inline-flex">
          Đăng tin mới
        </Link>
      </div>

      <section className="glass-card rounded-2xl p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input
              type="text"
              placeholder="Tìm sản phẩm, thương hiệu..."
              className="input-field h-12 pl-11"
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex">
            <label className="relative block">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={17} />
              <select
                className="input-field h-12 min-w-[200px] appearance-none pl-11 pr-9"
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex h-12 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-1">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeChange(option.value)}
                  className={`min-w-20 rounded-lg px-3 text-sm font-bold transition-colors ${
                    type === option.value
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial Search and Filters Row */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4 items-center">
          {/* Near me toggle */}
          <button
            type="button"
            onClick={() => handleNearMeChange(!nearMe)}
            disabled={isLocating}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl border font-bold transition-all ${
              nearMe
                ? 'border-primary/40 bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30'
                : 'border-outline-variant hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {isLocating ? (
              <LoaderCircle className="animate-spin text-primary" size={18} />
            ) : (
              <Compass className={nearMe ? 'text-primary animate-pulse' : 'text-outline'} size={18} />
            )}
            {isLocating ? 'Đang định vị...' : 'Tìm gần tôi'}
          </button>

          {/* Near me Radius OR Admin boundary selectors */}
          {nearMe ? (
            <label className="relative block sm:col-span-1 md:col-span-2">
              <Compass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={17} />
              <select
                className="input-field h-12 appearance-none pl-11 pr-9"
                value={radiusKm}
                onChange={(event) => handleRadiusChange(Number(event.target.value))}
              >
                {radiusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Bán kính: {opt.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label className="relative block">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={17} />
                <select
                  className="input-field h-12 appearance-none pl-11 pr-9"
                  value={provinceId}
                  onChange={(event) => handleProvinceChange(event.target.value)}
                >
                  {provinces.map((prov) => (
                    <option key={prov.value} value={prov.value}>
                      {prov.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative block">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={17} />
                <select
                  className="input-field h-12 appearance-none pl-11 pr-9"
                  disabled={!provinceId}
                  value={districtId}
                  onChange={(event) => handleDistrictChange(event.target.value)}
                >
                  <option value="">Tất cả Quận/Huyện</option>
                  {provinceId &&
                    districtsByProvince[provinceId]?.map((dist) => (
                      <option key={dist.value} value={dist.value}>
                        {dist.label}
                      </option>
                    ))}
                </select>
              </label>
            </>
          )}

          {/* Sắp xếp */}
          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={17} />
            <select
              className="input-field h-12 appearance-none pl-11 pr-9"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value)}
            >
              <option value="">Sắp xếp: Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              {nearMe && <option value="distance">Khoảng cách: Gần nhất</option>}
            </select>
          </label>
        </div>

        {(keyword || category || tag || type || nearMe || provinceId || districtId || sort) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-outline-variant/40 pt-4 text-body-sm text-on-surface-variant">
            <Tag size={15} className="text-primary" />
            {keyword && <span className="badge badge-exchange">"{keyword}"</span>}
            {category && <span className="badge badge-sell">Danh mục</span>}
            {tag && (
              <span className="badge bg-primary/10 text-primary">
                Tag: {tag}
                <button type="button" className="ml-1 opacity-70 hover:opacity-100" onClick={() => { setTag(''); syncParams({ tag: '', page: 1 }); setPage(1); }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {type && <span className="badge badge-donate">{typeLabel[type as keyof typeof typeLabel]}</span>}
            {nearMe && (
              <span className="badge badge-sell flex items-center gap-1">
                <Compass size={12} className="animate-spin" />
                Gần tôi ({radiusKm}km)
              </span>
            )}
            {provinceId && (
              <span className="badge badge-exchange">
                {provinces.find((p) => p.value === provinceId)?.label}
              </span>
            )}
            {districtId && provinceId && (
              <span className="badge badge-donate">
                {districtsByProvince[provinceId]?.find((d) => d.value === districtId)?.label}
              </span>
            )}
            {sort && (
              <span className="badge badge-exchange">
                {sort === 'distance'
                  ? 'Gần nhất'
                  : sort === 'newest'
                    ? 'Mới nhất'
                    : sort === 'price_asc'
                      ? 'Giá tăng dần'
                      : 'Giá giảm dần'}
              </span>
            )}
            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-error hover:bg-error-container/50"
              onClick={clearFilters}
            >
              <X size={15} />
              Xóa lọc
            </button>
          </div>
        )}
      </section>

      {isLoading ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-on-surface-variant">
            <LoaderCircle className="animate-spin text-primary" size={36} />
            <span>Đang tìm sản phẩm...</span>
          </div>
        </div>
      ) : productsData?.data && productsData.data.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {productsData.data.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group flex overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-lowest text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <article className="flex w-full flex-col">
                  <div className="relative aspect-square overflow-hidden bg-surface-container-high">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="img-placeholder flex-col gap-2">
                        <Inbox size={32} />
                        <span className="text-xs font-bold">Chưa có ảnh</span>
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
                  </div>

                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <h2 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-snug text-on-surface transition-colors group-hover:text-primary md:text-base">
                      {product.title}
                    </h2>
                    <p className="mt-2 text-xs font-bold text-on-surface-variant">
                      {conditionLabel[product.condition]}
                    </p>

                    <div className="mt-auto pt-4">
                      <p className="font-price-display text-price-display text-secondary">
                        {product.type === 'SELL'
                          ? `${product.price?.toLocaleString('vi-VN') ?? 0}đ`
                          : product.type === 'EXCHANGE'
                            ? 'Trao đổi'
                            : 'Tặng miễn phí'}
                      </p>
                      {product.location && (
                        <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-on-surface-variant">
                          <MapPin size={14} className="shrink-0 text-outline" />
                          <span className="truncate">
                            {product.location.address}
                            {product.distanceKm !== undefined && (
                              <span className="ml-1 text-primary font-bold">
                                ({product.distanceKm} km)
                              </span>
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {productsData.meta.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                className="btn-secondary px-4 py-2 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Trước
              </button>
              {Array.from({ length: productsData.meta.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition-colors ${
                    page === pageNumber
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={page === productsData.meta.totalPages}
                onClick={() => handlePageChange(Math.min(page + 1, productsData.meta.totalPages))}
                className="btn-secondary px-4 py-2 disabled:opacity-40"
              >
                Sau
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card flex min-h-[360px] items-center justify-center rounded-3xl px-6 py-14 text-center">
          <div className="flex w-full max-w-xl flex-col items-center">
            <Inbox size={52} className="text-outline" />
            <h2 className="mt-5 font-headline-md text-headline-md text-on-surface">
              Không tìm thấy sản phẩm
            </h2>
            <p className="mt-2 w-full text-balance text-body-sm leading-6 text-on-surface-variant">
              Hãy thử đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm sản phẩm phù hợp.
            </p>
            <button type="button" onClick={clearFilters} className="btn-secondary mt-6">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
