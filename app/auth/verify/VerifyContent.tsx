'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Mail, ShieldCheck, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { verifyOtpAction } from '@/app/actions/auth'

export default function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || ''

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) router.replace('/auth/register')
  }, [email, router])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = cleaned
    setDigits(newDigits)
    setError(null)

    if (cleaned && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }

    if (cleaned && index === 7) {
      const allFilled = newDigits.every(d => d !== '')
      if (allFilled) submitOtp(newDigits.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8)
    if (pasted.length === 8) {
      const newDigits = pasted.split('')
      setDigits(newDigits)
      inputRefs.current[7]?.focus()
      submitOtp(pasted)
    }
  }

  async function submitOtp(token: string) {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('token', token)
      const result = await verifyOtpAction(formData)
      
      if (result?.error) {
        setError(result.error)
        setDigits(['', '', '', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else if (result?.success && result?.redirect) {
        window.location.href = result.redirect
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = digits.join('')
    if (token.length !== 8) {
      setError('Please enter all 8 digits.')
      return
    }
    submitOtp(token)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-brand/20 border border-brand/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck size={36} className="text-brand" />
          </div>
          <span className="text-2xl font-bold text-white">
            Malshan <span className="text-brand">Rent A Car</span>
          </span>
          <h2 className="text-3xl font-bold text-white mt-6 mb-4 leading-tight">
            Secure Your<br />Account
          </h2>
          <p className="text-gray-400 max-w-xs">
            We sent a one-time verification code to your email to keep your account safe.
          </p>
        </div>
      </div>

      {/* Right panel — OTP form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-md">

          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
            <Mail size={28} className="text-brand" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-500 mb-2">
            We sent an 8-digit verification code to:
          </p>
          <p className="text-gray-900 font-semibold mb-8 break-all">{email}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  className={`w-10 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg sm:rounded-xl outline-none transition-all
                    ${digit ? 'border-brand bg-brand/5 text-brand' : 'border-gray-200 bg-white text-gray-900'}
                    ${error ? 'border-red-400 bg-red-50' : ''}
                    focus:border-brand focus:ring-4 focus:ring-brand/10
                  `}
                  disabled={isLoading}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-11"
              disabled={isLoading || digits.some(d => d === '')}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify & Continue'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive the code?</p>
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={() => {
                setResendCooldown(60)
                setError(null)
                setDigits(['', '', '', '', '', '', '', ''])
                inputRefs.current[0]?.focus()
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Wrong email?{' '}
            <a href="/auth/register" className="text-brand font-medium hover:underline">
              Go back
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
