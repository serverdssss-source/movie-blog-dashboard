import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types'

interface LoginPageProps {
  currentUser: User | null
  onLogin: (username: string, role: 'admin' | 'user') => void
}

export function LoginPage({ currentUser, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>('user')
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/feed')
    }
  }, [currentUser, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onLogin(username.trim(), role)
      navigate('/feed')
    }
  }

  return (
    <div className="max-w-[450px] mx-auto my-[40px] bg-white/8 backdrop-blur-[20px] border border-white/15 rounded-[16px] p-[35px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <h2 className="text-[26px] font-bold mb-[20px] text-center text-white">Sign In / Register</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-[20px]">
          <label className="block text-[14px] font-semibold mb-[8px] text-white/90">Username</label>
          <input 
            type="text" 
            className="bg-white/7 border border-white/15 rounded-[8px] text-white px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none focus:bg-white/12 focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200 placeholder-white/30"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter username" 
            required 
          />
        </div>

        <div className="mb-[25px]">
          <label className="block text-[14px] font-semibold mb-[8px] text-white/90">Role Privilege</label>
          <select 
            className="bg-white/7 border border-white/15 rounded-[8px] text-white px-[16px] py-[12px] text-[15px] font-sans w-full focus:outline-none focus:bg-white/12 focus:border-white/40 focus:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-200"
            value={role} 
            onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
            style={{ colorScheme: 'dark' }} // Ensuring dropdown options render properly on system theme
          >
            <option value="user" className="bg-[#1e1e24] text-white">Regular User (Manage own posts)</option>
            <option value="admin" className="bg-[#1e1e24] text-white">Administrator (Full control)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="bg-white text-[#121212] border-none rounded-[8px] px-[24px] py-[12px] text-[15px] font-semibold cursor-pointer w-full transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-[1px]"
        >
          Access Dashboard
        </button>
      </form>
    </div>
  )
}
