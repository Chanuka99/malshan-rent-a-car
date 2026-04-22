export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          id: string
          name: string
          brand: string
          model: string
          year: number
          type: 'economy' | 'suv' | 'luxury' | 'van'
          seats: number
          transmission: 'auto' | 'manual'
          fuel_type: 'petrol' | 'diesel' | 'electric'
          price_per_day: number
          images: string[]
          available: boolean
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          model: string
          year: number
          type: 'economy' | 'suv' | 'luxury' | 'van'
          seats: number
          transmission: 'auto' | 'manual'
          fuel_type: 'petrol' | 'diesel' | 'electric'
          price_per_day: number
          images?: string[]
          available?: boolean
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          model?: string
          year?: number
          type?: 'economy' | 'suv' | 'luxury' | 'van'
          seats?: number
          transmission?: 'auto' | 'manual'
          fuel_type?: 'petrol' | 'diesel' | 'electric'
          price_per_day?: number
          images?: string[]
          available?: boolean
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          car_id: string
          pickup_date: string
          dropoff_date: string
          total_days: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          car_id: string
          pickup_date: string
          dropoff_date: string
          total_days: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          car_id?: string
          pickup_date?: string
          dropoff_date?: string
          total_days?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Car = Database['public']['Tables']['cars']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type CarInsert = Database['public']['Tables']['cars']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
