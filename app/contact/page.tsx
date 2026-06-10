import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Contact Us — Malshan Rent A Car',
  description: 'Get in touch with Malshan Rent A Car. We\'re here to help with any questions about our rental services.',
}

export default function ContactPage() {
  const contactMethods = [
    {
      Icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team directly',
      details: '076 209 8120 (Hotline)',
      action: 'tel:0762098120',
      actionText: 'Call Now',
    },
    {
      Icon: Mail,
      title: 'Email Us',
      description: 'We\'ll respond within 2 hours',
      details: 'hello@malshanrentacar.lk',
      action: 'mailto:hello@malshanrentacar.lk',
      actionText: 'Send Email',
    },
    {
      Icon: MapPin,
      title: 'Visit Us',
      description: 'Drop by our office in Pannipitiya',
      details: '135/2, Arawwala Road, Colombo',
      action: '#',
      actionText: 'Get Directions',
    },
    {
      Icon: Clock,
      title: 'Business Hours',
      description: 'Available for your convenience',
      details: 'All 7 Days: 8:00 AM - 6:00 PM',
      action: '#',
      actionText: 'Schedule a Call',
    },
  ]

  const faqs = [
    {
      question: 'How do I make a booking?',
      answer: 'You can browse our available cars on the Cars page, select your preferred vehicle, choose your pickup and drop-off dates, and complete the booking form. Our team will confirm your reservation within minutes.',
    },
    {
      question: 'What are your cancellation policies?',
      answer: 'We offer free cancellation up to 24 hours before your booking. Cancellations within 24 hours may incur charges. Please contact us for more details about your specific booking.',
    },
    {
      question: 'What documents do I need?',
      answer: 'You\'ll need a driving license, valid ID, billing proof, and a guarantor with their ID. Contact us to confirm requirements for your specific needs.',
    },
    {
      question: 'Do you offer airport pickup/drop-off?',
      answer: 'Yes! We provide convenient airport pickup and drop-off services. You can arrange this when making your booking or by contacting our team directly.',
    },
    {
      question: 'What\'s included in the rental?',
      answer: 'Our rentals include 3000 km mileage per month, comprehensive insurance, and roadside assistance. Some vehicles may include additional amenities — check the vehicle details for specifics.',
    },
    {
      question: 'Can I extend my booking?',
      answer: 'Absolutely! If you need to extend your rental period, contact us as soon as possible. We\'ll do our best to accommodate your request based on vehicle availability.',
    },
  ]

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-20 bg-gradient-to-b from-brand/10 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            We&apos;re Here to Help
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Want to book a vehicle? We&apos;re ready to assist you 24/7.
          </p>
        </div>
      </section>

      {/* ── CONTACT METHODS ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to contact us. We&apos;re always happy to help.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, idx) => {
              const Icon = method.Icon
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow text-center">
                  <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-brand" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                  <p className="font-semibold text-gray-900 mb-6">{method.details}</p>
                  <a href={method.action}>
                    <Button variant="outline" className="w-full" size="sm">
                      {method.actionText}
                    </Button>
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM & MAP ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+94 76 209 8120"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="pricing">Pricing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition resize-none"
                  ></textarea>
                </div>

                <Button className="w-full bg-brand hover:bg-brand/90">
                  <Send size={18} className="mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Info Box */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Office</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="text-brand shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">135/2, Arawwala Road, Pannipitiya, Colombo</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="text-brand shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Hours</p>
                      <p className="text-gray-600">All 7 Days: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MessageSquare className="text-brand shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Response Time</p>
                      <p className="text-gray-600">Usually within 2 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-brand/10 rounded-lg p-8 border border-brand/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/cars" className="text-brand font-medium hover:text-brand/80 transition-colors flex items-center gap-2">
                      <ArrowRight size={16} />
                      Browse Our Fleet
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-brand font-medium hover:text-brand/80 transition-colors flex items-center gap-2">
                      <ArrowRight size={16} />
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-brand font-medium hover:text-brand/80 transition-colors flex items-center gap-2">
                      <ArrowRight size={16} />
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Can&apos;t find the answer? Feel free to contact us directly.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-gray-200 rounded-lg p-6 hover:border-brand transition-colors cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer select-none">
                  {faq.question}
                  <span className="transition-transform group-open:rotate-180">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Next Ride?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore our premium fleet and find the perfect vehicle for your needs.
          </p>
          <Link href="/cars">
            <Button size="lg" className="bg-brand hover:bg-brand/90">
              Browse Our Fleet <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
