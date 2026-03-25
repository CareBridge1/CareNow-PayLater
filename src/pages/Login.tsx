import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Heart, Mail, Lock, Building2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  )
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', hospitalName: '' })
  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        if (!form.hospitalName.trim()) {
          toast.error('Hospital name is required')
          setLoading(false)
          return
        }
        await register(form.email, form.password, form.hospitalName)
        toast.success('Account created! Welcome to CareNow!')
      }
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(axiosMsg || msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-lg">CareNow<span className="text-accent">PayLater</span></span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-white leading-tight">
            Give patients the care they need,<br />
            <span className="text-accent">before they can afford it.</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-md">
            Join 500+ hospitals generating instant payment links. No complex systems.
            No integration stress. Just results.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Links Created', value: '24,000+' },
              { label: 'Success Rate', value: '96%' },
              { label: 'Avg. Link Time', value: '45 sec' },
              { label: 'Hospitals', value: '500+' },
            ].map((s) => (
              <div key={s.label} className="glass-card text-center py-4">
                <p className="text-2xl font-black text-accent">{s.value}</p>
                <p className="text-blue-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-400 text-sm relative z-10">© 2026 CareNow PayLater</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-brand-700 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Tab switcher */}
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-8">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-gradient-brand text-white shadow-brand'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-gradient-brand text-white shadow-brand'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Get Started
            </button>
          </div>

          <div className="card animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {tab === 'login'
                ? 'Sign in to your hospital dashboard'
                : 'Join thousands of hospitals using CareNow'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <Input
                  label="Hospital Name"
                  name="hospitalName"
                  id="hospitalName"
                  placeholder="e.g. Lagos General Hospital"
                  value={form.hospitalName}
                  onChange={handleChange}
                  required
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
              )}
              <Input
                label="Email Address"
                type="email"
                name="email"
                id="email"
                placeholder="hospital@example.com"
                value={form.email}
                onChange={handleChange}
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-brand-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Button type="submit" loading={loading} className="w-full mt-2">
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                className="text-brand-700 font-semibold hover:underline"
              >
                {tab === 'login' ? 'Register your hospital' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
