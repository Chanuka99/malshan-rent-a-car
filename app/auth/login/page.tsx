'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Mail, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginSchema, type LoginInput } from '@/lib/validations'

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    setServerError(null)
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      const result = await res.json()
      
      if (result?.error) {
        setServerError(result.error)
        setIsLoading(false)
      } else {
        // Hard navigate to verify page
        window.location.href = `/auth/verify?email=${encodeURIComponent(data.email)}`
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-8">
            <span className="text-2xl font-bold text-white">Malshan <span className="text-brand">Rent A Car</span></span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Welcome Back to<br />Malshan Rent A Car
          </h2>
          <p className="text-gray-400 max-w-xs">
            Sign in to manage your bookings and explore our fleet of premium vehicles.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Drive<span className="text-brand">Ease</span></span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-500 mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-brand font-medium hover:underline">
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending code...
                </span>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
