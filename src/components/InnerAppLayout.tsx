import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../types'

interface InnerAppLayoutProps {
  currentUser: User | null
  onLogout: () => void
  children: ReactNode
}

export function InnerAppLayout({ currentUser, onLogout, children }: InnerAppLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-inner min-h-screen w-full flex flex-col">
      {/* Shared Inner Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 py-5 bg-black/40 backdrop-blur-[10px] border-b border-white/10 w-full gap-4 sm:gap-0">
        <img 
          src="/Prabhava_logo.png" 
          className="h-[40px] w-[120px] object-cover object-center cursor-pointer" 
          alt="Prabhava Logo" 
          onClick={() => navigate('/')} 
        />
        <nav className="flex gap-[25px] items-center">
          <Link 
            to="/feed" 
            className="text-white/85 no-underline font-medium text-[15px] hover:text-white transition-colors duration-200"
          >
            Explore
          </Link>
          {currentUser && (
            <Link 
              to="/upload" 
              className="text-white/85 no-underline font-medium text-[15px] hover:text-white transition-colors duration-200"
            >
              Upload
            </Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="text-white/85 no-underline font-medium text-[15px] hover:text-white transition-colors duration-200"
            >
              Admin Panel
            </Link>
          )}
          
          {currentUser ? (
            <div className="flex gap-[15px] items-center ml-[10px]">
              <span className="text-[14px] text-white/70">
                Hi, <strong className="text-white">{currentUser.username}</strong>
              </span>
              <button 
                onClick={() => {
                  onLogout()
                  navigate('/')
                }}
                className="font-sans text-[13px] font-medium px-[12px] py-[6px] rounded-[6px] cursor-pointer transition-all duration-250 bg-transparent text-white border border-white/50 hover:bg-white/10 hover:border-white/80 hover:-translate-y-[1px]"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="font-sans text-[13px] font-medium px-[15px] py-[6px] rounded-[6px] cursor-pointer transition-all duration-250 bg-white/20 hover:bg-white/30 text-white hover:-translate-y-[1px] text-center"
            >
              Login / Sign Up
            </Link>
          )}
        </nav>
      </header>

      {/* Main Inner Content Frame */}
      <main className="flex-grow max-w-[1100px] w-full mx-auto my-[40px] px-5">
        {children}
      </main>
    </div>
  )
}
