import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../types'
import StaggeredTextRoll from './StaggeredTextRoll'

interface InnerAppLayoutProps {
  currentUser: User | null
  onLogout: () => void
  children: ReactNode
}

export function InnerAppLayout({ currentUser, onLogout, children }: InnerAppLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-inner min-h-screen w-full flex flex-col text-zinc-900">
      {/* Shared Inner Header (Light theme) */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 py-5 bg-white border-b border-zinc-200 w-full gap-4 sm:gap-0 relative z-20">
        <img
          src="/Prabhava_logo.png"
          className="h-[40px] w-[120px] object-cover object-center cursor-pointer invert"
          alt="Prabhava Logo"
          onClick={() => navigate('/')}
        />
        <nav className="flex gap-[25px] items-center">
          <Link
            to="/feed"
            className="text-zinc-600 no-underline font-medium text-[15px] hover:text-zinc-900 transition-colors duration-200 sliding-underline-link"
          >
            Explore
          </Link>
          {currentUser && (
            <Link
              to="/upload"
              className="text-zinc-600 no-underline font-medium text-[15px] hover:text-zinc-900 transition-colors duration-200 sliding-underline-link"
            >
              Upload
            </Link>
          )}
          {currentUser && (
            <Link
              to="/dashboard"
              className="text-zinc-600 no-underline font-medium text-[15px] hover:text-zinc-900 transition-colors duration-200 sliding-underline-link"
            >
              Dashboard
            </Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-zinc-600 no-underline font-medium text-[15px] hover:text-zinc-900 transition-colors duration-200 sliding-underline-link"
            >
              Admin Panel
            </Link>
          )}

          {currentUser ? (
            <div className="flex gap-[15px] items-center ml-[10px]">
              <span className="text-[14px] text-zinc-500">
                Hi, <strong className="text-zinc-800">{currentUser.username}</strong>
              </span>
              <button
                onClick={() => {
                  onLogout()
                  navigate('/')
                }}
                className="font-sans text-[13px] font-semibold px-[18px] py-[8px] rounded-full cursor-pointer bg-red-600 hover:bg-red-700 text-white text-center transition-all shadow-sm hover:shadow"
              >
                <StaggeredTextRoll text="Logout" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-sans text-[13px] font-semibold px-[15px] py-[6px] rounded-[6px] cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white text-center transition-colors"
            >
              <StaggeredTextRoll text="Login / Sign Up" />
            </Link>
          )}
        </nav>
      </header>

      {/* Main Inner Content Frame */}
      <main className="flex-grow max-w-[1200px] w-full mx-auto my-[40px] px-5 relative z-10">
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
          <span>© 2026 Prabhava. All rights reserved. Created for movie critics.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black transition-colors duration-200 sliding-underline-link">Terms of Use</a>
            <a href="#" className="hover:text-black transition-colors duration-200 sliding-underline-link">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
