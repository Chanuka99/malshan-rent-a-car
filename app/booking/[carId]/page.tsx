import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/BookingForm'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'

interface BookingPageProps {
  params: Promise<{ carId: string }>
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { carId } = await params
  const supabase = await createClient()
  const { data: car } = await supabase.from('cars').select('name').eq('id', carId).single()
  return { title: car ? `Book ${car.name}` : 'Book a Car' }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { carId } = await params
  const supabase = await createClient()

  const { data: car } = await supabase.from('cars').select('*').eq('id', carId).single()

  if (!car) notFound()

  const imageUrl = car.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Book Your Car</h1>
          <p className="text-gray-500 mt-2">Complete the steps below to reserve your vehicle</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Car Summary Card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm sticky top-24">
              <div className="relative h-48">
                <Image
                  src={imageUrl}
                  alt={car.name}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="p-5">
                <h2 className="font-bold text-gray-900 text-lg">{car.name}</h2>
                <p className="text-sm text-gray-500">
                  {car.brand} {car.model} · {car.year}
                </p>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-brand">
                    {formatCurrency(car.price_per_day)}
                  </span>
                  <span className="text-gray-400 text-sm mb-0.5">/ day</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Free cancellation
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Pay on arrival
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Full insurance included
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="flex-1 w-full">
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  )
}
