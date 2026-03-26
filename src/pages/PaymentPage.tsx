import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { paymentService, type PaymentLink } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import {
  CheckCircle2, AlertCircle, Loader2, Lock, ShieldCheck,
  User, FileText, ChevronRight, Phone, Mail, Building2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [link, setLink] = useState<PaymentLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)
  const [selected, setSelected] = useState<number>(0)
  const [patientContact, setPatientContact] = useState('')

  useEffect(() => {
    if (!id) return
    paymentService.getLinkById(id)
      .then(d => { setLink(d); if (d.patientContact) setPatientContact(d.patientContact) })
      .catch(() => setError('Payment link not found or has expired.'))
      .finally(() => setLoading(false))
  }, [id])

  const totalBill = link?.amount ?? 0
  const amountPaid = link?.amountPaid ?? 0
  const balance = totalBill - amountPaid
  const pct = totalBill > 0 ? Math.round((amountPaid / totalBill) * 100) : 0
  const isPaid = amountPaid > 0

  const presets = useMemo(() => {
    if (balance <= 0) return []
    if (balance <= 5000) return [balance]
    const half = Math.ceil(balance / 2 / 1000) * 1000
    const quarter = Math.ceil(balance / 4 / 1000) * 1000
    return Array.from(new Set(
      [balance, half < balance ? half : null, quarter < half ? quarter : null]
        .filter(Boolean) as number[]
    )).sort((a, b) => b - a)
  }, [balance])

  useEffect(() => {
    if (presets.length > 0 && selected === 0) setSelected(presets[0])
  }, [presets, selected])

  const handlePay = async () => {
    if (!link || selected <= 0) return
    setPaying(true)
    try {
      const result = await paymentService.initiatePayment(link.id, {
        amount: selected,
        patientEmail: patientContact.includes('@') ? patientContact : undefined,
        patientName: link.patientName,
      })
      toast.success('Opening secure payment...')
      setTimeout(() => {
        const run = () => {
          setPaying(false)
          ;(window as any).webpayCheckout({
            ...result.formParams,
            onComplete: () => navigate(`/pay/${link.id}/verify?ref=${result.transactionRef}`),
          })
        }
        if (result.checkoutScriptUrl && result.formParams) {
          if (!(window as any).webpayCheckout) {
            const s = document.createElement('script')
            s.src = result.checkoutScriptUrl; s.onload = run
            document.body.appendChild(s)
          } else run()
        } else if (result.formParams) {
          const form = document.createElement('form')
          form.method = 'POST'; form.action = result.paymentUrl
          Object.entries(result.formParams).forEach(([k, v]) => {
            const inp = document.createElement('input')
            inp.type = 'hidden'; inp.name = k; inp.value = v
            form.appendChild(inp)
          })
          document.body.appendChild(form); form.submit()
        } else if (result.paymentUrl.includes('demo=true')) {
          navigate(`/pay/${link.id}/verify?ref=${result.transactionRef}&demo=true`)
        } else window.location.href = result.paymentUrl
      }, 600)
    } catch {
      toast.error('Could not initiate payment. Please try again.')
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Loading payment…</p>
      </div>
    </div>
  )

  if (error || !link) return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border/40 bg-card/80 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-black tracking-tight">
            CareNow<span className="text-primary">PayLater</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <ShieldCheck className="size-3" /> Secure Portal
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">

          {/* Icon */}
          <div className="size-20 bg-destructive/8 rounded-3xl flex items-center justify-center mx-auto">
            <AlertCircle className="size-10 text-destructive" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black">Payment Link Not Found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We couldn't load this payment page. The link may be invalid, already used, or it may have expired.
            </p>
          </div>

          {/* Possible reasons */}
          <div className="rounded-2xl border border-border/40 bg-muted/20 p-5 text-left space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Possible reasons</p>
            {[
              'The link was copied or typed incorrectly',
              'The payment has already been completed',
              'The hospital cancelled or expired this link',
              'The link was only valid for a limited time',
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <div className="size-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                {r}
              </div>
            ))}
          </div>

          {/* What to do */}
          <div className="rounded-2xl border border-border/40 bg-muted/20 p-5 text-left space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">What you can do</p>
            {[
              'Contact the hospital that sent you this link',
              'Ask them to resend the payment link via SMS or email',
              'Check your messages for the original link',
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-foreground font-medium">
                <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {r}
              </div>
            ))}
          </div>

          {/* Interswitch trust */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3" />
            <span>Payments on this portal are secured by Interswitch · PCI-DSS Certified</span>
          </div>

        </div>
      </div>
    </div>
  )

  if (balance <= 0 || link.status === 'PAID') return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-3 max-w-xs">
        <div className="size-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-7 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">All Settled!</h1>
        <p className="text-sm text-muted-foreground">This bill has been fully paid. Thank you for using {link.hospital}.</p>
        <p className="text-3xl font-black text-primary tabular-nums pt-2">{formatCurrency(totalBill)}</p>
      </div>
    </div>
  )

  const presetMeta = ['Clears full balance', 'Half of balance', 'Quarter of balance']

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">

      {/* ══ SINGLE UNIFIED HEADER ══════════════════════════════════ */}
      <header className="w-full sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-screen-2xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          {/* Left: brand */}
          <Link to="/" className="text-sm font-black tracking-tight text-foreground shrink-0">
            CareNow<span className="text-primary">PayLater</span>
          </Link>

          {/* Center: hospital + status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground truncate">{link.hospital || 'Healthcare Provider'}</span>
            <Badge className={`text-[10px] font-bold border-0 shrink-0 ${
              link.status === 'PAID'    ? 'bg-green-500/10 text-green-700'
              : link.status === 'PARTIAL' ? 'bg-amber-500/10 text-amber-700'
              : 'bg-blue-500/10 text-blue-700'
            }`}>
              {link.status === 'PARTIAL' ? 'Partial' : link.status === 'PAID' ? 'Paid' : 'Pending'}
            </Badge>
          </div>

          {/* Right: security */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 shrink-0">
            <ShieldCheck className="size-3" />
            <span className="hidden sm:inline">Secure</span>
          </div>
        </div>
      </header>

      {/* ══ TWO COLUMNS BELOW HEADER ════════════════════════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ── LEFT ─────────────────────────────────────────────────── */}
        <div className="lg:w-[42%] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] flex flex-col border-r border-border/30 bg-card overflow-hidden">

          {/* Hero */}
          <div className="relative h-44 lg:h-[36%] shrink-0">
            <img
              src="/images/hospital_patient.png"
              alt="Hospital"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge className="bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest border-0 px-2 py-0.5 rounded-full">
                  ✓ Verified Hospital
                </Badge>
              </div>
              <h2 className="text-xl font-black text-foreground leading-tight">{link.hospital || 'Healthcare Provider'}</h2>
            </div>
          </div>

          {/* Info rows */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Detail rows */}
            <div className="rounded-2xl border border-border/40 bg-muted/20 divide-y divide-border/30 overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-3">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Provider</p>
                  <p className="text-sm font-semibold text-foreground">{link.hospital || 'General Hospital'}</p>
                </div>
              </div>
              {link.patientName && (
                <div className="px-4 py-3 flex items-center gap-3">
                  <User className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Patient</p>
                    <p className="text-sm font-semibold text-foreground">{link.patientName}</p>
                  </div>
                </div>
              )}
              {patientContact && (
                <div className="px-4 py-3 flex items-center gap-3">
                  {patientContact.includes('@')
                    ? <Mail className="size-4 text-muted-foreground shrink-0" />
                    : <Phone className="size-4 text-muted-foreground shrink-0" />}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
                    <p className="text-sm font-semibold text-foreground">{patientContact}</p>
                  </div>
                </div>
              )}
              {link.description && (
                <div className="px-4 py-3 flex items-start gap-3">
                  <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Treatment</p>
                    <p className="text-sm font-semibold text-foreground">{link.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bill summary */}
            <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Bill</p>
                  <p className="text-lg font-black tabular-nums mt-0.5">{formatCurrency(totalBill)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Balance Due</p>
                  <p className="text-lg font-black tabular-nums text-destructive mt-0.5">{formatCurrency(balance)}</p>
                </div>
              </div>
              {isPaid && (
                <div className="border-t border-border/30 pt-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Already Paid</p>
                  <p className="text-base font-bold tabular-nums text-green-600 mt-0.5">{formatCurrency(amountPaid)}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>{isPaid ? `${pct}% settled` : 'No payments yet'}</span>
                  <span>{formatCurrency(amountPaid)} / {formatCurrency(totalBill)}</span>
                </div>
                <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(pct, isPaid ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interswitch trust badge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/30 bg-muted/10">
              <img src="/images/interswitch.png" alt="Interswitch" className="h-5 w-auto object-contain opacity-70" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment Partner</p>
                <p className="text-xs font-semibold text-foreground">Interswitch Group · PCI-DSS Certified</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-5 py-8 lg:px-12">
          <div className="max-w-sm mx-auto w-full space-y-6">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5">Flexible Payment</p>
              <h2 className="text-2xl font-black leading-snug">How much do you want to pay today?</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Balance due: <strong className="text-foreground">{formatCurrency(balance)}</strong>.
                Pay what you can — installments are welcome.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              {presets.map((amt, i) => {
                const active = selected === amt
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelected(amt)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer text-left ${
                      active
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10'
                        : 'border-border/50 bg-card hover:border-primary/30 hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${active ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                        {active && <div className="size-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <span className={`block font-bold text-base tabular-nums ${active ? 'text-primary' : 'text-foreground'}`}>
                          {formatCurrency(amt)}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{presetMeta[i]}</span>
                      </div>
                    </div>
                    {i === 0 && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-500/10 px-2 py-1 rounded-full shrink-0">Best</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* What happens next */}
            <div className="rounded-xl border border-border/40 bg-muted/10 px-4 py-3 space-y-1.5 text-xs text-muted-foreground">
              <p className="font-bold text-foreground text-[10px] uppercase tracking-widest mb-2">After you pay</p>
              {[
                'Payment processed securely via Interswitch',
                'E-receipt sent to your registered contact',
                'Pay remaining balance anytime',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <ChevronRight className="size-3 text-primary shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Button
                onClick={handlePay}
                disabled={paying || selected <= 0}
                className="w-full h-12 rounded-xl font-bold text-base"
              >
                {paying
                  ? <><Loader2 className="size-4 animate-spin mr-2" />Processing…</>
                  : `Pay ${formatCurrency(selected)} Now`
                }
              </Button>
              <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="size-3" /> 256-bit SSL · Secured by Interswitch · PCI-DSS
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
