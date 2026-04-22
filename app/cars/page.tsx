import { Car as CarIcon } from 'lucide-react'
import { CarCard } from '@/components/CarCard'
import { CarsFilterSidebar } from '@/components/CarsFilterSidebar'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Fleet',
  description: 'Browse our full fleet of economy, SUV, luxury, and van rentals in Colombo.',
}

interface CarsPageProps {
  searchParams: Promise<{
    type?: string
    transmission?: string
    fuelType?: string
    seats?: string
    maxPrice?: string
    pickup?: string
    dropoff?: string
  }>
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('cars').select('*').order('price_per_day', { ascending: true })

  // Apply filters
  if (params.type) {
    const types = params.type.split(',') as ('economy' | 'suv' | 'luxury' | 'van')[]
    if (types.length === 1) {
      query = query.eq('type', types[0])
    } else {
      query = query.in('type', types)
    }
  }

  if (params.transmission) {
    query = query.eq('transmission', params.transmission as 'auto' | 'manual')
  }

  if (params.fuelType) {
    query = query.eq('fuel_type', params.fuelType as 'petrol' | 'diesel' | 'electric')
  }

  if (params.seats) {
    query = query.gte('seats', parseInt(params.seats))
  }

  if (params.maxPrice) {
    query = query.lte('price_per_day', parseInt(params.maxPrice))
  }

  const { data: cars } = await query

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-1">
            Our Fleet
          </p>
          <h1 className="text-4xl font-bold text-gray-900">Available Cars</h1>
          <p className="text-gray-500 mt-2">
            {cars?.length ?? 0} vehicle{(cars?.length ?? 0) !== 1 ? 's' : ''} available
            {params.pickup && params.dropoff
              ? ` · ${new Date(params.pickup).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → ${new Date(params.dropoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
              : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <CarsFilterSidebar currentFilters={params} />
          </aside>

          {/* Cars Grid */}
          <div className="flex-1">
            {!cars || cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <CarIcon size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Cars Found</h3>
                <p className="text-gray-500 max-w-sm">
                  No vehicles match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
