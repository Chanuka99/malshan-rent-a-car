import { notFound } from 'next/navigation'
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

  const durations = [
    { label: 'Daily', price: car.price_per_day, unit: '/ day', active: true },
    { label: 'Weekly', price: car.price_per_day * 7, unit: '/ week', active: false },
    { label: 'Monthly', price: car.price_per_day * 30, unit: '/ month', active: false },
  ]

  const perks = ['No hidden fees', 'Free cancellation', '24/7 roadside support', 'Fully insured vehicle']

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
          {/* ── Left: Gallery + Specs + Description ────────────── */}
          <div className="lg:col-span-3">
            <CarGallery images={car.images} name={car.name} />

            {/* Title block (mobile shows here too, feels app-like) */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="capitalize">
                  {getCarTypeLabel(car.type)}
                </Badge>
                {car.available ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    <CheckCircle size={12} />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                    <XCircle size={12} />
                    Unavailable
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                {car.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {car.brand} {car.model} · {car.year}
              </p>
            </div>

            {/* Specs — udrive-style icon chip grid */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center">
                      <Icon size={18} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-gray-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About this car</h2>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            )}
          </div>

          {/* ── Right: Sticky booking card ─────────────────────── */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7">
              {/* Price */}
              <p className="text-sm text-gray-500 mb-1">Starting from</p>
              <div className="flex items-end gap-2 mb-5">
                <span className="text-4xl font-black text-brand">
                  {formatCurrency(car.price_per_day)}
                </span>
                <span className="text-gray-400 mb-1">/ day</span>
              </div>

              {/* Duration selector (udrive-style pills) */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {durations.map((d) => (
                  <div
                    key={d.label}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      d.active
                        ? 'border-brand bg-brand-light'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-0.5 ${d.active ? 'text-brand' : 'text-gray-500'}`}>
                      {d.label}
                    </p>
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(d.price)}</p>
                    <p className="text-[10px] text-gray-400">{d.unit}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-12 text-base rounded-xl"
                disabled={!car.available}
                render={
                  <Link href={car.available ? `/booking/${car.id}` : '#'}>
                    {car.available ? 'Book This Car' : 'Currently Unavailable'}
                  </Link>
                }
              />
              <p className="text-center text-xs text-gray-400 mt-3">
                All taxes included · Pay on arrival
              </p>

              {/* Perks */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-brand shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
