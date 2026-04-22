'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CarGalleryProps {
  images: string[]
  name: string
}

const fallback = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'

export function CarGallery({ images, name }: CarGalleryProps) {
  const allImages = images.length > 0 ? images : [fallback]
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div>
      {/* Main image */}
      <div className="relative h-72 sm:h-96 lg:h-[460px] rounded-2xl overflow-hidden bg-gray-100 mb-3">
        <Image
          src={allImages[activeIdx]}
          alt={`${name} — image ${activeIdx + 1}`}
          fill
          priority
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIdx ? 'border-brand shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
