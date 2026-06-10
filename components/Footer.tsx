import Link from 'next/link'
import Image from 'next/image'
import { Car, Phone, Mail, MapPin, Globe, MessageCircle, Camera, Share2 } from 'lucide-react'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Fleet', href: '/cars' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/contact#faq' },
  ],
  Support: [
    { label: 'Book a Car', href: '/cars' },
    { label: 'My Bookings', href: '/dashboard' },
    { label: 'How It Works', href: '/about' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">
                Malshan <span className="text-brand">Rent A Car</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Your trusted car rental partner in Colombo. Quality vehicles, transparent pricing, and
              exceptional service — every time.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-brand shrink-0" />
                <span>135/2, Arawwala rd, Pannipitiya</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-brand shrink-0" />
                <a href="tel:0762098120" className="hover:text-white transition-colors">
                  076 209 8120 (Hotline)
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-brand shrink-0" />
                <a href="mailto:hello@malshanrentacar.lk" className="hover:text-white transition-colors">
                  hello@malshanrentacar.lk
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Globe, label: 'Website' },
                { Icon: MessageCircle, label: 'Chat' },
                { Icon: Camera, label: 'Instagram' },
                { Icon: Share2, label: 'Share' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Malshan Rent A Car. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
