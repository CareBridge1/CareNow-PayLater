import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { paymentService, type PaymentLink } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink'
import Button from '../components/Button'
import Input from '../components/Input'
import {
  Plus, Link2, Copy, Share2, CheckCircle2, Clock, Banknote,
  TrendingUp, Receipt, X, AlertCircle, MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    PENDING: 'badge-pending',
    PARTIAL: 'badge-partial',
    PAID: 'badge-paid',
    FAILED: 'badge-failed',
  }
  const labels: Record<string, string> = {
    PENDING: '⏳ Pending',
    PARTIAL: '🔄 Partial',
    PAID: '✅ Paid',
    FAILED: '❌ Failed',
  }
  return <span className={map[status] || 'badge-pending'}>{labels[status] || status}</span>
}

const CreateLinkModal = ({
  onClose,
  onCreated,
  hospitalName,
}: {
  onClose: () => void
  onCreated: (link: PaymentLink) => void
  hospitalName: string
}) => {
  const [form, setForm] = useState({ amount: '', patientName: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<PaymentLink | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!amount || amount < 100) {
      toast.error('Minimum amount is ₦100')
      return
    }
    setLoading(true)
    try {
      const { paymentLink } = await paymentService.createLink({
        amount,
        patientName: form.patientName || undefined,
        description: form.description || undefined,
      })
      setCreated(paymentLink)
      onCreated(paymentLink)
      toast.success('Payment link created!')
    } catch {
      toast.error('Failed to create link. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (created) {
      navigator.clipboard.writeText(created.linkUrl)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Payment Link</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!created ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Treatment Amount (₦)"
              type="number"
              placeholder="e.g. 50000"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              required
              min={100}
              leftIcon={<span className="text-gray-400 font-medium text-sm">₦</span>}
            />
            <Input
              label="Patient Name (optional)"
              placeholder="e.g. Adaeze Okonkwo"
              value={form.patientName}
              onChange={(e) => setForm((p) => ({ ...p, patientName: e.target.value }))}
            />
            <Input
              label="Description (optional)"
              placeholder="e.g. Appendectomy surgery"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <Button type="submit" loading={loading} className="w-full">
              Generate Payment Link
            </Button>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Link Created!</p>
                <p className="text-green-700 text-sm">{formatCurrency(created.amount)} · {created.patientName || 'Patient'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Payment Link</p>
              <p className="text-sm font-mono text-brand-700 break-all">{created.linkUrl}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant={copied ? 'secondary' : 'primary'}
                icon={<Copy className="w-4 h-4" />}
                onClick={handleCopy}
                className="flex-1"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <a
                href={generateWhatsAppLink(created.linkUrl, hospitalName, created.amount)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchLinks = useCallback(async () => {
    try {
      const { paymentLinks } = await paymentService.getLinks()
      setLinks(paymentLinks)
    } catch {
      // Backend may not be running — silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const totalAmount = links.reduce((s, l) => s + l.amount, 0)
  const totalPaid = links.filter((l) => l.status === 'PAID').length
  const totalPending = links.filter((l) => l.status === 'PENDING').length

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm mb-1">Hospital Dashboard</p>
              <h1 className="text-3xl font-black">{user?.hospitalName}</h1>
              <p className="text-blue-200 text-sm mt-1">{user?.email}</p>
            </div>
            <Button
              variant="accent"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowModal(true)}
              className="shadow-xl"
            >
              Generate Payment Link
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Links', value: links.length, icon: Link2, color: 'bg-white/10' },
              { label: 'Total Amount', value: formatCurrency(totalAmount), icon: Banknote, color: 'bg-white/10' },
              { label: 'Fully Paid', value: totalPaid, icon: CheckCircle2, color: 'bg-white/10' },
              { label: 'Pending', value: totalPending, icon: Clock, color: 'bg-white/10' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.color} backdrop-blur-sm rounded-2xl p-4 border border-white/20`}>
                <stat.icon className="w-5 h-5 text-blue-200 mb-2" />
                <p className="text-white text-xl font-bold">{stat.value}</p>
                <p className="text-blue-300 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-600" />
            Payment Links
          </h2>
          <Button
            variant="secondary"
            onClick={fetchLinks}
            size="sm"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-600 border-t-transparent" />
          </div>
        ) : links.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No payment links yet</h3>
            <p className="text-gray-500 mb-6">Create your first link and start collecting payments</p>
            <Button onClick={() => setShowModal(true)} icon={<Plus className="w-5 h-5" />}>
              Create First Link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="card-hover">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-bold text-gray-900">
                        {link.patientName || 'Anonymous Patient'}
                      </h3>
                      <StatusBadge status={link.status} />
                    </div>
                    {link.description && (
                      <p className="text-gray-500 text-sm mb-1">{link.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-semibold text-brand-700">{formatCurrency(link.amount)}</span>
                      {link.amountPaid !== undefined && link.amountPaid > 0 && (
                        <span className="text-green-600">
                          {formatCurrency(link.amountPaid)} paid
                        </span>
                      )}
                      <span>{new Date(link.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-mono truncate max-w-xs">{link.linkUrl}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(link.linkUrl)}
                      className="p-2 hover:bg-brand-50 rounded-xl transition-colors text-brand-600"
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={generateWhatsAppLink(link.linkUrl, user?.hospitalName || 'Hospital', link.amount)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-green-50 rounded-xl transition-colors text-green-600"
                      title="Share via WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                    <a
                      href={link.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs btn-ghost text-brand-600"
                    >
                      Preview →
                    </a>
                  </div>
                </div>

                {/* Progress bar for partial payments */}
                {link.status === 'PARTIAL' && link.amountPaid !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Payment Progress</span>
                      <span>{Math.round((link.amountPaid / link.amount) * 100)}% collected</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-brand-600 to-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((link.amountPaid / link.amount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Backend offline notice */}
        {!loading && (
          <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Demo Mode</p>
              <p className="text-amber-700">
                Start the backend server to persist links. Run:{' '}
                <code className="bg-amber-100 px-1 rounded font-mono text-xs">cd backend && npm run dev</code>
              </p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <CreateLinkModal
          onClose={() => setShowModal(false)}
          onCreated={(link) => setLinks((prev) => [link, ...prev])}
          hospitalName={user?.hospitalName || 'Hospital'}
        />
      )}
    </div>
  )
}
