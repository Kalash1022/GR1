import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { toast } from 'react-hot-toast'
import { User, Mail, Lock, Phone, MapPin, Loader, ArrowRight, Package, Search, ShoppingBag } from 'lucide-react'

export default function RegisterPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [phone,    setPhone]    = useState('')
  const [address,  setAddress]  = useState('')
  const [role, setRole] = useState<'SEEKER' | 'PROVIDER'>('SEEKER')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authApi.register({ name, email, password, role })
      login(data.user, data.accessToken)
      toast.success('Registration successful! Welcome 🎉')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, top: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', zIndex: 10, overflowY: 'auto' }}>
      <div className="w-full animate-slide-up" style={{ maxWidth: '460px', margin: 'auto' }}>

        <div className="glass-card rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>

          {/* Top accent */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#ec4899)' }} />

          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#ec4899)' }}>
                <Package size={22} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Create Account</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-surface-500)' }}>
                  Join the SecondHand community
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>
                  I want to…
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'SEEKER',   label: 'Find & Buy',   Icon: Search,     desc: 'Browse and purchase items' },
                    { value: 'PROVIDER', label: 'Sell & Give',  Icon: ShoppingBag, desc: 'List items for others' },
                  ].map(({ value, label, Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value as any)}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: role === value ? 'rgba(79,70,229,0.2)' : 'rgba(15,23,42,0.4)',
                        border: `1px solid ${role === value ? 'rgba(129,140,248,0.4)' : 'rgba(148,163,184,0.1)'}`,
                        color: role === value ? 'white' : 'var(--color-surface-500)',
                      }}
                    >
                      <Icon size={18} color={role === value ? '#818cf8' : 'currentColor'} />
                      <span>{label}</span>
                      <span className="text-[10px] font-normal" style={{ color: 'var(--color-surface-600)' }}>{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={15}
                    style={{ color: 'var(--color-surface-600)' }} />
                  <input type="text" required className="input-field pl-9" placeholder="Nguyen Van A"
                    value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={15}
                    style={{ color: 'var(--color-surface-600)' }} />
                  <input type="email" required className="input-field pl-9" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={15}
                    style={{ color: 'var(--color-surface-600)' }} />
                  <input type="password" required minLength={6} className="input-field pl-9" placeholder="Min. 6 characters"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              {/* Phone + Address in a 2-col grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14}
                      style={{ color: 'var(--color-surface-600)' }} />
                    <input type="text" className="input-field pl-9" placeholder="0901234567"
                      value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={14}
                      style={{ color: 'var(--color-surface-600)' }} />
                    <input type="text" className="input-field pl-9" placeholder="Ho Chi Minh City"
                      value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 gap-2 mt-1">
                {loading ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm" style={{ color: 'var(--color-surface-500)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline"
                style={{ color: 'var(--color-primary-400)' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
