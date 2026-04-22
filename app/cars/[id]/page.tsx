import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Users,
  Zap,
  Settings2,
  Calendar,
  Car,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, getCarTypeLabel } from '@/lib/utils'
import { CarGallery } from '@/components/CarGallery'
import type { Metadata } from 'next'

interface CarDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: car } = await supabase.from('cars').select('name, brand, model').eq('id', id).single()

  return {
    title: car ? `${car.name} — ${car.brand} ${car.model}` : 'Car Details',
    description: car ? `Rent the ${car.brand} ${car.model} in Colombo with Malshan Rent A Car.` : '',
  }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: car } = await supabase.from('cars').select('*').eq('id', id).single()

  if (!car) {
    notFound()
  }

  const specs = [
    { label: 'Brand', value: car.brand, Icon: Car },
    { label: 'Model', value: car.model, Icon: Car },
    { label: 'Year', value: String(car.year), Icon: Calendar },
    { label: 'Type', value: getCarTypeLabel(car.type), Icon: Car },
    { label: 'Seats', value: `${car.seats} seats`, Icon: Users },
    { label: 'Transmission', value: car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1), Icon: Settings2 },
    { label: 'Fuel Type', value: car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1), Icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Fleet
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Gallery */}
          <div className="lg:col-span-3">
            <CarGallery images={car.images} name={car.name} />
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {getCarTypeLabel(car.type)}
                </Badge>
                {car.available ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle size={12} />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    <XCircle size={12} />
                    Unavailable
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
              <p className="text-gray-500 mt-1">
                {car.brand} {car.model} · {car.year}
              </p>
            </div>

            {/* Price */}
            <div className="bg-brand-light border border-red-100 rounded-xl p-5 mb-6">
              <p className="text-sm text-gray-500 mb-1">Starting from</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-brand">
                  {formatCurrency(car.price_per_day)}
                </span>
                <span className="text-gray-400 mb-1">/ day</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">All taxes included · Pay on arrival</p>
            </div>

            {/* Book Button */}
            <Button
              className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-12 text-base mb-6"
              disabled={!car.available}
              render={
                <Link href={car.available ? `/booking/${car.id}` : '#'}>
                  {car.available ? 'Book This Car' : 'Currently Unavailable'}
                </Link>
              }
            />

            <Separator className="mb-6" />

            {/* Specs table */}
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {specs.map(({ label, value, Icon }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon size={14} className="text-gray-400" />
                      {label}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">About this car</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
