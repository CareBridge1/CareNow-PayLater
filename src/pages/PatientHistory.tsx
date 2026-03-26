import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Search,
  Loader2,
  AlertCircle,
  ChevronRight,
  User,
  CheckCircle2,
  Clock,
  TrendingUp,
  Receipt,
  Phone,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

import { paymentService } from '../services/payment.service'
import { formatCurrency } from '../utils/formatCurrency'
import { Badge } from '../components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'PAID') return <Badge className="bg-green-500 hover:bg-green-600 border-0 text-xs"><CheckCircle2 className="size-3 mr-1" />Paid</Badge>
  if (status === 'PARTIAL') return <Badge variant="secondary" className="text-xs"><Clock className="size-3 mr-1" />Partial</Badge>
  return <Badge variant="outline" className="text-xs">Pending</Badge>
}

export default function PatientHistory() {
  const { contact: initialContact } = useParams<{ contact?: string }>()
  const navigate = useNavigate()

  const [query, setQuery] = useState(initialContact || '')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setHasSearched(true)
    try {
      const { paymentLinks } = await paymentService.getLinks()
      setHistory(paymentLinks.filter(l =>
        l.patientContact?.toLowerCase() === query.toLowerCase().trim()
      ))
    } catch {
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialContact) handleSearch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContact])

  const totalBilled = useMemo(() => history.reduce((s, l) => s + l.amount, 0), [history])
  const totalPaid = useMemo(() => history.reduce((s, l) => s + (l.amountPaid || 0), 0), [history])
  const outstanding = totalBilled - totalPaid
  const paidLinks = history.filter(l => l.status === 'PAID').length

  return (
    <div className="flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Patient History</h1>
        <p className="text-muted-foreground font-medium">Look up a patient to review all their payment records.</p>
      </div>

      {/* Search */}
      <Card className="border-border/50 bg-card rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
              <Input
                placeholder="Phone number or email address..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="h-11 pl-10 rounded-xl bg-muted/20 border-border/40 font-medium"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-11 px-6 rounded-xl font-bold shrink-0">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* States */}
      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/40 rounded-2xl text-center">
          <div className="size-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <User className="size-8 text-muted-foreground/30" />
          </div>
          <h3 className="font-black text-foreground text-lg">Look up a Patient</h3>
          <p className="text-sm text-muted-foreground font-medium max-w-xs mt-1">Enter a phone or email to view their complete payment history.</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground/40">
          <Loader2 className="size-10 animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest">Searching records...</p>
        </div>
      )}

      {hasSearched && !loading && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border/50 rounded-2xl text-center">
          <AlertCircle className="size-10 text-muted-foreground/30 mb-4" />
          <h3 className="font-black text-foreground">No Records Found</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1 mb-4">No payment links for <strong className="text-foreground">{query}</strong></p>
          <Button variant="outline" className="rounded-xl font-bold h-9" onClick={() => { setQuery(''); setHasSearched(false) }}>Clear Search</Button>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Patient Card */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Identity */}
            <Card className="flex-1 border-border/50 bg-card rounded-2xl shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shrink-0">
                  {history[0].patientName?.[0]?.toUpperCase() || query[0]?.toUpperCase() || 'P'}
                </div>
                <div>
                  <p className="font-black text-foreground text-lg leading-tight">{history[0].patientName || 'Patient'}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs font-bold"><Phone className="size-3 mr-1" />{query}</Badge>
                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">ID: {history[0].id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick stats */}
            {[
              { icon: Receipt, label: 'Total Links', value: history.length },
              { icon: TrendingUp, label: 'Total Billed', value: formatCurrency(totalBilled) },
              { icon: CheckCircle2, label: 'Collected', value: formatCurrency(totalPaid), green: true },
              { icon: Clock, label: 'Outstanding', value: formatCurrency(outstanding), amber: outstanding > 0 },
            ].map(stat => (
              <Card key={stat.label} className="border-border/50 bg-card rounded-2xl shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${stat.green ? 'bg-green-500/10 text-green-500' : stat.amber ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                    <stat.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                    <p className={`font-black text-base ${stat.green ? 'text-green-600' : stat.amber && outstanding > 0 ? 'text-amber-600' : 'text-foreground'}`}>{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* History Table */}
          <Card className="border-border/50 bg-card rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/30 pb-4">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <Receipt className="size-4 text-primary" /> Payment Records
              </CardTitle>
              <CardDescription className="text-xs">{history.length} links · {paidLinks} fully paid</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 border-border/30">
                    {['Date', 'Description', 'Amount', 'Collected', 'Status', ''].map(h => (
                      <TableHead key={h} className={`text-[10px] font-black uppercase tracking-widest py-3 ${h === '' ? 'text-right' : ''}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((link) => (
                    <TableRow key={link.id} className="group hover:bg-muted/10 transition-colors border-border/20">
                      <TableCell className="text-xs text-muted-foreground font-medium py-4">
                        {new Date(link.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="font-bold text-sm text-foreground">{link.description || 'Medical Plan'}</p>
                        <p className="text-[10px] text-muted-foreground/60 font-medium">#{link.id.slice(-8).toUpperCase()}</p>
                      </TableCell>
                      <TableCell className="font-black text-foreground py-4">{formatCurrency(link.amount)}</TableCell>
                      <TableCell className="font-bold text-green-600 py-4">
                        {link.amountPaid ? formatCurrency(link.amountPaid) : <span className="text-muted-foreground/40">—</span>}
                      </TableCell>
                      <TableCell className="py-4"><StatusBadge status={link.status} /></TableCell>
                      <TableCell className="text-right py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/payment-links/${link.id}`)}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
