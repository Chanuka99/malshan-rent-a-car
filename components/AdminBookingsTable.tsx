'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateBookingStatusAction } from '@/app/actions/admin'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Booking } from '@/types/supabase'
import { Wifi, RefreshCw } from 'lucide-react'

interface BookingWithCar extends Booking {
  cars: { name: string } | null
  profiles: { full_name: string } | null
}

interface AdminBookingsTableProps {
  initialBookings: BookingWithCar[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export function AdminBookingsTable({ initialBookings }: AdminBookingsTableProps) {
  const [bookings, setBookings] = useState<BookingWithCar[]>(initialBookings)
  const [isRealtime, setIsRealtime] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('admin-bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        async () => {
          // Re-fetch bookings with join data on any change
          const { data } = await supabase
            .from('bookings')
            .select('*, cars(name), profiles(full_name)')
            .order('created_at', { ascending: false })

          if (data) {
            setBookings((data as unknown) as BookingWithCar[])
          }
        }
      )
      .subscribe((status) => {
        setIsRealtime(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleStatusChange(
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) {
    setUpdating(bookingId)
    await updateBookingStatusAction(bookingId, status)
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    )
    setUpdating(null)
  }

  return (
    <div>
      {/* Realtime indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${isRealtime ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {isRealtime ? (
            <>
              <Wifi size={12} />
              <span>Live updates active</span>
            </>
          ) : (
            <>
              <RefreshCw size={12} className="animate-spin" />
              <span>Connecting...</span>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Ref', 'Customer', 'Vehicle', 'Pick-up', 'Drop-off', 'Days', 'Total', 'Status', 'Action'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {booking.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {booking.profiles?.full_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {booking.cars?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(booking.pickup_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(booking.dropoff_date)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {booking.total_days}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand whitespace-nowrap">
                    {formatCurrency(booking.total_price)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-xs capitalize border ${statusColors[booking.status] ?? 'bg-gray-100 text-gray-600'}`}
                      variant="outline"
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={booking.status}
                      onValueChange={(val) =>
                        handleStatusChange(booking.id, val as 'pending' | 'confirmed' | 'cancelled')
                      }
                      disabled={updating === booking.id}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirm</SelectItem>
                        <SelectItem value="cancelled">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
