import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { reportsApi, usersApi } from '../api'
import { toast } from 'react-hot-toast'
import {
  ShieldAlert, CheckCircle, XCircle, AlertTriangle, User as UserIcon,
  Package, LoaderCircle, Users, FileWarning, Lock, Unlock, Mail, Phone, MapPin, CalendarDays,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { User } from '../types'

type Tab = 'reports' | 'users'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('reports')
  const [filter, setFilter] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // ─── Reports ──────────────────────────────────────────────
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = useQuery({
    queryKey: ['admin-reports', filter],
    queryFn: async () => {
      const { data } = await reportsApi.getAll(filter || undefined)
      return data
    },
    enabled: tab === 'reports',
  })

  const handleMutation = useMutation({
    mutationFn: ({ id, status, blockUser, blockProduct }: any) =>
      reportsApi.handle(id, { status, blockUser, blockProduct }),
    onSuccess: () => {
      toast.success('Đã xử lý báo cáo')
      refetchReports()
      refetchUsers()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Xử lý thất bại')
    }
  })

  // ─── Users ────────────────────────────────────────────────
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await usersApi.getAll()
      return data
    },
    enabled: tab === 'users',
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleActive(id),
    onSuccess: (res) => {
      const updated = res.data
      toast.success(updated.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản')
      refetchUsers()
      if (selectedUser?.id === updated.id) {
        setSelectedUser({ ...selectedUser, isActive: updated.isActive })
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Thao tác thất bại')
    }
  })

  const isLoading = tab === 'reports' ? reportsLoading : usersLoading

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoaderCircle className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-lg animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <ShieldAlert className="text-primary" />
          Quản lý hệ thống
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('reports')}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
            tab === 'reports'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <FileWarning size={17} />
          Báo cáo vi phạm
        </button>
        <button
          onClick={() => setTab('users')}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
            tab === 'users'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <Users size={17} />
          Quản lý người dùng
        </button>
      </div>

      {/* ═══════════════════ REPORTS TAB ═══════════════════ */}
      {tab === 'reports' && (
        <>
          <div className="flex justify-end">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field max-w-[200px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ</option>
              <option value="REVIEWED">Đã xem</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="DISMISSED">Đã bỏ qua</option>
            </select>
          </div>

          <div className="glass-card overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container border-b border-outline-variant/30">
                  <tr>
                    <th className="p-4 font-semibold text-on-surface">Ngày</th>
                    <th className="p-4 font-semibold text-on-surface">Lý do</th>
                    <th className="p-4 font-semibold text-on-surface">Người báo cáo</th>
                    <th className="p-4 font-semibold text-on-surface">Đối tượng</th>
                    <th className="p-4 font-semibold text-on-surface">Trạng thái</th>
                    <th className="p-4 font-semibold text-on-surface">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {reports?.map((report) => (
                    <tr key={report.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-4 text-on-surface-variant whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-on-surface">{report.reason}</div>
                        <div className="text-xs text-on-surface-variant max-w-[200px] truncate" title={report.details}>
                          {report.details || 'Không có chi tiết'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <UserIcon size={14} className="text-primary" />
                          <span className="text-on-surface">{report.reporter?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {report.targetUser && (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-on-surface">
                              <UserIcon size={14} className="text-error" />
                              <span>{report.targetUser.name}</span>
                            </div>
                            {!report.targetUser.isActive && (
                              <span className="text-[10px] font-bold text-error bg-error/10 px-1.5 rounded w-fit">ĐÃ KHÓA</span>
                            )}
                          </div>
                        )}
                        {report.targetProduct && (
                          <div className="flex flex-col gap-1 mt-2">
                            <Link to={`/products/${report.targetProductId}`} className="flex items-center gap-1 text-primary hover:underline">
                              <Package size={14} />
                              <span className="truncate max-w-[120px]">{report.targetProduct.title}</span>
                            </Link>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          report.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' :
                          report.status === 'RESOLVED' ? 'bg-green-500/20 text-green-500' :
                          report.status === 'DISMISSED' ? 'bg-surface-variant text-on-surface-variant' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {report.status === 'PENDING' ? 'Đang chờ' :
                           report.status === 'RESOLVED' ? 'Đã giải quyết' :
                           report.status === 'DISMISSED' ? 'Đã bỏ qua' : report.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {report.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleMutation.mutate({ id: report.id, status: 'RESOLVED', blockProduct: !!report.targetProduct })}
                                className="p-1.5 bg-green-500/10 text-green-600 rounded hover:bg-green-500/20 transition-colors"
                                title="Giải quyết & Xóa sản phẩm"
                              >
                                <CheckCircle size={18} />
                              </button>
                              {report.targetUser && (
                                <button
                                  onClick={() => {
                                    if(confirm('Bạn có chắc muốn khóa tài khoản này?')) {
                                      handleMutation.mutate({ id: report.id, status: 'RESOLVED', blockUser: true })
                                    }
                                  }}
                                  className="p-1.5 bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
                                  title="Giải quyết & Khóa tài khoản"
                                >
                                  <AlertTriangle size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleMutation.mutate({ id: report.id, status: 'DISMISSED' })}
                                className="p-1.5 bg-surface-variant text-on-surface-variant rounded hover:bg-surface-variant/80 transition-colors"
                                title="Bỏ qua"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reports?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                        Không có báo cáo nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════ USERS TAB ═══════════════════ */}
      {tab === 'users' && (
        <div className="flex gap-lg flex-col lg:flex-row">
          {/* User list */}
          <div className="glass-card overflow-hidden rounded-xl flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container border-b border-outline-variant/30">
                  <tr>
                    <th className="p-4 font-semibold text-on-surface">Người dùng</th>
                    <th className="p-4 font-semibold text-on-surface">Vai trò</th>
                    <th className="p-4 font-semibold text-on-surface">Tin đăng</th>
                    <th className="p-4 font-semibold text-on-surface">Trạng thái</th>
                    <th className="p-4 font-semibold text-on-surface">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-b border-outline-variant/20 transition-colors cursor-pointer ${
                        selectedUser?.id === u.id
                          ? 'bg-primary/5'
                          : 'hover:bg-surface-container-low'
                      }`}
                      onClick={() => setSelectedUser(u)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-on-surface">{u.name}</div>
                            <div className="text-xs text-on-surface-variant">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          u.role === 'ADMIN' ? 'bg-primary/15 text-primary' : 'bg-surface-variant text-on-surface-variant'
                        }`}>
                          {u.role === 'ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        {(u as any)._count?.products ?? 0}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          u.isActive ? 'bg-green-500/15 text-green-600' : 'bg-error/15 text-error'
                        }`}>
                          {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => {
                              const action = u.isActive ? 'khóa' : 'mở khóa'
                              if (confirm(`Bạn có chắc muốn ${action} tài khoản "${u.name}"?`)) {
                                toggleActiveMutation.mutate(u.id)
                              }
                            }}
                            className={`p-1.5 rounded transition-colors ${
                              u.isActive
                                ? 'bg-error/10 text-error hover:bg-error/20'
                                : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                            }`}
                            title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {u.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        Không có người dùng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User detail panel */}
          <div className="w-full lg:w-80 shrink-0">
            {selectedUser ? (
              <div className="glass-card rounded-xl p-6 space-y-5 sticky top-24">
                <div className="flex flex-col items-center text-center gap-3">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="h-20 w-20 rounded-full object-cover border-4 border-primary-container" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-on-primary border-4 border-primary-container">
                      {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">{selectedUser.name}</h3>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      selectedUser.isActive ? 'bg-green-500/15 text-green-600' : 'bg-error/15 text-error'
                    }`}>
                      {selectedUser.isActive ? '● Hoạt động' : '● Đã khóa'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Mail size={16} className="shrink-0" />
                    <span className="truncate">{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <Phone size={16} className="shrink-0" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <MapPin size={16} className="shrink-0" />
                      <span>{selectedUser.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <CalendarDays size={16} className="shrink-0" />
                    <span>Tham gia {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Package size={16} className="shrink-0" />
                    <span>{(selectedUser as any)._count?.products ?? 0} tin đăng</span>
                  </div>
                </div>

                {selectedUser.role !== 'ADMIN' && (
                  <button
                    onClick={() => {
                      const action = selectedUser.isActive ? 'khóa' : 'mở khóa'
                      if (confirm(`Bạn có chắc muốn ${action} tài khoản "${selectedUser.name}"?\n\n${
                        selectedUser.isActive
                          ? 'Toàn bộ bài đăng của người dùng này sẽ bị ẩn khỏi trang web.'
                          : 'Toàn bộ bài đăng của người dùng này sẽ được hiển thị lại.'
                      }`)) {
                        toggleActiveMutation.mutate(selectedUser.id)
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-bold text-sm transition-colors ${
                      selectedUser.isActive
                        ? 'bg-error/10 text-error hover:bg-error/20'
                        : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                    }`}
                  >
                    {selectedUser.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                    {selectedUser.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  </button>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center text-on-surface-variant gap-3 min-h-[200px]">
                <UserIcon size={36} className="text-outline" />
                <p className="text-sm">Chọn một người dùng từ danh sách để xem thông tin chi tiết</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
