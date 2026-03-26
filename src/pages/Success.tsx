import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { paymentService } from '../services/payment.service'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Heart,
  ArrowRight,
  Home,
  Receipt,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function Success() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const transactionRef = searchParams.get('ref') || ''
  const isDemo = searchParams.get('demo') === 'true'

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    const verify = async () => {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 1800))
        setStatus('success')
        setMessage('Payment verified successfully (Demo Mode)')
        return
      }

      try {
        const result = await paymentService.verifyTransaction(transactionRef)
        if (result.status === 'SUCCESS') {
          setStatus('success')
          setMessage(result.message || 'Payment verified successfully!')
          setAmount(result.transaction?.amount || null)
        } else {
          setStatus('failed')
          setMessage(result.message || 'Payment could not be verified.')
        }
      } catch {
        setStatus('failed')
        setMessage('Unable to verify transaction. Please contact your hospital.')
      }
    }

    if (transactionRef || isDemo) verify()
    else {
      setStatus('failed')
      setMessage('No transaction reference found.')
    }
  }, [transactionRef, isDemo])

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      {/* Brand header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="size-8 rounded-full bg-primary flex items-center justify-center">
          <Heart className="size-4 text-primary-foreground fill-primary-foreground" />
        </div>
        <span className="font-black text-base tracking-tight text-foreground">
          CareNow<span className="text-primary">PayLater</span>
        </span>
      </div>

      <Card className="w-full max-w-md border-border/50 rounded-3xl shadow-xl overflow-hidden">
        {/* Colored top strip */}
        <div className={`h-2 w-full ${status === 'success' ? 'bg-green-500' : status === 'failed' ? 'bg-destructive' : 'bg-primary'}`} />

        <CardContent className="p-8 text-center space-y-6">
          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="size-10 text-primary animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground">Verifying Payment</h1>
                <p className="text-muted-foreground font-medium mt-1">Please wait while we confirm with Interswitch...</p>
              </div>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-10 text-green-500" />
              </div>
              <div>
                <Badge className="bg-green-500/10 text-green-600 border-0 font-black mb-3">Payment Confirmed</Badge>
                <h1 className="text-3xl font-black text-foreground">All Done!</h1>
                {amount && <p className="text-primary font-black text-2xl mt-1">₦{amount.toLocaleString()}</p>}
                <p className="text-muted-foreground font-medium mt-2 text-sm">{message}</p>
              </div>

              {transactionRef && (
                <div className="bg-muted/30 rounded-xl p-3 border border-border/40">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Transaction Reference</p>
                  <p className="text-xs font-mono text-foreground break-all">{transactionRef}</p>
                </div>
              )}

              <div className="space-y-3 text-left">
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex gap-3">
                  <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-green-700 dark:text-green-400">Hospital Notified</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Your provider has been automatically credited. You may proceed with treatment.
                    </p>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                  <Phone className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-foreground">Receipt Sent</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      Check your email or SMS for payment confirmation and next installment reminders.
                    </p>
                  </div>
                </div>
              </div>

              {id && (
                <Button asChild variant="outline" className="w-full rounded-xl h-11 font-bold">
                  <Link to={`/pay/${id}`}>
                    <Receipt className="size-4 mr-2" /> Make Next Installment <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              )}
            </>
          )}

          {/* Failed */}
          {status === 'failed' && (
            <>
              <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="size-10 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground">Payment Failed</h1>
                <p className="text-muted-foreground font-medium mt-2 text-sm">{message}</p>
              </div>
              {id && (
                <Button asChild className="w-full rounded-xl h-11 font-bold">
                  <Link to={`/pay/${id}`}>
                    Try Again <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
              )}
            </>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-border/40 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
              <Home className="size-3.5" /> Home
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="size-3.5 text-green-500" /> Secured by Interswitch
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
