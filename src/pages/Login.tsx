import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { Heart, ShieldCheck } from 'lucide-react'
import { LoginForm } from '../components/login-form'
import { ThemeToggle } from '../components/ThemeToggle'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              CareNow<span className="text-primary">PayLater</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSubmit={handleSubmit}
              onToggleAuth={() => navigate('/signup')}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-[#1e3a8a] overflow-hidden">
         {/* Background Orbs */}
         <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
         
         <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center text-white space-y-8">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-balance leading-tight">
              Empowering Healthcare with Flexible Payments.
            </h2>
            <p className="text-blue-100 text-lg text-balance leading-relaxed max-w-md">
              Hospitals collect immediately. Patients pay in installments. Zero friction, better care.
            </p>
            
            <div className="pt-8 border-t border-white/10 flex items-center justify-center gap-6 opacity-70">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-sm font-medium">Interswitch Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  )
}
