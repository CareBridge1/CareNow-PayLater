import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { paymentService } from '../services/payment.service'
import { CheckCircle2, XCircle, Loader2, Heart, ArrowRight, Home, Phone } from 'lucide-react'

export default function Success() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const transactionRef = searchParams.get('ref') || ''
  const isDemo = searchParams.get('demo') === 'true'

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      if (isDemo) {
        // Simulate demo verification
        await new Promise((r) => setTimeout(r, 2000))
        setStatus('success')
        setMessage('Payment verified successfully (demo mode)')
        return
      }

      try {
        const result = await paymentService.verifyTransaction(transactionRef)
        if (result.status === 'SUCCESS') {
          setStatus('success')
          setMessage(result.message || 'Payment verified successfully!')
        } else {
          setStatus('failed')
          setMessage(result.message || 'Payment could not be verified.')
        }
      } catch {
        setStatus('failed')
        setMessage('Unable to verify transaction. Please contact support.')
      }
    }

    if (transactionRef || isDemo) verify()
    else {
      setStatus('failed')
      setMessage('No transaction reference found.')
    }
  }, [transactionRef, isDemo])

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-lg">CareNow<span className="text-accent">PayLater</span></span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-slide-up">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
              <p className="text-gray-500">Please wait while we confirm your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful! 🎉</h1>
              <p className="text-gray-500 mb-6">{message}</p>

              {transactionRef && (
                <div className="bg-gray-50 rounded-xl p-3 mb-6">
                  <p className="text-xs text-gray-400 mb-1">Transaction Reference</p>
                  <p className="text-sm font-mono text-gray-700 break-all">{transactionRef}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Treatment can begin</p>
                      <p className="text-green-700 text-sm mt-0.5">
                        Your hospital has been notified. You may now proceed with your treatment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-900">A receipt has been sent</p>
                      <p className="text-brand-700 text-sm mt-0.5">
                        Check your email for payment confirmation and next installment reminders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {id && (
                <Link
                  to={`/pay/${id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 font-medium"
                >
                  Make Next Installment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-500 mb-6">{message}</p>

              {id && (
                <Link
                  to={`/pay/${id}`}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Try Again
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to CareNow Home
            </Link>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          Secured by Interswitch · 256-bit SSL Encrypted
        </p>
      </div>
    </div>
  )
}
