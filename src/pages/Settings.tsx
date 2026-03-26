import { useState } from 'react'
import { 
  Building2 as Hospital, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  CheckCircle2, 
  Loader2,
  Bell,
  Fingerprint,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function Settings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Settings updated successfully!')
    }, 800)
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Hospital Settings</h1>
        <p className="text-muted-foreground font-medium">Configure your hospital profile, trust signals, and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSave}>
            <Card className="border-border/50 bg-card shadow-sm overflow-hidden rounded-2xl">
              <CardHeader className="bg-muted/30 border-b border-border/50 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Hospital className="size-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black tracking-tight">Enterprise Profile</CardTitle>
                      <CardDescription className="font-medium text-muted-foreground">Information displayed to patients during checkout</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600 border-0 px-3 py-1">
                    <CheckCircle2 className="size-3 mr-1.5" /> Verified Facility
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Hospital Legal Name</Label>
                  <div className="relative group">
                    <Building className="size-5 text-muted-foreground/50 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input 
                      defaultValue={user?.hospitalName} 
                      className="h-14 pl-12 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all font-bold text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Support Email</Label>
                    <div className="relative group">
                      <Mail className="size-5 text-muted-foreground/50 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                      <Input 
                        defaultValue={user?.email} 
                        className="h-14 pl-12 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Contact Phone</Label>
                    <div className="relative group">
                      <Phone className="size-5 text-muted-foreground/50 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="+234 800 000 0000" 
                        className="h-14 pl-12 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Physical Facility Address</Label>
                  <div className="relative group">
                    <MapPin className="size-5 text-muted-foreground/50 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="123 Health Avenue, Medical District" 
                      className="h-14 pl-12 rounded-xl border-border/50 bg-muted/20 focus:bg-background transition-all font-bold"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30 border-t border-border/50 p-6 flex justify-end">
                <Button type="submit" disabled={loading} className="px-10 h-12 rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20">
                  {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Security & Notifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-8 flex items-start gap-6">
                <div className="size-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Lock className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg tracking-tight mb-1">Security & Access</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-4 leading-relaxed">Update password and manage admin authentication methods.</p>
                  <Button variant="outline" size="sm" className="rounded-full font-bold px-4">
                    Manager Access <ChevronRight className="size-3 ml-1.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-8 flex items-start gap-6">
                <div className="size-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Bell className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg tracking-tight mb-1">Notifications</h3>
                  <p className="text-sm text-muted-foreground font-medium mb-4 leading-relaxed">Configure real-time alerts for payment reconciliation.</p>
                  <Button variant="outline" size="sm" className="rounded-full font-bold px-4">
                    Settings <ChevronRight className="size-3 ml-1.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Sidebar Panels */}
        <div className="lg:col-span-4 space-y-8">
          {/* Compliance Card */}
          <Card className="bg-primary border-0 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute -top-12 -right-12 size-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-8 text-green-400" />
                <h3 className="text-2xl font-black tracking-tight">Trust & Compliance</h3>
              </div>
              <p className="text-primary-foreground font-medium leading-relaxed">
                CareNow secures your patient payment portals with bank-grade encryption and verified trust signals.
              </p>
              <Separator className="bg-white/20" />
              <ul className="space-y-4">
                {[
                  { label: 'Interswitch Secured', icon: CheckCircle2 },
                  { label: 'HIPAA Compliant', icon: CheckCircle2 },
                  { label: 'Verified Provider', icon: CheckCircle2 }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold">
                    <item.icon className="size-4 text-green-400" /> {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="border-border/50 bg-muted/20 rounded-3xl p-8 space-y-4">
            <h4 className="text-lg font-black tracking-tight">Need Assistance?</h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Our enterprise support team is available 24/7 to help with technical integrations or account scaling.
            </p>
            <Button variant="link" className="p-0 h-auto font-black text-primary text-sm uppercase tracking-widest hover:no-underline group">
              Talk to Specialist <ExternalLink className="size-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Developer/API Area */}
          <Card className="border-dashed border-2 border-border/60 bg-transparent rounded-3xl p-8 group cursor-pointer hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors">
               <Fingerprint className="size-8 opacity-50" />
               <div className="flex-1">
                  <h4 className="font-black text-sm uppercase tracking-widest">API Keys & Webhooks</h4>
                  <p className="text-xs font-medium opacity-70">Manage technical integrations</p>
               </div>
               <ChevronRight className="size-4" />
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
