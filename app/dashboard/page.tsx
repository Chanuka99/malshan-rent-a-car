import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Car, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { CancelBookingButton } from '@/components/CancelBookingButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Bookings',
  description: 'View and manage your Malshan Rent A Car bookings.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, cars(name, images, brand, model)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const upcoming = (bookings ?? []).filter(
    (b) => b.dropoff_date >= today && b.status !== 'cancelled'
  )
  const past = (bookings ?? []).filter(
    (b) => b.dropoff_date < today || b.status === 'cancelled'
  )

  const statusIcon = {
    pending: <AlertCircle size={14} className="text-yellow-600" />,
    confirmed: <CheckCircle size={14} className="text-green-600" />,
    cancelled: <XCircle size={14} className="text-red-500" />,
  }

  function BookingCard({ booking }: { booking: typeof bookings extends (infer T)[] | null ? T : never }) {
    const car = ((booking.cars as unknown) as { name: string; images: string[]; brand: string; model: string } | null)
    return (
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Car size={16} className="text-gray-400" />
                <h3 className="font-bold text-gray-900">{car?.name ?? 'Unknown Car'}</h3>
                <Badge
                  className={`text-xs capitalize flex items-center gap-1 ${getStatusColor(booking.status)}`}
                  variant="secondary"
                >
                  {statusIcon[booking.status as keyof typeof statusIcon]}
                  {booking.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {car?.brand} {car?.model}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{formatDate(booking.pickup_date)}</span>
                  <span className="text-gray-300">→</span>
                  <span>{formatDate(booking.dropoff_date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  <span>{booking.total_days} day{booking.total_days !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-xl font-bold text-brand">
                  {formatCurrency(booking.total_price)}
                </p>
              </div>
              {booking.status === 'pending' && (
                <CancelBookingButton bookingId={booking.id} />
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-mono">
              Ref: {booking.id.toUpperCase().slice(0, 8)}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-1">
            My Account
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'}!
          </h1>
          <p className="text-gray-500 mt-1">
            {bookings?.length ?? 0} total booking{(bookings?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings?.length ?? 0, color: 'text-gray-900' },
            { label: 'Upcoming', value: upcoming.length, color: 'text-green-600' },
            { label: 'Completed/Cancelled', value: past.length, color: 'text-gray-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <div className="text-center py-16">
                <Car size={40} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700 mb-2">No upcoming bookings</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Ready to explore Colombo? Browse our fleet and book your next ride.
                </p>
                <Button
                  className="bg-brand hover:bg-brand-dark text-white"
                  render={
                    <Link href="/cars">Browse Cars</Link>
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length === 0 ? (
              <div className="text-center py-16">
                <Clock size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No past bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
