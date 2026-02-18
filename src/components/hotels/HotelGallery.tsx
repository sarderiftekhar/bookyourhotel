"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { useTranslations } from "next-intl";

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export default function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const t = useTranslations("hotel");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.slice(0, 5);

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }

  function nextImage() {
    setCurrentIndex((i) => (i + 1) % images.length);
  }

  function prevImage() {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] sm:h-[480px] rounded-xl overflow-hidden">
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          {displayImages[0] ? (
            <Image
              src={displayImages[0]}
              alt={hotelName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
              sizes="50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-bg-cream" />
          )}
        </div>

        {/* Secondary images */}
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group"
            onClick={() => openLightbox(idx)}
          >
            {displayImages[idx] ? (
              <Image
                src={displayImages[idx]}
                alt={`${hotelName} - Photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-bg-cream to-border" />
            )}

            {/* View all button on last image */}
            {idx === 4 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-white text-center">
                  <Grid size={24} className="mx-auto mb-1" />
                  <span className="text-sm font-medium">{t("viewAllPhotos")}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 z-10 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={images[currentIndex]}
              alt={`${hotelName} - Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 z-10 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
