import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About Us — Malshan Rent A Car',
  description: 'Learn about Malshan Rent A Car — Colombo\'s trusted car rental service with transparent pricing and exceptional service.',
}

export default function AboutPage() {
  const values = [
    {
      title: 'Transparency',
      description: 'No hidden fees. No surprises. What you see is what you pay.',
    },
    {
      title: 'Reliability',
      description: 'Well-maintained vehicles and punctual service you can count on.',
    },
    {
      title: 'Customer First',
      description: '24/7 support and flexible booking options tailored to your needs.',
    },
    {
      title: 'Quality',
      description: 'Premium vehicles and professional service every single time.',
    },
  ]

  const team = [
    {
      name: 'Malshan Madhuranga',
      role: 'Founder & CEO',
      description: 'Passionate about delivering exceptional car rental experiences in Colombo.',
    },
    {
      name: 'Lakmal',
      role: 'Operations Manager',
      description: 'Ensures every booking runs smoothly with attention to detail.',
    },
    {
      name: 'Smapath',
      role: 'Fleet Manager',
      description: 'Maintains our vehicles to the highest standards of safety and comfort.',
    },
  ]

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            About Malshan <span className="text-brand">Rent A Car</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We&apos;re dedicated to providing Colombo with premium car rental services that prioritize your comfort, safety, and satisfaction.
          </p>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2018, Malshan Rent A Car was born from a simple idea: make car rental in Colombo simple, transparent, and affordable.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We started with just a handful of vehicles and a commitment to exceptional service. Today, we&apos;re proud to be Colombo&apos;s most trusted car rental provider, serving thousands of satisfied customers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is simple: provide premium vehicles and outstanding service that exceeds expectations every single time.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1559628595-46531173cf16?w=600&q=80"
                alt="Malshan Rent A Car office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every interaction with our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center mb-6">
                  <Check className="text-brand" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals behind Malshan Rent A Car.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={`https://images.unsplash.com/photo-${1494790108617 + idx}?w=200&q=80`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-brand font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-brand mb-2">5000+</div>
              <p className="text-gray-400">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand mb-2">2.5K+</div>
              <p className="text-gray-400">Bookings Completed</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand mb-2">150+</div>
              <p className="text-gray-400">Premium Vehicles</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand mb-2">24/7</div>
              <p className="text-gray-400">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Book Your Next Adventure?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our fleet of premium vehicles and experience the Malshan difference.
          </p>
          <Link href="/cars">
            <Button size="lg" className="bg-brand hover:bg-brand/90">
              Browse Our Fleet <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── CONTACT INFO ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-brand" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">135/2, Arawwala Road, Pannipitiya, Colombo</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-brand" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">
                <a href="tel:0762098120" className="hover:text-brand transition-colors font-semibold">
                  076 209 8120
                </a>
              </p>
              <p className="text-gray-500 text-sm mt-1">Available 24/7</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="text-brand" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:hello@malshanrentacar.lk" className="hover:text-brand transition-colors font-semibold">
                  hello@malshanrentacar.lk
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
