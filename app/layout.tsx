import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Malshan Rent A Car — Car Rental Colombo',
    template: '%s | Malshan Rent A Car',
  },
  description:
    'Rent quality cars in Colombo, Sri Lanka. Economy, SUV, Luxury, and Van rentals available. Easy booking, transparent pricing.',
  keywords: ['car rental', 'Colombo', 'Sri Lanka', 'Malshan Rent A Car', 'vehicle hire'],
  openGraph: {
    title: 'Malshan Rent A Car — Car Rental Colombo',
    description: 'Rent quality cars in Colombo, Sri Lanka.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar user={user} profile={profile} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
