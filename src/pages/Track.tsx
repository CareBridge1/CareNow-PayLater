import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Loader2, 
  Link2, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  Fingerprint,
  Heart,
  CreditCard,
  CalendarDays,
  ExternalLink,
  User,
  ArrowLeft
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import api from '../services/api'
import { formatCurrency } from '../utils/formatCurrency'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PatientLink {
  id: string
  amount: number
  description?: string
  status: string
  createdAt: string
  user?: { hospitalName: string }
  hospital?: { hospitalName: string }
  transactions: any[]
}

export default function Track() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [links, setLinks] = useState<PatientLink[]>([])
  const [patientData, setPatientData] = useState<any>(null)

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact) return
    setLoading(true)
    setError('')
    try {
      await api.post('/patients/verify-contact', { contact })
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/patients/confirm-otp', { contact, otp })
      const { token, patient } = res.data
      localStorage.setItem('patient_token', token)
      setPatientData(patient)
      await fetchHistory(token)
      setStep(3)
    } catch (err: any) {
      setError('Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async (token: string) => {
    try {
      const res = await api.get(`/patients/${contact}/payment-links`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLinks(res.data.links)
    } catch (err) {
      console.error('Failed to fetch history')
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'PAID') return <Badge className="bg-green-500 hover:bg-green-600 border-0"><CheckCircle2 className="size-3 mr-1" /> Paid</Badge>
    if (status === 'PARTIAL') return <Badge variant="secondary">Partial</Badge>
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="size-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-black text-base tracking-tighter">CareNow<span className="text-primary">PayLater</span></span>
          </Link>
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-bold text-xs hidden sm:flex">
            <ShieldCheck className="size-3 mr-1" /> Secure Portal
          </Badge>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Step 1: Find Account */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Track Your Bill</h1>
              <p className="text-muted-foreground font-medium mt-1">Enter your contact to access your payment history.</p>
            </div>

            <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                {error && (
                  <div className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                    {error}
                  </div>
                )}
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Phone or Email</Label>
                    <div className="relative group">
                      <Fingerprint className="size-5 text-muted-foreground/40 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                      <Input
                        autoFocus
                        placeholder="08012345678 or you@email.com"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        className="h-12 pl-10 rounded-xl bg-muted/20 border-border/40 font-bold"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-black shadow-md shadow-primary/10">
                    {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Search className="size-4 mr-2" />}
                    Send Secure Code
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Image teaser */}
            <Card className="border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
              <div className="h-48 relative">
                <img src="/img-hospital-patient.png" alt="Patient tracking payments" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">Patient Portal</p>
                  <p className="font-black text-lg">Safe. Secure. Simple.</p>
                </div>
              </div>
            </Card>

            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Verify Identity</h1>
              <p className="text-muted-foreground font-medium mt-1">6-digit code sent to <span className="text-foreground font-bold">{contact}</span></p>
            </div>

            <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                {error && (
                  <div className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                    {error}
                  </div>
                )}
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <Input
                    autoFocus
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    className="h-16 text-center text-3xl tracking-[0.5em] font-black rounded-xl bg-muted/20 border-border/40"
                  />
                  <Button type="submit" disabled={loading || otp.length < 6} className="w-full h-12 rounded-xl font-black shadow-md shadow-primary/10">
                    {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                    Verify & Access
                  </Button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium underline underline-offset-4">
                    Change contact
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Records */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Patient Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <User className="size-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-foreground">{patientData?.name || 'Welcome Back'}</h1>
                  <p className="text-sm text-muted-foreground font-medium">{contact}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full font-bold" onClick={() => {
                localStorage.removeItem('patient_token')
                setStep(1); setContact(''); setOtp('')
              }}>
                Sign Out
              </Button>
            </div>

            {links.length === 0 ? (
              <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
                <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
                  <div className="size-16 bg-muted rounded-2xl flex items-center justify-center">
                    <Link2 className="size-8 text-muted-foreground/30" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground">No billing records</h3>
                    <p className="text-sm text-muted-foreground font-medium">No payment links found for this contact.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {links.map(link => {
                  const amountPaid = (link.transactions || []).filter(t => t.status === 'SUCCESS').reduce((sum, t) => sum + t.amount, 0)
                  const pct = Math.round((amountPaid / link.amount) * 100)
                  const hospitalName = link.user?.hospitalName || link.hospital?.hospitalName || 'Health Facility'

                  return (
                    <Card key={link.id} className="border-border/50 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3 border-b border-border/30">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-muted rounded-xl flex items-center justify-center text-primary">
                              <CreditCard className="size-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-black">{hospitalName}</CardTitle>
                              <CardDescription className="text-xs">{link.description || 'Medical Treatment'}</CardDescription>
                            </div>
                          </div>
                          <StatusBadge status={link.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Bill</p>
                            <p className="text-xl font-black tabular-nums">{formatCurrency(link.amount)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Amount Paid</p>
                            <p className="text-xl font-black tabular-nums text-green-500">{formatCurrency(amountPaid)}</p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1 text-muted-foreground">
                            <span>Repayment Progress</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                            <CalendarDays className="size-3" />
                            {new Date(link.createdAt).toLocaleDateString()}
                          </div>
                          <Button asChild size="sm" variant={link.status === 'PAID' ? 'outline' : 'default'} className="rounded-full font-bold h-8 px-4">
                            <Link to={`/pay/${link.id}`}>
                              {link.status === 'PAID' ? 'View' : 'Pay Now'}
                              <ExternalLink className="size-3 ml-1.5" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
