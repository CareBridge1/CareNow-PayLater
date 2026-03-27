import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { paymentService, type PaymentLink } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink'
import Button from '../components/Button'
import {
  Plus, Copy, Share2, 
  TrendingUp, Receipt
} from 'lucide-react'
import toast from 'react-hot-toast'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { SectionCards } from '../components/section-cards'

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: 'secondary',
    PARTIAL: 'secondary',
    PAID: 'default',
    FAILED: 'destructive',
  }
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    PARTIAL: 'Partial',
    PAID: 'Paid',
    FAILED: 'Failed',
  }
  
  if (status === 'PAID') {
    return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">{labels[status] || status}</Badge>
  }
  return <Badge variant={map[status] || 'outline'}>{labels[status] || status}</Badge>
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    try {
      const resp = await paymentService.getLinks()
      if (resp && resp.paymentLinks) {
        setLinks(resp.paymentLinks)
      }
    } catch {
      // Backend may not be running — simulated mode
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
  const totalAmountFormatted = formatCurrency(totalAmount)

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Stats Cards Row using dashboard-01 components */}
      <SectionCards stats={{
        links: links.length,
        volume: totalAmountFormatted,
        paid: totalPaid,
        pending: totalPending
      }} />

      {/* Chart Section */}
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ChartAreaInteractive />
        </div>
        <Card className="lg:col-span-3 border-border/50 bg-card overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live payment stream from your facility</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="px-6 pb-6 space-y-6">
                {links.slice(0, 5).map((link) => (
                  <div key={link.id} className="flex items-center gap-4">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs" id={`patient-icon-${link.id}`}>
                      {link.patientName?.[0] || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">{link.patientName || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground truncate">{new Date(link.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {formatCurrency(link.amount)}
                    </div>
                  </div>
                ))}
                {links.length === 0 && <p className="text-sm text-muted-foreground text-center py-10 italic">No recent transactions</p>}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
               <Receipt className="size-5 text-primary" />
               Payment Link Ledger
            </CardTitle>
            <CardDescription>Management of all active and historical links</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
                variant="secondary"
                onClick={fetchLinks}
                size="sm"
                icon={<TrendingUp className="w-4 h-4" />}
                className="hidden sm:flex"
              >
                Sync
              </Button>
              <Button onClick={() => navigate('/create-link')} icon={<Plus className="w-4 h-4" />} size="sm">
                New Link
              </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Patient / Contact</TableHead>
                <TableHead>Principal Amount</TableHead>
                <TableHead>Reconciliation Status</TableHead>
                <TableHead className="hidden md:table-cell">Initiated On</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="font-bold text-foreground">
                      {link.patientName || link.patientContact || 'Anonymous Patient'}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 opacity-70">
                      ID: {link.id.slice(-8).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground">{formatCurrency(link.amount)}</div>
                    {link.amountPaid !== undefined && link.amountPaid > 0 && (
                      <div className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">
                        {formatCurrency(link.amountPaid)} Collected
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={link.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(link.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopy(link.linkUrl)}
                        className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-primary"
                        title="Copy link"
                      >
                        <Copy className="size-4" />
                      </button>
                      <a
                        href={generateWhatsAppLink(link.linkUrl, user?.hospitalName || 'Hospital', link.amount)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-[#25D366]/10 rounded-md transition-colors text-[#25D366]"
                        title="Share via WhatsApp"
                      >
                        <Share2 className="size-4" />
                      </a>
                      <button
                        onClick={() => navigate(`/payment-links/${link.id}`)}
                        className="text-[10px] font-bold uppercase py-1.5 px-3 bg-secondary text-secondary-foreground rounded shadow-sm hover:translate-y-[-1px] transition-all ml-1"
                      >
                        Details
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {links.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                    No payment links found. Generate your first one to start collecting.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

     
    </div>
  )
}
