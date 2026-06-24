import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, Home, LogIn, LogOut, Menu, Package, Plus, Search, User, UserPlus } from 'lucide-react'

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isProductDetail = /^\/products\/[^/]+$/.test(location.pathname)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
      isActive
        ? 'bg-primary text-on-primary shadow-sm'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
    }`

  return (
    <div className="min-h-screen bg-background text-on-background pb-24 md:pb-0">
      <header className="glass sticky top-0 z-40 w-full shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-margin-mobile md:h-20 md:px-margin-desktop">
          <div className="flex min-w-0 items-center gap-3 md:gap-5">
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              aria-label="Mở menu"
              type="button"
            >
              <Menu size={22} />
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2 text-primary">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
                <Package size={19} />
              </span>
              <span className="truncate font-headline-md text-headline-md">
                Sustainable Exchange
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              <Home size={17} />
              Trang chủ
            </NavLink>
            <NavLink to="/products" end className={navLinkClass}>
              <Search size={17} />
              Khám phá
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/products/new" className={navLinkClass}>
                <Plus size={17} />
                Đăng tin
              </NavLink>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className="hidden h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary sm:flex"
              aria-label="Thông báo"
              type="button"
            >
              <Bell size={21} />
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex h-11 items-center gap-2 rounded-full bg-surface-container-low px-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden max-w-28 truncate sm:block">
                    {user?.name?.split(' ')[0] || 'Tài khoản'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden h-11 w-11 items-center justify-center rounded-full text-error transition-colors hover:bg-error-container/50 sm:flex"
                  aria-label="Đăng xuất"
                  type="button"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                  <LogIn size={17} />
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm">
                  <UserPlus size={17} />
                  <span className="hidden sm:inline">Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        className={`mx-auto w-full px-margin-mobile py-6 md:px-margin-desktop md:py-10 ${
          isProductDetail ? 'max-w-[1280px]' : 'max-w-6xl'
        }`}
      >
        <Outlet />
      </main>

      {!isProductDetail && (
      <nav className="fixed bottom-0 left-0 z-50 w-full rounded-t-[2rem] border-t border-outline-variant/30 bg-surface/95 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0px_-6px_22px_rgba(44,62,80,0.10)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 items-end gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <Home size={24} />
            <span className="mt-1">Trang chủ</span>
          </NavLink>
          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <Search size={24} />
            <span className="mt-1">Tìm kiếm</span>
          </NavLink>
          <NavLink
            to="/products/new"
            className={({ isActive }) =>
              `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="-mt-7 mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20">
              <Plus size={30} />
            </span>
            <span>Đăng tin</span>
          </NavLink>
          <NavLink
            to={isAuthenticated ? '/profile' : '/login'}
            className={({ isActive }) =>
              `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-bold transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <User size={24} />
            <span className="mt-1">Cá nhân</span>
          </NavLink>
        </div>
      </nav>
      )}
    </div>
  )
}
