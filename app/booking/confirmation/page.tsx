import Link from 'next/link'
import { CheckCircle2, Calendar, Car, Home, LayoutDashboard, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your car rental booking has been confirmed.',
}

interface ConfirmationPageProps {
  searchParams: Promise<{ ref?: string }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { ref } = await searchParams
  const supabase = await createClient()

  let booking = null
  let carName = ''

  if (ref) {
    const { data } = await supabase
      .from('bookings')
      .select('*, cars(name)')
      .eq('id', ref)
      .single()

    if (data) {
      booking = data
      carName = ((data.cars as unknown) as { name: string } | null)?.name ?? ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-once">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="text-gray-500 mt-2">
            You&apos;ll receive a confirmation email shortly.
          </p>
        </div>

        {/* Booking Details Card */}
        {booking ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            {/* Reference Header */}
            <div className="bg-brand p-5 text-white text-center">
              <p className="text-sm text-white/80 mb-1">Booking Reference</p>
              <p className="text-3xl font-black font-mono tracking-wider">
                {booking.id.toUpperCase().slice(0, 8)}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {[
                {
                  Icon: Car,
                  label: 'Vehicle',
                  value: carName,
                },
                {
                  Icon: Calendar,
                  label: 'Pick-up Date',
                  value: formatDate(booking.pickup_date),
                },
                {
                  Icon: Calendar,
                  label: 'Drop-off Date',
                  value: formatDate(booking.dropoff_date),
                },
                {
                  Icon: Calendar,
                  label: 'Duration',
                  value: `${booking.total_days} day${booking.total_days !== 1 ? 's' : ''}`,
                },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon size={16} className="text-gray-400" />
                    {label}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}

              {/* Total */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-brand">
                  {formatCurrency(booking.total_price)}
                </span>
              </div>
            </div>

            {/* Pay on Arrival Notice */}
            <div className="bg-blue-50 border-t border-blue-100 p-4 flex items-start gap-3">
              <CreditCard size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Pay on Arrival</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  No payment is required now. Bring this reference and a valid ID when
                  collecting your vehicle.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
            <p className="text-gray-500">
              Booking details not found. Please check your email for confirmation.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold"
            render={
              <Link href="/dashboard" className="flex items-center justify-center gap-2">
                <LayoutDashboard size={16} />
                View My Bookings
              </Link>
            }
          />
          <Button
            variant="outline"
            className="flex-1"
            render={
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home size={16} />
                Back to Home
              </Link>
            }
          />
        </div>
      </div>
    </div>
  )
}
