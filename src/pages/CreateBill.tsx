import { useState } from 'react'
import { Bell, Search, ShieldCheck, HelpCircle } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function CreateBill() {
  const [hospitalName, setHospitalName] = useState('')
  const [billAmount, setBillAmount] = useState('')

  const isValid = hospitalName.trim().length > 2 && Number(billAmount) > 0

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      
      {/* Top Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-border/50 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#FFDED6] rounded-xl flex items-center justify-center">
            {/* Generic avatar icon or face */}
            <span className="text-xl">👩🏻‍🦰</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Create New Bill</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Step 1 of 3: Bill Details</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-600">
          <Bell className="w-5 h-5" />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1200px] mx-auto w-full">
        
        {/* Left Column (Form) */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          <Card className="p-8 md:p-12 shadow-sm border-slate-200">
            <h2 className="text-2xl font-bold text-[#1E3A8A] mb-3">Hospital Information</h2>
            <p className="text-slate-600 mb-8 max-w-lg">
              Enter the details exactly as they appear on your medical invoice to ensure quick approval.
            </p>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hospital Name</Label>
                <div className="relative">
                  <Input
                    placeholder="Search for hospital or clinic"
                    className="h-12 pl-4 pr-10 bg-slate-50 border-slate-200 text-base"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                  <Search className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-400">Start typing to see partnered hospitals for instant approval.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bill Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-bold text-slate-600">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="h-12 pl-8 border-slate-200 bg-slate-50 text-base font-medium"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-col items-center">
                <Button 
                  disabled={!isValid}
                  className="w-full h-12 text-base font-semibold transition-all"
                  variant={isValid ? 'default' : 'secondary'}
                >
                  Continue &rarr;
                </Button>
                <p className="text-xs text-slate-400 mt-4 text-center">Complete all fields to proceed to payment planning</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Info Cards) */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          {/* Why CareNow Card */}
          <Card className="bg-[#2B3E8E] text-white p-6 shadow-md border-0">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <h3 className="text-xl font-bold mb-6">Why CareNow?</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-[#4ADE80] shrink-0" />
                <span><span className="font-semibold text-white">0% interest plans</span> available for selected partner hospitals.</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-[#4ADE80] shrink-0" />
                <span>Approvals usually take less than <span className="font-semibold text-white">15 minutes</span>.</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-[#4ADE80] shrink-0" />
                <span>Securely encrypted medical and financial data handling.</span>
              </li>
            </ul>
          </Card>

          {/* Frequently Asked Card */}
          <Card className="bg-[#FAFAFA] border border-slate-200 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-[#1E3A8A] mb-6">
              <HelpCircle className="w-5 h-5 text-[#1E3A8A]" />
              Frequently Asked
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">What if my hospital isn't listed?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You can still upload your bill. Our team will verify it manually within 24 hours.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Can I pay for someone else?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Yes, as long as you provide the patient's full name and matching hospital bill.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto px-8 py-6 border-t border-slate-200/50 bg-white text-xs flex flex-col md:flex-row justify-between items-center text-slate-500 max-w-[1200px] w-full mx-auto">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="font-bold text-[#1E3A8A]">CareNow PayLater</span>
          <span>© {new Date().getFullYear()} CareNow PayLater. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Contact Us</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Careers</a>
        </div>
      </footer>
    </div>
  )
}
