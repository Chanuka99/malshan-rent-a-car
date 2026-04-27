'use server'

import { createClient } from '@/lib/supabase/server'
import { CarSchema } from '@/lib/validations'
import type { CarInput } from '@/lib/validations'
import type { Profile } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const profile = data as Profile | null
  return profile?.role === 'admin'
}

export async function addCarAction(payload: CarInput & { images: string[] }) {
  const parsed = CarSchema.safeParse(payload)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('cars').insert({
    name: parsed.data.name,
    brand: parsed.data.brand,
    model: parsed.data.model,
    year: parsed.data.year,
    type: parsed.data.type,
    seats: parsed.data.seats,
    transmission: parsed.data.transmission,
    fuel_type: parsed.data.fuelType,
    price_per_day: parsed.data.pricePerDay,
    description: parsed.data.description ?? null,
    images: payload.images,
    available: true,
  })
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/cars')
  revalidatePath('/')
  return { success: true }
}

export async function updateCarAction(
  carId: string,
  payload: CarInput & { images: string[]; available: boolean }
) {
  const parsed = CarSchema.safeParse(payload)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('cars')
    .update({
      name: parsed.data.name,
      brand: parsed.data.brand,
      model: parsed.data.model,
      year: parsed.data.year,
      type: parsed.data.type,
      seats: parsed.data.seats,
      transmission: parsed.data.transmission,
      fuel_type: parsed.data.fuelType,
      price_per_day: parsed.data.pricePerDay,
      description: parsed.data.description ?? null,
      images: payload.images,
      available: payload.available,
    })
    .eq('id', carId)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/cars')
  revalidatePath(`/cars/${carId}`)
  return { success: true }
}

export async function deleteCarAction(carId: string) {
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('cars').delete().eq('id', carId)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/cars')
  revalidatePath('/')
  return { success: true }
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
) {
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = await createClient()

  // Get the car_id for this booking
  const { data: bookingData } = await supabase
    .from('bookings')
    .select('car_id')
    .eq('id', bookingId)
    .single()

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) return { error: error.message }

  // If status is confirmed, car is NOT available.
  // If status is cancelled, car IS available.
  if (bookingData?.car_id) {
    await supabase
      .from('cars')
      .update({ available: status !== 'confirmed' })
      .eq('id', bookingData.car_id)
  }

  revalidatePath('/admin')
  revalidatePath('/cars')
  revalidatePath('/')
  return { success: true }
}

export async function uploadCarImageAction(file: File): Promise<{ url: string } | { error: string }> {
  if (!(await isAdmin())) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('cars')
    .upload(fileName, file, { contentType: file.type })
  if (uploadError) return { error: uploadError.message }

  const { data } = supabase.storage.from('cars').getPublicUrl(fileName)
  return { url: data.publicUrl }
}
