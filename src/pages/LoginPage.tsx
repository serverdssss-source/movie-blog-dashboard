import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import type { User } from '../types'
import StaggeredTextRoll from '../components/StaggeredTextRoll'

interface LoginPageProps {
  currentUser: User | null
  onLogin: (username: string, role: 'admin' | 'user') => void
}

export function LoginPage({ currentUser, onLogin }: LoginPageProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Set mode to 'signup' if query param mode=signup, else default to 'signin'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hearAbout, setHearAbout] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [turnstileState, setTurnstileState] = useState<'idle' | 'verifying' | 'success'>('idle')
  const [showPassword, setShowPassword] = useState(false)

  // Sync mode state with query params if they change
  useEffect(() => {
    const m = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
    setMode(m)
    setShowPassword(false)
  }, [searchParams])

  // Redirect to feed if user is logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/feed')
    }
  }, [currentUser, navigate])

  // Turnstile micro-interaction trigger
  useEffect(() => {
    if (mode === 'signup') {
      setTurnstileState('verifying')
      const timer = setTimeout(() => {
        setTurnstileState('success')
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setTurnstileState('idle')
    }
  }, [mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'signup') {
      if (!agreed) {
        alert('Please agree to the Service Agreement and Terms of Use.')
        return
      }
      if (turnstileState !== 'success') {
        alert('Please wait for captcha verification.')
        return
      }
      const displayName = fullName.trim() || email.trim().split('@')[0]
      const resolvedRole = email.toLowerCase().includes('admin') ? 'admin' : 'user'
      onLogin(displayName, resolvedRole)
    } else {
      if (!email.trim() || !password.trim()) {
        alert('Please fill out all fields.')
        return
      }
      const displayName = email.trim().split('@')[0]
      const resolvedRole = email.toLowerCase().includes('admin') ? 'admin' : 'user'
      onLogin(displayName, resolvedRole)
    }
    navigate('/feed')
  }

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans flex overflow-hidden">
      {/* Left side: Form Column */}
      <div className="w-full md:w-[50%] lg:w-[45%] xl:w-[40%] flex flex-col justify-between px-6 py-8 md:px-12 md:py-12 overflow-y-auto max-h-screen">
        {/* Top bar: Brand logo (inverted for light theme) */}
        <div className="flex items-center mb-8">
          <img
            src="/Prabhava_logo.png"
            alt="Prabhava Logo"
            className="h-[48px] w-[124px] object-cover object-center cursor-pointer invert"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Form Container */}
        <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto">
          {mode === 'signup' ? (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h1 className="text-[32px] font-bold tracking-tight mb-2 leading-tight text-zinc-900">Create an account</h1>
                <p className="text-[14px] text-zinc-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      navigate('/login?mode=signin')
                    }}
                    className="text-zinc-900 font-semibold cursor-pointer sliding-underline-link"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              {/* Full name */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-zinc-800">Your full name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black text-black focus:outline-none rounded-[8px] px-4 py-3 text-[15px] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-zinc-800">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black text-black focus:outline-none rounded-[8px] px-4 py-3 text-[15px] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[14px] font-semibold text-zinc-800">Password</label>
                  <span className="text-[12px] text-zinc-500">At least 9 characters</span>
                </div>
                <div className="relative w-full flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={9}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black text-black focus:outline-none rounded-[8px] pl-4 pr-10 py-3 text-[15px] transition-colors ${!showPassword ? 'password-input-asterisk' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      /* Eye Slash Icon */
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Hear about us? */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-zinc-800">Where did you hear about us?</label>
                <select
                  required
                  value={hearAbout}
                  onChange={(e) => setHearAbout(e.target.value)}
                  className="bg-white border border-zinc-200 hover:border-zinc-300 focus:border-black text-black focus:outline-none rounded-[8px] px-4 py-3 text-[15px] transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="recommendation">Friend or Recommendation</option>
                  <option value="social">Social Media</option>
                  <option value="search">Search Engine</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Agreement checkbox */}
              <div className="flex items-start gap-3 mt-1">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-[16px] w-[16px] rounded bg-transparent border border-zinc-300 focus:ring-0 cursor-pointer accent-black"
                />
                <label htmlFor="agree-checkbox" className="text-[13px] text-zinc-500 leading-normal select-none cursor-pointer">
                  I agree to the <span className="text-zinc-900 hover:underline cursor-pointer">Service Agreement</span> and <span className="text-zinc-900 hover:underline cursor-pointer">Terms of Use</span>
                </label>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-zinc-900 text-white font-semibold rounded-full px-6 py-3.5 text-[15px] cursor-pointer hover:bg-zinc-800 transition-colors shadow-sm select-none"
                >
                  <StaggeredTextRoll text="Create account" />
                </button>
                <Link
                  to="/"
                  className="border border-zinc-200 text-zinc-900 font-semibold rounded-full px-6 py-3.5 text-[15px] cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all shadow-sm text-center select-none"
                >
                  <StaggeredTextRoll text="Back to Home" />
                </Link>
              </div>
            </form>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <h1 className="text-[32px] font-bold tracking-tight mb-2 leading-tight text-zinc-900">Sign in</h1>
                <p className="text-[14px] text-zinc-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      navigate('/login?mode=signup')
                    }}
                    className="text-zinc-900 font-semibold cursor-pointer sliding-underline-link"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-zinc-800">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black text-black focus:outline-none rounded-[8px] px-4 py-3 text-[15px] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-zinc-800">Password</label>
                <div className="relative w-full flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-transparent border border-zinc-200 hover:border-zinc-300 focus:border-black text-black focus:outline-none rounded-[8px] pl-4 pr-10 py-3 text-[15px] transition-colors ${!showPassword ? 'password-input-asterisk' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      /* Eye Slash Icon */
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex justify-between items-center mt-2">
                <button
                  type="submit"
                  className="bg-zinc-900 text-white font-semibold rounded-full px-7 py-3 text-[15px] cursor-pointer hover:bg-zinc-800 transition-colors shadow-sm select-none"
                >
                  <StaggeredTextRoll text="Sign in" />
                </button>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password recovery is not supported in the demo.')
                  }}
                  className="text-zinc-500 hover:text-zinc-900 font-medium text-[14px] transition-colors sliding-underline-link"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          )}
        </div>

        {/* Bottom bar info */}
        <div className="mt-8 text-[12px] text-zinc-400">
          Demo Dashboard. Log in with any email. Type "admin" to access admin panel views.
        </div>
      </div>

      {/* Right side: Artwork column (Redesigned with glowing moving blobs) */}
      <div className="hidden md:block md:w-[50%] lg:w-[55%] xl:w-[60%] p-6 lg:p-8 h-screen relative bg-zinc-50">
        <div className="w-full h-full rounded-[24px] lg:rounded-[32px] overflow-hidden relative shadow-2xl bg-black">
          {/* Moving blobs for organic gradient mesh (Brighter, glowing reds) */}
          <div className="absolute top-[-20%] left-[-20%] w-[85%] h-[85%] bg-[#e50914] rounded-full filter blur-[90px] animate-blob-1 opacity-[0.75]"></div>
          <div className="absolute bottom-[-15%] right-[-15%] w-[95%] h-[95%] bg-[#ff2e3b] rounded-full filter blur-[100px] animate-blob-2 opacity-[0.70]"></div>
          <div className="absolute top-[20%] right-[-20%] w-[75%] h-[75%] bg-[#90050b] rounded-full filter blur-[85px] animate-blob-3 opacity-[0.80]"></div>
          <div className="absolute bottom-[20%] left-[-15%] w-[65%] h-[65%] bg-[#b30610] rounded-full filter blur-[80px] animate-blob-4 opacity-[0.75]"></div>

          {/* Subtle decorative grain overlay for texture */}
          <div className="absolute inset-0 noise-overlay pointer-events-none"></div>
          {/* Decorative vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 mix-blend-overlay pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
}
