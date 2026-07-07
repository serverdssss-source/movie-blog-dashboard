import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { User } from '../types'
import StaggeredTextRoll from './StaggeredTextRoll'

interface InnerAppLayoutProps {
  currentUser: User | null
  onLogout: () => void
  children: ReactNode
}

export function InnerAppLayout({ currentUser, onLogout, children }: InnerAppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')
  
  const getNavClass = (path: string) => {
    const active = isActive(path)
    return `text-[15px] transition-colors duration-200 sliding-underline-link ${
      active 
        ? 'text-zinc-950 font-bold underline decoration-red-600 decoration-2 underline-offset-[6px]' 
        : 'text-zinc-600 no-underline font-medium hover:text-zinc-900'
    }`
  }

  const getMobileNavClass = (path: string) => {
    const active = isActive(path)
    return `px-4 py-2 text-[14px] ${
      active 
        ? 'bg-red-50/50 text-red-600 font-bold border-l-2 border-red-600' 
        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-l-2 border-transparent'
    }`
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-inner min-h-screen w-full flex flex-col text-zinc-900">
      {/* Shared Inner Header (Light theme) */}
      <header className="flex justify-between items-center px-4 md:px-10 py-4 bg-white border-b border-zinc-200 w-full relative z-50">
        <img
          src="/Prabhava_logo.png"
          className="h-[40px] w-[120px] object-cover object-center cursor-pointer invert"
          alt="Prabhava Logo"
          onClick={() => navigate('/')}
        />
        
        <div className="flex items-center gap-4 md:gap-[25px]">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-[25px] items-center">
            <Link to="/feed" className={getNavClass('/feed')}>
              Explore
            </Link>
            {currentUser && (
              <Link to="/upload" className={getNavClass('/upload')}>
                Upload
              </Link>
            )}
            {currentUser && (
              <Link to="/dashboard" className={getNavClass('/dashboard')}>
                Dashboard
              </Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className={getNavClass('/admin')}>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-[13px] md:text-[14px] text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200"
              >
                <span>Hi, <strong className="text-zinc-900">{currentUser.username}</strong></span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-[12px] shadow-lg py-2 flex flex-col z-50">
                  <div className="md:hidden flex flex-col border-b border-zinc-100 pb-2 mb-2">
                    <Link to="/feed" onClick={() => setDropdownOpen(false)} className={getMobileNavClass('/feed')}>Explore</Link>
                    <Link to="/upload" onClick={() => setDropdownOpen(false)} className={getMobileNavClass('/upload')}>Upload</Link>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className={getMobileNavClass('/dashboard')}>Dashboard</Link>
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className={getMobileNavClass('/admin')}>Admin Panel</Link>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      onLogout()
                      navigate('/')
                    }}
                    className="font-sans text-[13px] font-semibold px-[18px] py-[8px] rounded-full cursor-pointer bg-red-600 hover:bg-red-700 text-white text-center transition-all shadow-sm hover:shadow mx-3 mb-2 mt-1"
                  >
                    <StaggeredTextRoll text="Logout" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="font-sans text-[12px] md:text-[13px] font-semibold px-[15px] py-[6px] rounded-[6px] cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white text-center transition-colors whitespace-nowrap"
            >
              <StaggeredTextRoll text="Login / Sign Up" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Inner Content Frame */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto my-[30px] md:my-[40px] px-4 md:px-5 relative z-10">
        {children}
      </main>

      {/* Shared Footer Section */}
      <footer className="bg-white text-black/60 py-16 px-6 md:px-12 border-t border-zinc-200 relative z-10 w-full mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
          <div className="flex flex-col gap-4 items-start md:col-span-2">
            <img src="/Prabhava_logo.png" alt="Prabhava Logo" className="h-[50px] w-[130px] object-cover object-center invert" />
            <p className="text-[14px] leading-relaxed max-w-sm text-black/70">
              Prabhava is a premium dashboard for cinema enthusiasts, independent critics, and casual moviegoers to write, share, and discuss cinema takes.
            </p>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-black font-bold text-[15px] uppercase tracking-wider mb-2">Explore</h4>
            <Link to="/" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Home</Link>
            <Link to="/feed" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Reviews Feed</Link>
            <Link to="/login" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Start Writing</Link>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <h4 className="text-black font-bold text-[15px] uppercase tracking-wider mb-2">Community</h4>
            <a href="https://letterboxd.com" target="_blank" rel="noreferrer" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Letterboxd</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Twitter / X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[14px] hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Instagram</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-zinc-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
          <span className="text-center md:text-left">© 2026 Prabhava. All rights reserved. Created for movie critics. Designed and developed by <a href="https://sripadastudios.com" target="_blank" rel="noreferrer" className="text-[14px] font-medium hover:text-[#e50914] transition-colors duration-200 sliding-underline-link">Sripada Studios</a></span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black transition-colors duration-200 sliding-underline-link">Terms of Use</a>
            <a href="#" className="hover:text-black transition-colors duration-200 sliding-underline-link">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
