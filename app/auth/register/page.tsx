'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Car, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RegisterSchema, type RegisterInput } from '@/lib/validations'
import { registerAction } from '@/app/actions/auth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) })

  const router = useRouter()

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true)
    setServerError(null)
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    const result = await registerAction(formData)
    if (result?.error) {
      setServerError(result.error)
      setIsLoading(false)
    } else if (result?.success && result?.redirect) {
      // Keep isLoading true during navigation, but set a safety timeout
      router.push(result.redirect)
      // Reset after a timeout in case navigation is slow
      setTimeout(() => setIsLoading(false), 5000)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-8">
            <span className="text-2xl font-bold text-white">Malshan <span className="text-brand">Rent A Car</span></span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Start Your Journey<br />with Malshan Rent A Car
          </h2>
          <p className="text-gray-400 max-w-xs">
            Create a free account and get 20% off your first booking. No credit card required.
          </p>
          <div className="mt-8 bg-white/10 rounded-xl p-5 text-left space-y-3">
            {['Free cancellation on all bookings', 'Pay only when you arrive', 'Access to 50+ premium vehicles'].map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Drive<span className="text-brand">Ease</span></span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 mb-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative mt-1">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="pl-9"
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative mt-1">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="lastName"
                    placeholder="Silva"
                    className="pl-9"
                    {...register('lastName')}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  className="pl-9"
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="pl-9 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className="pl-9 pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
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
                  Creating account...
                </span>
              ) : (
                'Create Free Account'
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-gray-600">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-gray-600">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
