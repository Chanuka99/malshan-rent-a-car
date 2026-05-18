'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Car as CarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CarSchema, type CarInput } from '@/lib/validations'
import { addCarAction, updateCarAction, deleteCarAction } from '@/app/actions/admin'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import type { Car, Brand, Model } from '@/types/supabase'

interface AdminFleetTabProps {
  initialCars: Car[]
  brands?: Brand[]
  models?: Model[]
}

export function AdminFleetTab({ initialCars, brands = [], models = [] }: AdminFleetTabProps) {
  const [cars, setCars] = useState<Car[]>(initialCars)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(true)

  const MAX_IMAGES = 5
  const MAX_FILE_SIZE_MB = 2
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CarInput>({ resolver: zodResolver(CarSchema) })

  const carName = watch('name')
  const selectedBrandName = watch('brand')
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i)
  const seats = Array.from({ length: 15 }, (_, i) => i + 1)
  
  const selectedBrand = brands.find(b => b.name === selectedBrandName)
  const availableModels = selectedBrand 
    ? models.filter(m => m.brand_id === selectedBrand.id)
    : []

  function openAdd() {
    setEditingCar(null)
    setImageUrls([])
    setIsAvailable(true)
    reset({})
    setSheetOpen(true)
  }

  function openEdit(car: Car) {
    setEditingCar(car)
    setImageUrls(car.images)
    reset({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      type: car.type,
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuel_type,
      pricePerDay: car.price_per_day,
      description: car.description ?? '',
    })
    setIsAvailable(car.available ?? true)
    setSheetOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploadError(null)

    // Validate max images combined
    if (imageUrls.length + files.length > MAX_IMAGES) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed in total.`)
      e.target.value = ''
      return
    }

    // Validate files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File ${file.name} is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`)
        e.target.value = ''
        return
      }
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`File ${file.name} is an invalid type. Only JPG, PNG, and WebP images are allowed.`)
        e.target.value = ''
        return
      }
    }

    setUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        // Pass folder name based on car name or ID
        if (editingCar) {
          formData.append('folder', editingCar.id)
        } else if (carName) {
          const slug = carName.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '')
          if (slug) formData.append('folder', slug)
        }

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        return res.json()
      })

      const results = await Promise.all(uploadPromises)
      
      const newUrls: string[] = []
      let hasError = false
      
      for (const result of results) {
        if (result.error) {
          hasError = true
          setUploadError(result.error)
        } else if (result.url) {
          newUrls.push(result.url)
        }
      }

      if (newUrls.length > 0) {
        setImageUrls((prev) => [...prev, ...newUrls])
      }
      if (!hasError) setUploadError(null)
      
    } catch {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleRemoveImage(index: number, url: string) {
    // Optimistically remove from UI
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
    
    // Delete from Supabase storage
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
    } catch (err) {
      console.error('Failed to delete image from storage:', err)
    }
  }

  async function onSubmit(data: CarInput) {
    setSubmitting(true)
    setError(null)
    let result
    if (editingCar) {
      result = await updateCarAction(editingCar.id, { ...data, images: imageUrls, available: isAvailable })
    } else {
      result = await addCarAction({ ...data, images: imageUrls, available: isAvailable })
    }
    if (result?.error) {
      setError(result.error)
    } else {
      setSheetOpen(false)
      router.refresh()
    }
    setSubmitting(false)
  }

  async function handleDelete(carId: string) {
    if (!confirm('Are you sure you want to delete this car?')) return
    await deleteCarAction(carId)
    setCars((prev) => prev.filter((c) => c.id !== carId))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">Fleet Management</h2>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <Button
                className="bg-brand hover:bg-brand-dark text-white flex items-center gap-2"
                onClick={openAdd}
              >
                <Plus size={16} />
                Add Car
              </Button>
            }
          />
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</SheetTitle>
            </SheetHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Car Name</Label>
                  <Input id="name" className="mt-1" {...register('name')} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label>Brand</Label>
                  <Controller
                    control={control}
                    name="brand"
                    render={({ field }) => (
                      <Select onValueChange={(val) => {
                        field.onChange(val)
                        // Reset model when brand changes
                        setValue('model', '')
                      }} value={field.value}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map(b => (
                            <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Model</Label>
                  <Controller
                    control={control}
                    name="model"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBrandName}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map(m => (
                            <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model.message}</p>}
                </div>
                <div>
                  <Label>Year</Label>
                  <Controller
                    control={control}
                    name="year"
                    render={({ field }) => (
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val as string))} 
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(y => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Seats</Label>
                  <Controller
                    control={control}
                    name="seats"
                    render={({ field }) => (
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val as string))} 
                        value={field.value?.toString()}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select seats" />
                        </SelectTrigger>
                        <SelectContent>
                          {seats.map(s => (
                            <SelectItem key={s} value={s.toString()}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.seats && <p className="text-xs text-red-500 mt-1">{errors.seats.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Transmission</Label>
                  <Controller
                    control={control}
                    name="transmission"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label>Fuel Type</Label>
                  <Controller
                    control={control}
                    name="fuelType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pricePerDay">Price per Day (LKR)</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    className="mt-1"
                    {...register('pricePerDay', { valueAsNumber: true })}
                  />
                  {errors.pricePerDay && <p className="text-xs text-red-500 mt-1">{errors.pricePerDay.message}</p>}
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={isAvailable ? 'available' : 'unavailable'} 
                    onValueChange={(val) => setIsAvailable(val === 'available')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  className="mt-1"
                  {...register('description')}
                />
              </div>

              {/* Image Upload */}
              <div>
                <div className="flex items-center justify-between">
                  <Label>Images</Label>
                  <span className="text-xs text-gray-400">
                    {imageUrls.length}/{MAX_IMAGES} · Max {MAX_FILE_SIZE_MB} MB each
                  </span>
                </div>
                {imageUrls.length < MAX_IMAGES && (
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-4">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                      disabled={uploading}
                      multiple
                    />
                    <label
                      htmlFor="imageUpload"
                      className={`flex flex-col items-center text-sm ${
                        uploading
                          ? 'text-gray-400 cursor-wait'
                          : 'text-gray-500 hover:text-brand cursor-pointer'
                      }`}
                    >
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        <Plus size={20} className="mb-1" />
                      )}
                      {uploading ? 'Uploading...' : 'Click to upload image'}
                    </label>
                  </div>
                )}
                {imageUrls.length >= MAX_IMAGES && (
                  <p className="mt-1 text-xs text-amber-600">Maximum {MAX_IMAGES} images reached.</p>
                )}
                {uploadError && (
                  <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                )}
                {imageUrls.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                        <img src={url} alt="" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i, url)}
                          className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-brand hover:bg-brand-dark text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : editingCar ? 'Update Car' : 'Add Car'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Car', 'Type', 'Seats', 'Transmission', 'Fuel', 'Price/Day', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialCars.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  <CarIcon size={32} className="mx-auto mb-2 text-gray-300" />
                  No cars yet. Add your first car!
                </td>
              </tr>
            ) : (
              initialCars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-9 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        {car.images?.[0] ? (
                          <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <CarIcon size={16} className="text-gray-400 m-auto absolute inset-0" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{car.name}</p>
                        <p className="text-xs text-gray-500">{car.brand} {car.model} · {car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{car.type}</td>
                  <td className="px-4 py-3">{car.seats}</td>
                  <td className="px-4 py-3 capitalize">{car.transmission}</td>
                  <td className="px-4 py-3 capitalize">{car.fuel_type}</td>
                  <td className="px-4 py-3 font-semibold text-brand">{formatCurrency(car.price_per_day)}</td>
                  <td className="px-4 py-3">
                    <Badge className={car.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'} variant="secondary">
                      {car.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(car)}>
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(car.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
