import { z } from 'zod'

export const RegisterSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const BookingSchema = z
  .object({
    pickupDate: z.string().min(1, 'Pick-up date is required'),
    dropoffDate: z.string().min(1, 'Drop-off date is required'),
    driverName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Invalid phone number'),
  })
  .refine((d) => new Date(d.dropoffDate) > new Date(d.pickupDate), {
    message: 'Drop-off must be after pick-up',
    path: ['dropoffDate'],
  })

export const CarSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(2000, 'Year must be 2000 or later').max(new Date().getFullYear(), 'Year cannot be in the future'),
  type: z.enum(['Hatchback', 'Sedan', 'SUV / Crossover', 'Van', 'Station Wagon', 'Pickup Truck / Double Cab', 'MPV (Multi-Purpose Vehicle)', 'Coupe', 'Convertible']),
  seats: z.number().min(1, 'Min 1 seat').max(15, 'Max 15 seats'),
  transmission: z.enum(['auto', 'manual', 'tiptronic']),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  pricePerDay: z.number().positive('Price must be positive'),
  description: z.string().optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type BookingInput = z.infer<typeof BookingSchema>
export type CarInput = z.infer<typeof CarSchema>
