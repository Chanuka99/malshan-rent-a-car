'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cancelBookingAction } from '@/app/actions/booking'
import { XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    setLoading(true)
    await cancelBookingAction(bookingId)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      variant={confirmed ? 'destructive' : 'outline'}
      className={`text-xs flex items-center gap-1.5 ${!confirmed ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}`}
      onClick={handleCancel}
      disabled={loading}
    >
      <XCircle size={14} />
      {loading ? 'Cancelling...' : confirmed ? 'Confirm Cancel?' : 'Cancel Booking'}
    </Button>
  )
}
