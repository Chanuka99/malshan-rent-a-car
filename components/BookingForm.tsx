'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Circle, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookingSchema, type BookingInput } from '@/lib/validations'
import { createBookingAction } from '@/app/actions/booking'
import { formatCurrency, calculateDays, formatDate } from '@/lib/utils'
import type { Car } from '@/types/supabase'

interface BookingFormProps {
  car: Car
}

const steps = ['Driver Details', 'Review Booking', 'Confirm']

export function BookingForm({ car }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<BookingInput>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      driverName: '',
      email: '',
      phone: '',
      pickupDate: '',
      dropoffDate: '',
    },
  })

  const { register, handleSubmit, formState: { errors }, getValues, trigger } = form

  const values = getValues()
  const totalDays =
    values.pickupDate && values.dropoffDate
      ? Math.max(0, calculateDays(values.pickupDate, values.dropoffDate))
      : 0
  const totalPrice = totalDays * car.price_per_day

  async function handleNext() {
    const isValid = await trigger(['driverName', 'email', 'phone', 'pickupDate', 'dropoffDate'])
    if (isValid) {
      setCurrentStep(1)
    }
  }

  async function handleConfirm() {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const data = getValues()
      const result = await createBookingAction({
        carId: car.id,
        carName: car.name,
        pricePerDay: car.price_per_day,
        formData: data,
      })
      if (result?.error) {
        setServerError(result.error)
        setIsSubmitting(false)
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10 gap-0">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  idx < currentStep
                    ? 'bg-brand border-brand text-white'
                    : idx === currentStep
                    ? 'bg-white border-brand text-brand'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {idx < currentStep ? (
                  <CheckCircle size={16} />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  idx === currentStep ? 'text-brand' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mb-5 mx-2 transition-all duration-200 ${
                  idx < currentStep ? 'bg-brand' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Driver Details */}
      {currentStep === 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Driver Details</CardTitle>
            <p className="text-sm text-gray-500">Enter your information to complete the booking</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="driverName">Full Name</Label>
              <Input
                id="driverName"
                placeholder="John Silva"
                className="mt-1"
                {...register('driverName')}
              />
              {errors.driverName && (
                <p className="text-xs text-red-500 mt-1">{errors.driverName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="mt-1"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                className="mt-1"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pick-up Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('pickupDate')}
                />
                {errors.pickupDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.pickupDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="dropoffDate">Drop-off Date</Label>
                <Input
                  id="dropoffDate"
                  type="date"
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('dropoffDate')}
                />
                {errors.dropoffDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.dropoffDate.message}</p>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-brand hover:bg-brand-dark text-white mt-2"
              onClick={handleNext}
              type="button"
            >
              Continue to Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Review */}
      {currentStep === 1 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Review Your Booking</CardTitle>
            <p className="text-sm text-gray-500">Please confirm all details before submitting</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Car summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{car.name}</h3>
              <p className="text-sm text-gray-500">
                {car.brand} {car.model} · {car.year}
              </p>
              <Badge className="mt-2 capitalize" variant="secondary">
                {car.type}
              </Badge>
            </div>

            <Separator />

            {/* Driver details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                Driver
              </h4>
              {[
                { label: 'Name', value: values.driverName },
                { label: 'Email', value: values.email },
                { label: 'Phone', value: values.phone },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Dates */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                Rental Period
              </h4>
              {[
                { label: 'Pick-up', value: formatDate(values.pickupDate) },
                { label: 'Drop-off', value: formatDate(values.dropoffDate) },
                { label: 'Duration', value: `${totalDays} day${totalDays !== 1 ? 's' : ''}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-brand">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs rounded-lg p-3">
              💳 <strong>Pay on arrival.</strong> No payment required now. Bring this reference and a
              valid ID when collecting the vehicle.
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep(0)}
                type="button"
              >
                <ChevronLeft size={16} className="mr-1" />
                Edit Details
              </Button>
              <Button
                className="flex-1 bg-brand hover:bg-brand-dark text-white"
                onClick={() => setCurrentStep(2)}
                type="button"
              >
                Proceed to Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Confirm */}
      {currentStep === 2 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4 text-center">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-brand" />
            </div>
            <CardTitle className="text-xl">Confirm Booking</CardTitle>
            <p className="text-sm text-gray-500">
              By confirming, you agree to our terms and conditions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-semibold">{car.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dates</span>
                <span className="font-semibold">
                  {formatDate(values.pickupDate)} → {formatDate(values.dropoffDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-brand text-base">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {serverError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
                type="button"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </Button>
              <Button
                className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold"
                onClick={handleConfirm}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
