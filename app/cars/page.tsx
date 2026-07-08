import { Car as CarIcon, SlidersHorizontal } from 'lucide-react'
import { CarCard } from '@/components/CarCard'
import { CarsFilterSidebar } from '@/components/CarsFilterSidebar'
import { createClient } from '@/lib/supabase/server'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
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
    status?: string
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
    type CarType = 'Hatchback' | 'Sedan' | 'SUV / Crossover' | 'Van' | 'Station Wagon' | 'Pickup Truck / Double Cab' | 'MPV (Multi-Purpose Vehicle)' | 'Coupe' | 'Convertible'
    const types = params.type.split(',') as CarType[]
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
    query = query.eq('fuel_type', params.fuelType as 'petrol' | 'diesel' | 'electric' | 'hybrid')
  }

  if (params.seats) {
    query = query.gte('seats', parseInt(params.seats))
  }

  if (params.maxPrice) {
    query = query.lte('price_per_day', parseInt(params.maxPrice))
  }

  if (params.status) {
    query = query.eq('available', params.status === 'available')
  }

  const { data: cars } = await query

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-1">
                Our Fleet
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Available Cars</h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                {cars?.length ?? 0} vehicle{(cars?.length ?? 0) !== 1 ? 's' : ''} available
                {params.pickup && params.dropoff
                  ? ` · ${new Date(params.pickup).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → ${new Date(params.dropoff).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                  : ''}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" className="w-full flex items-center gap-2 h-11 border-gray-200">
                      <SlidersHorizontal size={16} />
                      Filter & Sort
                    </Button>
                  }
                />
                <SheetContent side="right" className="p-0 border-none w-[85vw] sm:w-[400px]">
                  <div className="h-full overflow-y-auto">
                    <div className="p-6">
                      <SheetHeader className="mb-6">
                        <SheetTitle>Filter Vehicles</SheetTitle>
                      </SheetHeader>
                      <CarsFilterSidebar currentFilters={params} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
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
