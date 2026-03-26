import { Link, useLocation } from 'react-router-dom'
import { Menu, ArrowRight, Heart } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { ThemeToggle } from './ThemeToggle'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  
  const isLanding = location.pathname === '/'

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex items-center justify-between px-6 py-2.5 bg-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-xl border border-border/50 rounded-full transition-all duration-300">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            CareNow<span className="text-primary">PayLater</span>
          </span>
        </Link>

        {/* Desktop Links */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground/80">
            <a href="#features" className="hover:text-primary transition-colors">How it works</a>
            <Link to="/track" className="hover:text-primary transition-colors">Track Bill</Link>
            <a href="#hospitals" className="hover:text-primary transition-colors">Pricing & Fees</a>
            <a href="#hospitals" className="hover:text-primary transition-colors">Partnerships</a>
          </div>
        )}

        {/* Auth / Action */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          <div className="hidden h-5 w-[1px] bg-border/60 sm:block" />

          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-sm font-bold text-muted-foreground hover:text-foreground hidden sm:inline-flex">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full shadow-md font-bold px-5">
                <Link to="/dashboard">
                  Portal
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full font-bold hidden sm:inline-flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full shadow-lg shadow-primary/20 font-bold px-6 group">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Menu className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
