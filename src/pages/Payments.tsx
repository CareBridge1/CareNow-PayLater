import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentService, type PaymentLink } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

import {
  Plus,
  Copy,
  Share2,
  Search,
  Filter,
  Loader2,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STATUS_FILTERS = ['All', 'PENDING', 'PARTIAL', 'PAID']

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'PAID') return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0"><CheckCircle2 className="size-3 mr-1" />Paid</Badge>
  if (status === 'PARTIAL') return <Badge variant="secondary"><Clock className="size-3 mr-1" />Partial</Badge>
  return <Badge variant="outline">Pending</Badge>
}

export default function Payments() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const fetchLinks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const resp = await paymentService.getLinks()
      if (resp?.paymentLinks) setLinks(resp.paymentLinks)
    } catch {
      // backend may not be running
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const filtered = useMemo(() => {
    let result = links
    if (statusFilter !== 'All') result = result.filter(l => l.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(l =>
        l.patientName?.toLowerCase().includes(q) ||
        l.patientContact?.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      )
    }
    return result
  }, [links, search, statusFilter])

  // Summary stats
  const totalVolume = links.reduce((s, l) => s + l.amount, 0)
  const collected = links.reduce((s, l) => s + (l.amountPaid || 0), 0)
  const pendingCount = links.filter(l => l.status !== 'PAID').length

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground font-medium">All payment links issued by your facility</p>
        </div>
        <Button onClick={() => navigate('/create-link')} className="rounded-xl font-bold h-10 gap-2 shrink-0 shadow-md shadow-primary/10">
          <Plus className="size-4" /> New Link
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Links', value: links.length, icon: Receipt },
          { label: 'Total Volume', value: formatCurrency(totalVolume), icon: Receipt },
          { label: 'Collected', value: formatCurrency(collected), icon: CheckCircle2, green: true },
          { label: 'Pending', value: pendingCount, icon: Clock },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
              <p className={`text-2xl font-black mt-1 ${stat.green ? 'text-green-500' : 'text-foreground'}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Receipt className="size-4 text-primary" /> Payment Ledger
              </CardTitle>
              <CardDescription className="text-xs">{filtered.length} of {links.length} links shown</CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <Input
                  placeholder="Search patient, contact, ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 rounded-xl bg-muted/20 border-border/40 text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 border border-border/30">
                <Filter className="size-3.5 text-muted-foreground/40 ml-1" />
                {STATUS_FILTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      statusFilter === s ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Button variant="ghost" size="icon" className="size-9 rounded-xl" onClick={() => fetchLinks(true)} title="Refresh">
                <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-primary/40" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="size-16 bg-muted rounded-2xl flex items-center justify-center">
                <Receipt className="size-8 text-muted-foreground/30" />
              </div>
              <div>
                <p className="font-black text-foreground">No payment links found</p>
                <p className="text-sm text-muted-foreground font-medium">
                  {search || statusFilter !== 'All' ? 'Try adjusting your filters' : 'Create your first link to get started'}
                </p>
              </div>
              {!search && statusFilter === 'All' && (
                <Button onClick={() => navigate('/create-link')} className="rounded-xl font-bold h-9">
                  <Plus className="size-4 mr-2" /> Create Link
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 border-border/30">
                    <TableHead className="font-black text-xs uppercase tracking-widest">Patient</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">Amount</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest hidden md:table-cell">Date</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((link) => (
                    <TableRow key={link.id} className="hover:bg-muted/10 transition-colors border-border/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                            {link.patientName?.[0]?.toUpperCase() || link.patientContact?.[0]?.toUpperCase() || 'P'}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{link.patientName || link.patientContact || 'Anonymous'}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">#{link.id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-foreground">{formatCurrency(link.amount)}</p>
                        {link.amountPaid !== undefined && link.amountPaid > 0 && (
                          <p className="text-[10px] text-green-600 font-bold">{formatCurrency(link.amountPaid)} paid</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={link.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-medium">
                        {new Date(link.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleCopy(link.linkUrl)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                            title="Copy link"
                          >
                            <Copy className="size-3.5" />
                          </button>
                          <a
                            href={generateWhatsAppLink(link.linkUrl, user?.hospitalName || 'Hospital', link.amount)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-[#25D366]/10 rounded-lg transition-colors text-[#25D366]"
                            title="Share via WhatsApp"
                          >
                            <Share2 className="size-3.5" />
                          </a>
                          <button
                            onClick={() => navigate(`/payment-links/${link.id}`)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-primary"
                            title="View details"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dev mode notice */}
   
    </div>
  )
}
