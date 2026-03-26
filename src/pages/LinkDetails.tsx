import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentService } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink'
import { Copy, MessageCircle, ArrowLeft, Mail, AlertCircle, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { Button } from '../components/ui/button'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { Badge } from '../components/ui/badge'

export default function LinkDetails() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [link, setLink] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const data = await paymentService.getLinkById(id!)
        setLink(data)
      } catch {
        toast.error('Failed to load link details')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchLink()
  }, [id])

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading details...</div>
  }

  if (!link) {
    return <div className="p-12 text-center text-slate-500">Link not found.</div>
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(link.linkUrl)
    toast.success('Link copied!')
  }

  const amountPaid = link.amountPaid || 0
  const balance = link.amount - amountPaid

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Button variant="ghost" className="mb-6 -ml-4 text-slate-500" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Details</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`
              ${link.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                link.status === 'PARTIAL' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {link.status === 'PAID' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
              {link.status}
            </Badge>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4 ml-1" />
              {new Date(link.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCopy} className="bg-white">
            <Copy className="w-4 h-4 mr-2" /> Copy Link
          </Button>
          <Button asChild className="bg-[#25D366] hover:bg-[#20bd5a] text-white">
            <a href={generateWhatsAppLink(link.linkUrl, user?.hospitalName || 'Hospital', link.amount)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" /> Resend WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Info & Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold border-b border-slate-100 pb-4 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm tracking-wide text-slate-500 uppercase font-semibold mb-1">Name</p>
                <p className="font-semibold text-slate-900">{link.patientName || 'Anonymous'}</p>
              </div>
              <div>
                <p className="text-sm tracking-wide text-slate-500 uppercase font-semibold mb-1">Contact</p>
                <p className="font-semibold text-slate-900">{link.patientContact}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-sm tracking-wide text-slate-500 uppercase font-semibold mb-1">Description</p>
                <p className="text-slate-900">{link.description || 'Medical Treatment / Consultation'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold border-b border-slate-100 pb-4 mb-4">Transaction Timeline</h3>
            {(!link.transactions || link.transactions.length === 0) ? (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {link.transactions.map((t: any) => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{formatCurrency(t.amount)}</span>
                        {t.status === 'SUCCESS' ? (
                          <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded uppercase">Paid</span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded uppercase">Failed</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">Ref: {t.transactionRef}</p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                      <div className="text-xs mt-0.5">{new Date(t.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Summary */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-6 text-slate-200">Financial Summary</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(link.amount)}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Amount Paid</p>
                <p className="text-xl font-bold text-green-400">{formatCurrency(amountPaid)}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-slate-400 text-sm mb-1">Outstanding Balance</p>
                <p className="text-xl font-bold text-amber-400">{formatCurrency(balance)}</p>
              </div>
            </div>
            
            {link.status === 'PARTIAL' && (
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-1 text-slate-300">
                  <span>Collection Progress</span>
                  <span>{Math.round((amountPaid / link.amount) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(amountPaid / link.amount) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <Mail className="w-5 h-5 text-blue-600 mb-3" />
            <h4 className="font-semibold text-blue-900 mb-1">Client Commmunication</h4>
            <p className="text-sm text-blue-800/80 mb-4">Patient lost their link? Resend the secure checkout portal to their registered email.</p>
            <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-100">
              Send Email Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
