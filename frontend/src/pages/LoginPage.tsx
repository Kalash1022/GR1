import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { toast } from 'react-hot-toast'
import { Lock, Mail, Loader, ArrowRight, Package } from 'lucide-react'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authApi.login({ email, password })
      login(data.user, data.accessToken)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, top: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', zIndex: 10 }}>
      <div className="w-full animate-slide-up" style={{ maxWidth: '420px' }}>

        {/* Card */}
        <div className="glass-card rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>

          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#ec4899)' }} />

          <div className="p-8 space-y-7">
            {/* Logo + Header */}
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                <Package size={22} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-surface-500)' }}>
                  Sign in to your SecondHand account
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={15}
                    style={{ color: 'var(--color-surface-600)' }} />
                  <input
                    type="email"
                    required
                    className="input-field pl-9"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--color-surface-400)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={15}
                    style={{ color: 'var(--color-surface-600)' }} />
                  <input
                    type="password"
                    required
                    className="input-field pl-9"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 gap-2 mt-1"
              >
                {loading ? (
                  <Loader className="animate-spin" size={16} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="divider flex-1" />
              <span className="text-xs" style={{ color: 'var(--color-surface-600)' }}>or</span>
              <div className="divider flex-1" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm" style={{ color: 'var(--color-surface-500)' }}>
              New to SecondHand?{' '}
              <Link to="/register" className="font-semibold hover:underline"
                style={{ color: 'var(--color-primary-400)' }}>
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
