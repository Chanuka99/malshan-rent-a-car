'use client'

import Image from 'next/image'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/94762098120?text=Hello%20Malshan%20Rent%20A%20Car,%20I%20would%20like%20to%20inquire%20about%20rental%20services"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-white rounded-full p-3 shadow-lg transition-all z-50 hover:scale-110 duration-200 flex items-center justify-center"
      title="Chat with us on WhatsApp"
    >
      <Image
        src="/whatsapp-icon.png"
        alt="WhatsApp"
        width={32}
        height={32}
      />
    </a>
  )
}
