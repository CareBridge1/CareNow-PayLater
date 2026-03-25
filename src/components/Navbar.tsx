import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Heart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center shadow-brand">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-brand-700">CareNow</span>
              <span className="text-accent font-black">PayLater</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#how-it-works" className="text-gray-600 hover:text-brand-700 text-sm font-medium transition-colors">
              How It Works
            </Link>
            <Link to="/#for-hospitals" className="text-gray-600 hover:text-brand-700 text-sm font-medium transition-colors">
              For Hospitals
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user?.hospitalName}</span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1.5 btn-ghost text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/login?tab=register" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2 animate-fade-in">
            <Link to="/" className="block px-4 py-2 text-gray-600 hover:text-brand-700 text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-brand-700 font-medium text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-500 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-600 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/login?tab=register" className="block px-4 py-2 text-brand-700 font-semibold text-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
