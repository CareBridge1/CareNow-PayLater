import { Link } from 'react-router-dom'
import {
  Heart, ArrowRight, CheckCircle2, Play, Shield, Star, Users,
  Zap, FileText, CreditCard, Stethoscope, TrendingUp, Building2, Phone
} from 'lucide-react'

const stats = [
  { value: '98%', label: 'Patient Happiness' },
  { value: '₦2B+', label: 'Bills Managed' },
  { value: '500+', label: 'Hospitals' },
  { value: '< 2min', label: 'Link Created' },
]

const howItWorks = [
  {
    step: '01',
    icon: FileText,
    title: 'Create a Bill',
    desc: 'Hospital enters the treatment amount and patient name. Zero forms, zero hassle.',
    color: 'from-blue-500 to-brand-600',
  },
  {
    step: '02',
    icon: Phone,
    title: 'Share the Link',
    desc: 'One click sends a payment link to your patient via WhatsApp or SMS instantly.',
    color: 'from-brand-600 to-brand-800',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Patient Pays',
    desc: 'Patient picks an installment plan and makes the first payment immediately.',
    color: 'from-accent to-accent-dark',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Generate a payment link in under 60 seconds. No training required.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'All payments secured by Interswitch — Nigeria\'s #1 payment infrastructure.',
  },
  {
    icon: Users,
    title: 'No Patient Account Needed',
    desc: 'Patients pay directly through the link. No app download, no signup required.',
  },
  {
    icon: TrendingUp,
    title: 'Track in Real-time',
    desc: 'See payment status for every link — pending, partial, or fully paid.',
  },
  {
    icon: Building2,
    title: 'Works for Any Hospital',
    desc: 'Private clinics, specialist centers, and large hospitals — all in one platform.',
  },
  {
    icon: Heart,
    title: 'Interest-Free Plans',
    desc: 'Patients choose 1, 2, 3 or 6 installments. 0% APR. No hidden fees.',
  },
]

const partners = ['Mayo Clinic', 'Kaiser', 'HIPAA', 'SOC2']

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen bg-gradient-hero flex items-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <Stethoscope className="w-4 h-4 text-accent" />
                <span>Compassionate Financing</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                Get treated
                <br />
                <span className="text-accent">now,</span>
                <br />
                pay later.
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                Modern healthcare financing built on trust. Manage medical expenses with flexible,
                interest-free installment plans. No hidden fees. Just care.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/login?tab=register" className="btn-accent flex items-center gap-2 text-base py-4 px-8 shadow-xl">
                  Start Your Application
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/#how-it-works" className="flex items-center gap-2 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/10 transition-all border border-white/30">
                  <Play className="w-5 h-5" />
                  Watch Story
                </Link>
              </div>

              {/* Trusted by */}
              <div className="pt-4">
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-3">
                  Trusted by 1,200+ institutions
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  {partners.map((p) => (
                    <span key={p} className="text-white/60 text-sm font-medium hover:text-white/90 transition-colors flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right content - Dashboard mockup */}
            <div className="hidden lg:flex justify-center animate-fade-in">
              <div className="relative">
                {/* Main card */}
                <div className="glass-card w-80 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Current Balance</p>
                      <p className="text-white text-2xl font-bold">₦1,240.50</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Monthly Payment', value: '₦8,500', color: 'bg-accent' },
                      { label: 'Next Due', value: 'Apr 1, 2026', color: 'bg-brand-400' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-white/70 text-xs">{item.label}</span>
                        </div>
                        <span className="text-white text-sm font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 bg-accent/20 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-accent text-sm font-medium">Instant Approval</span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Patient Rating</p>
                    <p className="text-sm font-bold text-gray-900">4.9 / 5.0</p>
                  </div>
                </div>

                {/* Bottom badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl">
                  <p className="text-xs text-gray-500 mb-0.5">Payment split</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-2 w-8 rounded-full ${i <= 2 ? 'bg-accent' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">2 of 4 paid ✓</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-accent mb-1">{stat.value}</p>
                <p className="text-blue-300 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Simple Process</p>
            <h2 className="section-heading">Simple health financing</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
              Managing medical expenses shouldn't be another headache. Our process is designed for clarity and ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="card-hover text-center group">
                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-5xl font-black text-gray-100 mb-3">{step.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="for-hospitals" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Interest-free banner */}
            <div className="bg-brand-900 rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-700/50 rounded-full blur-2xl" />
              <p className="text-accent font-semibold mb-3">Zero APR</p>
              <h2 className="text-4xl font-black mb-4">
                Interest-Free
                <br />Sustainability
              </h2>
              <p className="text-blue-200 leading-relaxed mb-6">
                Healthcare should be accessible. No credit traps, no compounding interest.
                Just straightforward support when you need it most.
              </p>
              <div className="flex items-end gap-2">
                <span className="text-7xl font-black text-accent">0%</span>
                <span className="text-blue-300 pb-3 font-medium">APR FOREVER</span>
              </div>
            </div>

            {/* Provider Network */}
            <div className="bg-white rounded-3xl p-10 shadow-card">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Provider Network</h3>
              <p className="text-gray-500 mb-8">
                Seamlessly integrated with major healthcare systems and local clinics across the country.
              </p>
              <div className="flex items-center gap-3 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full bg-gradient-to-br ${i % 2 === 0 ? 'from-brand-600 to-brand-800' : 'from-accent to-accent-dark'} flex items-center justify-center text-white font-bold text-sm shadow-lg ${i > 0 ? '-ml-3' : ''}`}>
                    {['H', 'C', 'M', '+16'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">500+ connected partners</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="card-hover group">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors duration-300">
                  <feat.icon className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feat.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-brand-700/40 rounded-full blur-3xl" />
          <div className="absolute -right-20 top-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                Ready to focus on your health
                <br />
                <span className="text-accent">instead of the bill?</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="text-center">
                <p className="text-4xl font-black text-accent">98%</p>
                <p className="text-xs text-blue-300 uppercase tracking-wider">Patient Happiness</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-white">₦2B+</p>
                <p className="text-xs text-blue-300 uppercase tracking-wider">Bills Managed</p>
              </div>
              <Link to="/login?tab=register" className="btn-accent py-4 px-8 text-base ml-4">
                Get Approved in 2 Minutes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="font-bold"><span className="text-white">CareNow</span><span className="text-accent">PayLater</span></span>
              </div>
              <p className="text-blue-300 text-sm leading-relaxed">
                Transforming how you pay for healthcare. Dignity-first financing for a healthier tomorrow.
              </p>
            </div>
            {[
              { title: 'Product', links: ['How it Works', 'Pricing', 'Partnerships'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Licenses'] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">{col.title}</h5>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-blue-300 text-sm hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-blue-400 text-sm">© 2026 CareNow PayLater. Built during Hackathon 2026.</p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-blue-400 text-xs">SOC2 Certified & HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
