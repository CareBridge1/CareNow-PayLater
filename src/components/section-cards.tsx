"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Link2, 
  Banknote, 
  CheckCircle2, 
  Clock 
} from "lucide-react"

interface SectionCardsProps {
  stats: {
    links: string | number;
    volume: string | number;
    paid: string | number;
    pending: string | number;
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  const items = [
    { label: 'Payment Links', value: stats.links, icon: Link2, desc: 'Total links generated', trend: '+12.5%', isUp: true },
    { label: 'Total Volume', value: stats.volume, icon: Banknote, desc: 'Gross transaction value', trend: '+8.2%', isUp: true },
    { label: 'Fully Settled', value: stats.paid, icon: CheckCircle2, desc: 'Paid in full', trend: '+15.3%', isUp: true },
    { label: 'Pending Payout', value: stats.pending, icon: Clock, desc: 'Awaiting patient action', trend: '-2.4%', isUp: false },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {items.map((item) => (
        <Card key={item.label} className="@container/card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground/70">
              {item.label}
            </CardDescription>
            <item.icon className="size-4 text-primary opacity-70" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-black tabular-nums @[250px]/card:text-3xl">
              {item.value}
            </CardTitle>
            <div className="mt-2 flex items-center gap-1.5">
              <Badge variant="outline" className="rounded-full text-[10px] font-bold py-0 h-4">
                {item.isUp ? <TrendingUp className="size-2.5 mr-1" /> : <TrendingDown className="size-2.5 mr-1" />}
                {item.trend}
              </Badge>
              <span className="text-[10px] text-muted-foreground opacity-60">vs last month</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 pb-4">
             <p className="text-[10px] text-muted-foreground opacity-60 underline decoration-primary/20 underline-offset-4">
                {item.desc}
             </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
