import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentService, type PaymentLink } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import { Heart, Building2 as Hospital, Calendar, CheckCircle2, AlertCircle, Loader2, CreditCard, User, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'

const plans = [
  { id: '1', label: 'Pay in Full', installments: 1, badge: 'Best Value', badgeColor: 'bg-accent text-white' },
  { id: '2', label: '2 Installments', installments: 2, badge: null, badgeColor: '' },
  { id: '3', label: '3 Installments', installments: 3, badge: null, badgeColor: '' },
  { id: '6', label: '6 Installments', installments: 6, badge: 'Easy Pay', badgeColor: 'bg-brand-100 text-brand-700' },
]

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [link, setLink] = useState<PaymentLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('1')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientName, setPatientName] = useState('')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const data = await paymentService.getLinkById(id!)
        setLink(data)
        if (data.patientName) setPatientName(data.patientName)
      } catch {
        setError('Payment link not found or has expired.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchLink()
  }, [id])

  const selectedPlanObj = plans.find((p) => p.id === selectedPlan)!
  const installmentAmount = link
    ? Math.ceil((link.amountRemaining ?? link.amount) / selectedPlanObj.installments * 100) / 100
    : 0

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link) return
    if (!patientEmail) {
      toast.error('Please enter your email address')
      return
    }
    setPaying(true)
    try {
      const result = await paymentService.initiatePayment(link.id, {
        installmentPlan: selectedPlan,
        patientEmail,
        patientName,
      })
      toast.success('Redirecting to payment...')
      // Redirect to Interswitch (or demo success)
      setTimeout(() => {
        if (result.paymentUrl.includes('demo=true')) {
          // Demo mode: simulate success
          navigate(`/pay/${link.id}/verify?ref=${result.transactionRef}&demo=true`)
        } else {
          window.location.href = result.paymentUrl
        }
      }, 1000)
    } catch {
      toast.error('Failed to initiate payment. Please try again.')
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-500">{error || 'This payment link is invalid or has expired.'}</p>
        </div>
      </div>
    )
  }

  if (link.status === 'PAID') {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md text-center shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Paid!</h1>
          <p className="text-gray-500">This payment has been fully completed. Thank you!</p>
          <p className="text-brand-700 font-bold text-2xl mt-4">{formatCurrency(link.amount)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold">CareNow<span className="text-accent">PayLater</span></span>
          </div>
          <p className="text-blue-200 text-sm">Secure Healthcare Payment</p>
        </div>

        {/* Hospital & Amount Card */}
        <div className="glass-card mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Hospital className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">{link.hospital}</p>
              <p className="text-blue-200 text-sm">Healthcare Provider</p>
            </div>
          </div>

          {link.description && (
            <p className="text-blue-200 text-sm mb-3 italic">"{link.description}"</p>
          )}

          <div className="border-t border-white/20 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Amount</p>
                <p className="text-4xl font-black text-white mt-1">{formatCurrency(link.amount)}</p>
              </div>
              {link.status === 'PARTIAL' && link.amountPaid !== undefined && (
                <div className="text-right">
                  <p className="text-accent text-sm font-medium">{formatCurrency(link.amountPaid)} paid</p>
                  <p className="text-white/70 text-sm">{formatCurrency(link.amountRemaining ?? 0)} remaining</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-blue-200 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created {new Date(link.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="bg-white rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Patient Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Details</h3>
            <div className="space-y-3">
              <Input
                label="Full Name"
                placeholder="Your name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
                leftIcon={<Mail className="w-4 h-4" />}
                hint="You'll receive payment receipts at this email"
              />
            </div>
          </div>

          {/* Installment Plans */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Choose Your Plan</h3>
            <p className="text-gray-500 text-sm mb-4">All plans are interest-free. 0% APR.</p>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => {
                const amt = link ? Math.ceil((link.amountRemaining ?? link.amount) / plan.installments * 100) / 100 : 0
                const isSelected = selectedPlan === plan.id
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 shadow-brand'
                        : 'border-gray-200 hover:border-brand-300 bg-white'
                    }`}
                  >
                    {plan.badge && (
                      <span className={`absolute -top-2 left-3 text-xs font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    )}
                    <div className={`w-4 h-4 rounded-full border-2 mb-2 ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-gray-300'} flex items-center justify-center`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-brand-700' : 'text-gray-700'}`}>{plan.label}</p>
                    <p className={`text-lg font-black mt-0.5 ${isSelected ? 'text-brand-900' : 'text-gray-900'}`}>
                      {formatCurrency(amt)}
                    </p>
                    <p className="text-xs text-gray-500">per installment</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>First Payment Today</span>
              <span className="font-semibold">{formatCurrency(installmentAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Total Installments</span>
              <span className="font-semibold">{selectedPlanObj.installments}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Interest Rate</span>
              <span>0% (Free!)</span>
            </div>
          </div>

          <Button
            type="submit"
            loading={paying}
            icon={<CreditCard className="w-5 h-5" />}
            className="w-full text-base py-4"
          >
            Pay {formatCurrency(installmentAmount)} Now
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span>Secured by Interswitch · HIPAA Compliant</span>
          </div>
        </form>
      </div>
    </div>
  )
}
