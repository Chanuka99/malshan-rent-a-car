'use server'

import { createClient } from '@/lib/supabase/server'
import { sendBookingConfirmationEmail } from '@/lib/email'
import { BookingSchema } from '@/lib/validations'
import { calculateDays } from '@/lib/utils'
import { redirect } from 'next/navigation'

interface CreateBookingPayload {
  carId: string
  carName: string
  pricePerDay: number
  formData: {
    driverName: string
    email: string
    phone: string
    pickupDate: string
    dropoffDate: string
  }
}

export async function createBookingAction(payload: CreateBookingPayload) {
  const parsed = BookingSchema.safeParse(payload.formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to make a booking.' }
  }

  const totalDays = calculateDays(parsed.data.pickupDate, parsed.data.dropoffDate)
  if (totalDays <= 0) {
    return { error: 'Drop-off date must be after pick-up date.' }
  }

  const totalPrice = totalDays * payload.pricePerDay

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      car_id: payload.carId,
      pickup_date: parsed.data.pickupDate,
      dropoff_date: parsed.data.dropoffDate,
      total_days: totalDays,
      total_price: totalPrice,
      status: 'pending',
    })
    .select()
    .single()

  if (bookingError || !booking) {
    return { error: bookingError?.message ?? 'Failed to create booking.' }
  }

  // Send confirmation email (non-blocking)
  try {
    await sendBookingConfirmationEmail({
      to: parsed.data.email,
      bookingId: booking.id,
      carName: payload.carName,
      pickupDate: parsed.data.pickupDate,
      dropoffDate: parsed.data.dropoffDate,
      totalDays,
      totalPrice,
      driverName: parsed.data.driverName,
    })
  } catch (emailError) {
    console.error('Email send failed (non-fatal):', emailError)
  }

  redirect(`/booking/confirmation?ref=${booking.id}`)
}

export async function cancelBookingAction(bookingId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', user.id) // users can only cancel their own bookings

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
