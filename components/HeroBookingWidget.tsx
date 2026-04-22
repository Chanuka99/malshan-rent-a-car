'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function HeroBookingWidget() {
  const router = useRouter()
  const [location, setLocation] = useState('Colombo, Sri Lanka')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (pickupDate) params.set('pickup', pickupDate)
    if (dropoffDate) params.set('dropoff', dropoffDate)
    router.push(`/cars?${params.toString()}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Find Your Car</h2>
      <p className="text-sm text-gray-500 mb-5">Quick and easy booking in Colombo</p>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* Pick-up Location */}
        <div>
          <Label htmlFor="heroLocation" className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            Pick-up Location
          </Label>
          <div className="relative mt-1">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="heroLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9 text-sm"
              placeholder="Colombo, Sri Lanka"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="heroPickup" className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Pick-up Date
            </Label>
            <div className="relative mt-1">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <Input
                id="heroPickup"
                type="date"
                min={today}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="heroDropoff" className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Drop-off Date
            </Label>
            <div className="relative mt-1">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <Input
                id="heroDropoff"
                type="date"
                min={pickupDate || today}
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-11 flex items-center gap-2"
        >
          <Search size={16} />
          Find Available Cars
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Free cancellation · No credit card required
      </p>
    </div>
  )
}
