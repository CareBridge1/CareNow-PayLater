import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  MessageCircle,
  Loader2,
  Mail,
  Send,
  DollarSign,
  User,
  Hash,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency } from '../utils/formatCurrency'
import toast from 'react-hot-toast'
import { paymentService } from '../services/payment.service'

const PLANS = [
  { id: '1', label: 'Full Payment', months: 1 },
  { id: '2', label: '2 Months', months: 2 },
  { id: '3', label: '3 Months', months: 3 },
  { id: '6', label: '6 Months', months: 6 },
]

type Step = 1 | 2

export default function CreateLink() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Fields
  const [amount, setAmount] = useState('')
  const [patientContact, setPatientContact] = useState('')
  const [invoiceRef, setInvoiceRef] = useState('')
  const [selectedPlanId, setSelectedPlanId] = useState('2')

  // Step 2
  const [createdLink, setCreatedLink] = useState<any>(null)
  const [emailDest, setEmailDest] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  const parsedAmount = parseFloat(amount) || 0
  const currentPlan = useMemo(() => PLANS.find(p => p.id === selectedPlanId)!, [selectedPlanId])
  const installment = parsedAmount > 0 ? parsedAmount / currentPlan.months : 0

  // ─── Step 1: Create Link ───────────────────────────────────────────── //
  const handleCreate = async () => {
    if (!amount || parsedAmount <= 0) { toast.error('Enter a valid amount'); return }
    if (!patientContact) { toast.error('Patient contact is required'); return }
    setLoading(true)
    try {
      const { paymentLink } = await paymentService.createLink({
        amount: parsedAmount,
        patientContact,
        description: invoiceRef ? `Invoice: ${invoiceRef}` : undefined,
        duration: currentPlan.months,
        installmentAmount: installment,
      })
      setCreatedLink(paymentLink)
      setEmailDest(patientContact.includes('@') ? patientContact : '')
      setStep(2)
      toast.success('Link created!')
    } catch {
      toast.error('Could not create link. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Step 2: Send email (stub) ─────────────────────────────────────── //
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailDest) return
    setSendingEmail(true)
    await new Promise(r => setTimeout(r, 1200)) // simulate API call
    toast.success(`Payment link sent to ${emailDest}`)
    setSendingEmail(false)
  }

  // ─────────────────────────── STEP 2: Share ─────────────────────────── //
  if (step === 2 && createdLink) {
    return (
      <div className="flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => setStep(1)}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Share Payment Link</h1>
            <p className="text-sm text-muted-foreground font-medium">Send the link to your patient via email or copy it directly.</p>
          </div>
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Link & Actions */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Success badge */}
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              <div className="size-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="font-black text-green-700 dark:text-green-400">Link Created Successfully</p>
                <p className="text-xs text-muted-foreground font-medium">{formatCurrency(createdLink.amount)} · {user?.hospitalName}</p>
              </div>
            </div>

            {/* Payment URL */}
            <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Payment URL</Label>
                <div className="bg-muted/30 rounded-xl p-4 font-mono text-sm break-all border border-border/40 select-all text-muted-foreground leading-relaxed">
                  {createdLink.linkUrl || `https://carenow.app/pay/${createdLink.id}`}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl h-10 font-bold"
                    onClick={() => { navigator.clipboard.writeText(createdLink.linkUrl); toast.success('Copied!') }}
                  >
                    <Copy className="size-4 mr-2" /> Copy Link
                  </Button>
                  <Button
                    className="rounded-xl h-10 font-bold bg-[#25D366] hover:bg-[#20bd5a] border-0 text-white"
                    onClick={() => window.open(`https://wa.me/${patientContact.replace(/\D/g,'')}?text=Pay your medical bill of ${formatCurrency(createdLink.amount)} via this secure link: ${createdLink.linkUrl}`, '_blank')}
                  >
                    <MessageCircle className="size-4 mr-2" /> WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email sender */}
            <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Send via Email</Label>
                </div>
                <form onSubmit={handleSendEmail} className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                    <Input
                      type="email"
                      placeholder="patient@email.com"
                      value={emailDest}
                      onChange={e => setEmailDest(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-border/40 bg-muted/20 font-medium text-sm"
                    />
                  </div>
                  <Button type="submit" disabled={sendingEmail || !emailDest} className="h-10 px-5 rounded-xl font-bold shrink-0">
                    {sendingEmail ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-muted-foreground font-medium" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Bill Summary</Label>
                <div className="space-y-3">
                  {[
                    { label: 'Total Amount', value: formatCurrency(createdLink.amount) },
                    { label: 'Patient Contact', value: patientContact },
                    { label: 'Plan', value: `${currentPlan.label}` },
                    { label: 'Monthly Payment', value: formatCurrency(installment) },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm border-b border-border/20 pb-2 last:border-0 last:pb-0">
                      <span className="text-muted-foreground font-medium">{row.label}</span>
                      <span className="font-bold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/10 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-green-700 dark:text-green-400">Interest Rate</span>
                  <Badge className="bg-green-500 border-0 text-white text-xs">0% APR</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Create another */}
            <Button variant="outline" className="w-full rounded-xl h-10 font-bold" onClick={() => {
              setStep(1); setAmount(''); setPatientContact(''); setInvoiceRef(''); setCreatedLink(null)
            }}>
              + Create Another Link
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────── STEP 1: Create ─────────────────────────── //
  return (
    <div className="flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">New Payment Link</h1>
          <p className="text-sm text-muted-foreground font-medium">Enter bill details and pick an installment plan.</p>
        </div>
      </div>

      {/* Main 2-col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left: Form */}
        <Card className="lg:col-span-3 border-border/50 bg-card rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Bill Amount <span className="text-destructive">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40" />
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-14 pl-12 text-2xl font-black rounded-xl border-border/40 bg-muted/10"
                />
              </div>
              {parsedAmount > 0 && (
                <p className="text-xs text-muted-foreground font-medium ml-1">{formatCurrency(parsedAmount)} invoice total</p>
              )}
            </div>

            {/* Patient Contact */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Patient Contact <span className="text-destructive">*</span></Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                <Input
                  value={patientContact}
                  onChange={e => setPatientContact(e.target.value)}
                  placeholder="+234... or patient@email.com"
                  className="h-12 pl-11 rounded-xl border-border/40 bg-muted/10 font-medium"
                />
              </div>
            </div>

            {/* Invoice Ref */}
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">Invoice Reference <span className="text-muted-foreground/40 normal-case font-medium text-xs">(optional)</span></Label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                <Input
                  value={invoiceRef}
                  onChange={e => setInvoiceRef(e.target.value)}
                  placeholder="INV-2024-001"
                  className="h-12 pl-11 rounded-xl border-border/40 bg-muted/10 font-medium"
                />
              </div>
            </div>

            <Button onClick={handleCreate} disabled={loading} className="w-full h-12 rounded-xl font-black shadow-md shadow-primary/10">
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Generate Payment Link
            </Button>
          </CardContent>
        </Card>

        {/* Right: Installment Preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Plan Selector */}
          <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Installment Plan</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLANS.map(plan => {
                  const amt = parsedAmount > 0 ? parsedAmount / plan.months : null
                  const isSelected = selectedPlanId === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border/40 hover:border-primary/40 bg-muted/5'
                      }`}
                    >
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-muted-foreground/60'}`}>{plan.label}</p>
                      <p className="font-black text-lg mt-0.5 text-foreground">
                        {amt ? formatCurrency(amt) : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">{plan.months === 1 ? 'one-time' : '/month'}</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Live Summary */}
          <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
            <CardContent className="p-5 space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Preview</Label>
              {[
                { label: 'Total Bill', value: parsedAmount > 0 ? formatCurrency(parsedAmount) : '—' },
                { label: 'Plan', value: currentPlan.label },
                { label: 'Each Payment', value: installment > 0 ? formatCurrency(installment) : '—' },
                { label: 'Interest', value: '0% APR', green: true },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm border-b border-border/20 pb-2 last:border-0 last:pb-0">
                  <span className="text-muted-foreground font-medium">{row.label}</span>
                  <span className={`font-bold ${row.green ? 'text-green-600' : 'text-foreground'}`}>{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center font-medium px-2">
            Billing as <strong className="text-foreground">{user?.hospitalName || 'Your Hospital'}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
