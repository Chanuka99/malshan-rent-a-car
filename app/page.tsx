import Link from 'next/link'
import Image from 'next/image'
import { Shield, Clock, MapPin, ArrowRight, Star, ChevronRight, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CarCard } from '@/components/CarCard'
import { createClient } from '@/lib/supabase/server'
import { HeroBookingWidget } from '@/components/HeroBookingWidget'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const cars = featuredCars ?? []

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] lg:h-[92vh] flex items-center justify-center overflow-hidden py-20 lg:py-0">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
            alt="Luxury car on road"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Headline */}
            <div className="text-center lg:text-left flex-1 text-white max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs sm:text-sm text-white/90 font-medium">Colombo&apos;s Most Trusted Car Rental</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
                Drive Your Way
                <br />
                <span className="text-gradient">Through Colombo</span>
              </h1>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Premium vehicles, transparent pricing, and seamless booking. Experience
                Colombo on your terms with Malshan Rent A Car.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  No hidden fees
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  Free cancellation
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  24/7 support
                </div>
              </div>
            </div>

            {/* Booking Widget */}
            <div className="w-full sm:max-w-[420px] lg:w-auto lg:min-w-[380px]">
              <HeroBookingWidget />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <div className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── FLEET SECTION ─────────────────────────────────────── */}
      <section className="section-padding bg-white" id="fleet">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-2">
                Our Fleet
              </p>
              <h2 className="text-4xl font-bold text-gray-900">
                Featured Vehicles
              </h2>
              <p className="text-gray-500 mt-2 max-w-md">
                From city commuters to spacious SUVs — find the perfect car for every journey.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-brand text-brand hover:bg-brand hover:text-white flex items-center gap-2 group shrink-0"
              render={
                <Link href="/cars">
                  View All Cars
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              }
            />
          </div>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Car size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No cars available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────── */}
      <section className="section-padding bg-gray-50" id="about">
        <div className="container-max">
          <div className="text-center mb-16">
            <p className="text-brand text-sm font-semibold tracking-widest uppercase mb-2">
              Why Malshan Rent A Car
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Smart Way to Rent
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              We&apos;ve redesigned car rental to be simple, transparent, and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Shield,
                title: 'Fully Insured Vehicles',
                description:
                  'Every car in our fleet is fully insured and regularly serviced. Drive with complete peace of mind.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                Icon: Clock,
                title: 'Flexible Rental Periods',
                description:
                  'Rent by the day, week, or month. Pickup and drop-off at your convenience.',
                color: 'bg-green-50 text-green-600',
              },
              {
                Icon: MapPin,
                title: 'Colombo-Wide Coverage',
                description:
                  'Multiple pickup locations across Colombo. We bring the car to you — no extra charge.',
                color: 'bg-red-50 text-brand',
              },
            ].map(({ Icon, title, description, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM EXPERIENCE ──────────────────────────────────────── */}
      <section className="section-padding" id="experience">
        <div className="container-max">
          <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-10 lg:p-16">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-brand/20 text-brand border border-brand/30 rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
                  Premium Experience
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Your Journey, Our <span className="text-gradient">Commitment</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-md">
                  Experience the ultimate in vehicle rental. From luxury sedans to spacious SUVs,
                  we provide well-maintained vehicles and exceptional service for every mile of your journey.
                </p>
              </div>

              <div className="flex flex-col gap-4 min-w-[260px]">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="text-brand font-bold text-xl mb-1">24/7 Support</div>
                  <p className="text-gray-400 text-sm">Dedicated assistance for any situation during your rental.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="text-brand font-bold text-xl mb-1">Pristine Fleet</div>
                  <p className="text-gray-400 text-sm">Every vehicle is rigorously inspected and cleaned for your safety.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────── */}
      <section className="py-16 bg-brand" id="contact">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {[
              { number: '500+', label: 'Happy Customers' },
              { number: '100+', label: 'Vehicles Available' },
              { number: '4.9★', label: 'Average Rating' },
              { number: '24/7', label: 'Customer Support' },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="text-4xl font-bold mb-1">{number}</div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
