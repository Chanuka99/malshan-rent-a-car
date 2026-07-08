import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminBookingsTable } from '@/components/AdminBookingsTable'
import { AdminFleetTab } from '@/components/AdminFleetTab'
import { AdminUsersTab } from '@/components/AdminUsersTab'
import { AdminBrandsTab } from '@/components/AdminBrandsTab'
import { BarChart3, Car, Users, CalendarCheck, Tags } from 'lucide-react'
import type { Metadata } from 'next'
import type { Profile, Car as CarType, Booking, Brand, Model } from '@/types/supabase'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Malshan Rent A Car administration panel.',
}

type BookingWithJoins = Booking & {
  cars: { name: string } | null
  profiles: { full_name: string } | null
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null
  if (!profile || profile.role !== 'admin') redirect('/')

  // Fetch all data
  const [{ data: carsData }, { data: bookingsData }, { data: profilesData }, { data: brandsData }, { data: modelsData }] = await Promise.all([
    supabase.from('cars').select('*').order('created_at', { ascending: false }),
    supabase
      .from('bookings')
      .select('*, cars(name), profiles(full_name)')
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('brands').select('*').order('name', { ascending: true }),
    supabase.from('models').select('*').order('name', { ascending: true }),
  ])

  const cars = (carsData ?? []) as CarType[]
  const bookings = (bookingsData ?? []) as unknown as BookingWithJoins[]
  const profiles = (profilesData ?? []) as Profile[]
  const brands = (brandsData ?? []) as Brand[]
  const models = (modelsData ?? []) as Model[]

  const stats = [
    { label: 'Total Cars', value: cars.length, Icon: Car, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Bookings', value: bookings.length, Icon: CalendarCheck, color: 'bg-green-50 text-green-600' },
    {
      label: 'Active Bookings',
      value: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
      Icon: BarChart3,
      color: 'bg-yellow-50 text-yellow-600',
    },
    { label: 'Total Users', value: profiles.length, Icon: Users, color: 'bg-blue-50 text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-1">
            Administration
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Logged in as <strong>{profile.full_name}</strong>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="fleet">
          <TabsList className="mb-6">
            <TabsTrigger value="fleet" className="flex items-center gap-1.5">
              <Car size={16} /> Fleet ({cars.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-1.5">
              <CalendarCheck size={16} /> Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1.5">
              <Users size={16} /> Users ({profiles.length})
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center gap-1.5">
              <Tags size={16} /> Brands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fleet">
            <AdminFleetTab initialCars={cars} brands={brands} models={models} />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookingsTable initialBookings={bookings} />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersTab users={profiles} />
          </TabsContent>

          <TabsContent value="brands">
            <AdminBrandsTab brands={brands} models={models} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
