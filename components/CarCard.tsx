import Image from 'next/image'
import Link from 'next/link'
import { Users, Zap, Settings2, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, getCarTypeLabel } from '@/lib/utils'
import type { Car } from '@/types/supabase'

interface CarCardProps {
  car: Car
}

const typeColors: Record<string, string> = {
  Hatchback: 'bg-blue-100 text-blue-700',
  Sedan: 'bg-indigo-100 text-indigo-700',
  'SUV / Crossover': 'bg-green-100 text-green-700',
  Van: 'bg-orange-100 text-orange-700',
  'Station Wagon': 'bg-teal-100 text-teal-700',
  'Pickup Truck / Double Cab': 'bg-yellow-100 text-yellow-700',
  'MPV (Multi-Purpose Vehicle)': 'bg-pink-100 text-pink-700',
  Coupe: 'bg-cyan-100 text-cyan-700',
  Convertible: 'bg-red-100 text-red-700',
}

const fuelIcons: Record<string, string> = {
  petrol: '⛽',
  diesel: '🛢️',
  electric: '⚡',
}

export function CarCard({ car }: CarCardProps) {
  const imageUrl =
    car.images?.[0] ||
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'

  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <Card className="overflow-hidden border border-gray-100 card-hover shadow-sm">
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {car.available ? (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Available
            </span>
          ) : (
            <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Unavailable
            </span>
          )}
        </div>

        {/* Year badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            {car.year}
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Type badge + name */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <Badge
              className={`text-xs font-medium mb-2 ${typeColors[car.type] ?? 'bg-gray-100 text-gray-700'}`}
              variant="secondary"
            >
              {getCarTypeLabel(car.type)}
            </Badge>
            <h3 className="font-bold text-gray-900 text-lg leading-tight underline decoration-transparent decoration-2 underline-offset-4 transition-all group-hover:decoration-gray-900">
              {car.name}
            </h3>
            <p className="text-sm text-gray-500">
              {car.brand} {car.model}
            </p>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 py-3 border-y border-gray-100 my-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={14} className="text-gray-400" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Zap size={14} className="text-gray-400" />
            <span className="capitalize">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Settings2 size={14} className="text-gray-400" />
            <span className="capitalize">{car.transmission}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-brand">
              {formatCurrency(car.price_per_day)}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ day</span>
          </div>
          <span
            className={`inline-flex items-center justify-center rounded-lg px-4 h-10 text-sm font-semibold transition-all ${
              car.available
                ? 'bg-brand text-white group-hover:shadow-lg group-hover:shadow-[0_10px_20px_rgba(204,0,0,0.4)] group-hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {car.available ? 'Book Now' : 'Unavailable'}
          </span>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
