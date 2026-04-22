'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'

interface FiltersProps {
  currentFilters: {
    type?: string
    transmission?: string
    fuelType?: string
    seats?: string
    maxPrice?: string
    pickup?: string
    dropoff?: string
  }
}

const carTypes = ['economy', 'suv', 'luxury', 'van']
const fuelTypes = ['petrol', 'diesel', 'electric']

export function CarsFilterSidebar({ currentFilters }: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function handleTypeToggle(type: string, checked: boolean) {
    const currentTypes = currentFilters.type?.split(',').filter(Boolean) ?? []
    let newTypes: string[]
    if (checked) {
      newTypes = [...currentTypes, type]
    } else {
      newTypes = currentTypes.filter((t) => t !== type)
    }
    updateFilter('type', newTypes.length > 0 ? newTypes.join(',') : null)
  }

  function handleClearAll() {
    const params = new URLSearchParams()
    if (currentFilters.pickup) params.set('pickup', currentFilters.pickup)
    if (currentFilters.dropoff) params.set('dropoff', currentFilters.dropoff)
    router.push(`${pathname}?${params.toString()}`)
  }

  const activeTypes = currentFilters.type?.split(',').filter(Boolean) ?? []
  const maxPrice = currentFilters.maxPrice ? parseInt(currentFilters.maxPrice) : 50000

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <SlidersHorizontal size={16} />
          Filters
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs text-brand hover:underline flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Clear
        </button>
      </div>

      <Separator className="mb-5" />

      {/* Car Type */}
      <div className="mb-6">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Car Type
        </Label>
        <div className="space-y-2.5">
          {carTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={activeTypes.includes(type)}
                onCheckedChange={(checked) => handleTypeToggle(type, checked as boolean)}
                className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm text-gray-700 capitalize cursor-pointer"
              >
                {type === 'suv' ? 'SUV' : type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-5" />

      {/* Transmission */}
      <div className="mb-6">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Transmission
        </Label>
        <div className="flex gap-2">
          {['auto', 'manual'].map((t) => (
            <button
              key={t}
              onClick={() =>
                updateFilter('transmission', currentFilters.transmission === t ? null : t)
              }
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                currentFilters.transmission === t
                  ? 'bg-brand border-brand text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Separator className="mb-5" />

      {/* Fuel Type */}
      <div className="mb-6">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Fuel Type
        </Label>
        <div className="space-y-2">
          {fuelTypes.map((fuel) => (
            <button
              key={fuel}
              onClick={() =>
                updateFilter('fuelType', currentFilters.fuelType === fuel ? null : fuel)
              }
              className={`w-full text-left px-3 py-2 text-sm rounded-lg border transition-all ${
                currentFilters.fuelType === fuel
                  ? 'bg-brand-light border-brand text-brand font-medium'
                  : 'border-transparent hover:bg-gray-50 text-gray-600'
              }`}
            >
              {fuel === 'electric' ? '⚡ Electric' : fuel === 'diesel' ? '🛢️ Diesel' : '⛽ Petrol'}
            </button>
          ))}
        </div>
      </div>

      <Separator className="mb-5" />

      {/* Min Seats */}
      <div className="mb-6">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Minimum Seats
        </Label>
        <div className="flex gap-2">
          {[2, 4, 5, 7].map((s) => (
            <button
              key={s}
              onClick={() =>
                updateFilter('seats', currentFilters.seats === String(s) ? null : String(s))
              }
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${
                currentFilters.seats === String(s)
                  ? 'bg-brand border-brand text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
              }`}
            >
              {s}+
            </button>
          ))}
        </div>
      </div>

      <Separator className="mb-5" />

      {/* Max Price */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Max Price / Day
          </Label>
          <span className="text-sm font-bold text-brand">
            LKR {maxPrice.toLocaleString()}
          </span>
        </div>
        <Slider
          min={5000}
          max={100000}
          step={5000}
          value={[maxPrice]}
          onValueChange={(val) => {
            const value = Array.isArray(val) ? val[0] : val
            updateFilter('maxPrice', String(value))
          }}
          className="[&_[role=slider]]:bg-brand [&_[role=slider]]:border-brand"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>LKR 5,000</span>
          <span>LKR 100,000</span>
        </div>
      </div>
    </div>
  )
}
