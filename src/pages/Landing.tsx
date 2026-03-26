import { Link } from 'react-router-dom'
import { CheckCircle2, Globe, Mail, Heart, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* Hero Section - Split layout with photo */}
      <section className="relative min-h-screen flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 gap-12 items-center">
        {/* Hero Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
            <Badge variant="secondary" className="font-bold tracking-widest text-[10px] uppercase px-4 py-1.5">
              <ShieldCheck className="size-3 mr-2 text-primary" /> HIPAA Compliant · SOC2 Certified
            </Badge>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-balance leading-none">
            Your bill,<br />
            <span className="text-primary">your pace.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-xl text-balance font-medium leading-relaxed">
            Simple, interest-free hospital payment plans — designed so you can focus on getting better, not paying all at once.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button asChild size="lg" className="rounded-full h-14 px-10 text-base font-bold shadow-xl shadow-primary/20">
              <Link to="/login">Partner With Us <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-10 text-base font-bold">
              <Link to="/track">Track My Bill</Link>
            </Button>
          </div>

          {/* Trust Logos */}
          <div className="flex flex-wrap items-center gap-6 mt-12 opacity-50 justify-center lg:justify-start">
            {['Mayo Clinic', 'Kaiser', 'Interswitch', 'Flutterwave'].map(name => (
              <span key={name} className="text-xs font-black uppercase tracking-widest text-muted-foreground">{name}</span>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative max-w-xl w-full">
          <div className="rounded-[40px] overflow-hidden aspect-[4/5] bg-muted">
            <img
              src="/img-hero-doctor.png"
              alt="Healthcare professional with tablet"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating stat card */}
          <div className="absolute -bottom-6 -left-6 bg-card border border-border/50 rounded-2xl p-4 shadow-xl">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Avg. Approval Time</p>
            <p className="text-3xl font-black text-foreground mt-1">2 min</p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(i => <div key={i} className="size-1.5 rounded-full bg-green-500" />)}
            </div>
          </div>
          {/* Floating stat card 2 */}
          <div className="absolute -top-6 -right-6 bg-card border border-border/50 rounded-2xl p-4 shadow-xl">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Bills Managed</p>
            <p className="text-3xl font-black text-foreground mt-1">₦2B+</p>
            <p className="text-xs text-green-500 font-bold mt-1">↑ 98% patient satisfaction</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="font-bold tracking-widest text-[10px] uppercase px-4 py-1.5 mb-4">How It Works</Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Three simple steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Create Bill',
              desc: 'Your hospital uploads your invoice directly into the platform — no paperwork, no delays.',
            },
            {
              step: '02',
              title: 'Select Plan',
              desc: 'Choose a repayment schedule that fits your budget. 2, 4, or 6 interest-free monthly installments.',
            },
            {
              step: '03',
              title: 'Pay Installments',
              desc: 'Your provider is paid instantly. You repay in small, manageable monthly chunks. Simple.',
            },
          ].map((item) => (
            <Card key={item.step} className="border-border/40 bg-card rounded-[32px] group hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="p-8">
                <p className="text-6xl font-black text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">{item.step}</p>
                <h3 className="text-2xl font-black mb-3 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Payment Showcase Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="font-bold tracking-widest text-[10px] uppercase px-4 py-1.5 mb-6">Real Patient Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-balance">
              Medical bills that don't break the bank
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
              Thousands of Nigerians have used CareNow to split their hospital bills into easy payments — without interest, without stress.
            </p>

            {/* Fake Payment Progress */}
            <div className="space-y-4">
              {[
                { name: 'Lagos University Teaching Hospital', amount: '₦480,000', paid: 75 },
                { name: 'National Hospital Abuja', amount: '₦120,000', paid: 50 },
                { name: 'Eko Hospital', amount: '₦65,000', paid: 100 },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.amount} total</p>
                    </div>
                    {item.paid === 100
                      ? <Badge className="bg-green-500 border-0 text-xs"><CheckCircle2 className="size-3 mr-1" /> Paid</Badge>
                      : <Badge variant="secondary" className="text-xs">{item.paid}% paid</Badge>
                    }
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${item.paid === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${item.paid}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[40px] overflow-hidden aspect-square bg-muted">
              <img
                src="/img-hospital-patient.png"
                alt="Patient tracking their payments"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating payment card */}
            <div className="absolute -bottom-6 -right-6 bg-card border border-border/50 rounded-2xl p-4 shadow-2xl max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="size-3.5 text-green-500" />
                </div>
                <span className="text-xs font-black text-green-600 uppercase tracking-widest">Paid!</span>
              </div>
              <p className="text-2xl font-black">₦40k</p>
              <p className="text-xs text-muted-foreground font-medium">Monthly installment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Phone Feature */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 relative">
            <div className="rounded-[40px] overflow-hidden aspect-square bg-muted mx-auto max-w-sm">
              <img
                src="/img-payment-phone.png"
                alt="Successful payment on phone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div>
              <Badge variant="secondary" className="font-bold tracking-widest text-[10px] uppercase px-4 py-1.5 mb-4">0% APR Forever</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Interest-free, always.</h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                No credit traps, no compounding interest. You pay exactly what your hospital charged — split over time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Patient Happiness', value: '98%' },
                { label: 'Bills Managed', value: '₦2B+' },
                { label: 'Partner Hospitals', value: '1,200+' },
                { label: 'Avg. Approval', value: '2 min' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-6">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="bg-primary border-0 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 size-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to focus on your health?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="rounded-full h-14 px-10 bg-white text-primary hover:bg-white/90 font-black shadow-xl">
                  <Link to="/login">Get Approved in 2 Minutes</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-10 border-white/30 text-white hover:bg-white/10 font-bold">
                  <Link to="/track">Track My Bill</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-white">
              <div className="text-center">
                <div className="text-5xl font-black">98%</div>
                <p className="text-white/60 uppercase tracking-widest text-[10px] font-bold mt-2">Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black">₦2B+</div>
                <p className="text-white/60 uppercase tracking-widest text-[10px] font-bold mt-2">Managed</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/40 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="size-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-bold text-base tracking-tight">CareNow<span className="text-primary">PayLater</span></span>
            </Link>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-xs">
              Redefining how we pay for healthcare. Empathy-first financing for a healthier tomorrow.
            </p>
          </div>
          {[
            { label: 'Product', links: ['How it works', 'Pricing & Fees', 'Partnerships'] },
            { label: 'Company', links: ['About Us', 'Careers', 'Contact'] },
            { label: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Licenses'] },
          ].map((col) => (
            <div key={col.label}>
              <h4 className="font-black uppercase tracking-widest text-[10px] text-primary mb-6">{col.label}</h4>
              <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                {col.links.map(l => <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-muted-foreground/60">© 2024 CareNow PayLater. Member FDIC. Equal Housing Lender.</p>
          <div className="flex items-center gap-4">
            {[Globe, Mail].map((Icon, i) => (
              <div key={i} className="size-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                <Icon className="size-4" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
