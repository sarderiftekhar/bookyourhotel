"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslations } from "next-intl";

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export default function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const t = useTranslations("hotel");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const [bgReady, setBgReady] = useState(false);
  const prevBgRef = useRef<string | null>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const displayImages = images.slice(0, 5);

  function openLightbox(index: number) {
    setCurrentIndex(index);
    prevBgRef.current = null;
    setBgReady(true);
    setLightboxOpen(true);
    setIsAnimatingIn(true);
    setZoomed(false);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimatingIn(false));
    });
  }

  function closeLightbox() {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setLightboxOpen(false);
      setIsAnimatingOut(false);
      setZoomed(false);
      document.body.style.overflow = "";
    }, 250);
  }

  const goTo = useCallback((index: number, direction: "left" | "right") => {
    setSlideDirection(direction);
    setZoomed(false);
    prevBgRef.current = images[currentIndex];
    setBgReady(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setSlideDirection(null);
    }, 180);
  }, [currentIndex, images]);

  const nextImage = useCallback(() => {
    goTo((currentIndex + 1) % images.length, "left");
  }, [currentIndex, images.length, goTo]);

  const prevImage = useCallback(() => {
    goTo((currentIndex - 1 + images.length) % images.length, "right");
  }, [currentIndex, images.length, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, nextImage, prevImage]);

  // Scroll thumbnail strip to keep active thumb visible
  useEffect(() => {
    if (!thumbStripRef.current) return;
    const activeThumb = thumbStripRef.current.children[currentIndex] as HTMLElement | undefined;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  // Touch/swipe handlers
  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) nextImage();
    else prevImage();
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] sm:h-[480px] rounded-xl overflow-hidden">
        {/* Main image */}
        <button
          type="button"
          aria-label={`View ${hotelName} main photo`}
          className="col-span-2 row-span-2 relative cursor-pointer group text-left overflow-hidden"
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
        </button>

        {/* Secondary images */}
        {[1, 2, 3, 4].map((idx) => (
          <button
            type="button"
            key={`photo-${idx}`}
            aria-label={`View ${hotelName} photo ${idx + 1}`}
            className="relative cursor-pointer group overflow-hidden"
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
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={`fixed inset-0 z-200 flex flex-col transition-opacity duration-250 ${
            isAnimatingIn || isAnimatingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Blurred background — dual layer crossfade */}
          <div className="absolute inset-0 overflow-hidden bg-black">
            {/* Previous bg stays visible until new one loads */}
            {prevBgRef.current && (
              <Image
                src={prevBgRef.current}
                alt=""
                fill
                className="object-cover scale-110 blur-[60px] brightness-[0.3] saturate-150"
                sizes="1px"
              />
            )}
            {/* Current bg fades in on top */}
            <Image
              src={images[currentIndex]}
              alt=""
              fill
              className={`object-cover scale-110 blur-[60px] brightness-[0.3] saturate-150 transition-opacity duration-500 ${
                bgReady ? "opacity-100" : "opacity-0"
              }`}
              sizes="1px"
              priority
              onLoad={() => setBgReady(true)}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Top bar */}
          <div className="relative flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
            <div className="flex items-center gap-4">
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold tabular-nums">
                {currentIndex + 1} / {images.length}
              </span>
              <span className="text-white text-base font-semibold truncate max-w-[400px] drop-shadow-lg">
                {hotelName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomed((z) => !z)}
                className="p-2.5 text-white/70 hover:text-white hover:bg-white/15 backdrop-blur-md rounded-full transition-all duration-200 cursor-pointer"
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
              >
                {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
              </button>
              <button
                onClick={closeLightbox}
                className="p-2.5 text-white/70 hover:text-white hover:bg-white/15 backdrop-blur-md rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main image area */}
          <div
            className="relative flex-1 flex items-center justify-center min-h-0 px-2 sm:px-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Prev button */}
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 cursor-pointer active:scale-90 shadow-lg shadow-black/20"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image container with slide transition + border frame */}
            <div
              className={`relative w-full max-w-5xl h-full flex items-center justify-center transition-all duration-200 ease-out ${
                slideDirection === "left"
                  ? "-translate-x-10 opacity-0"
                  : slideDirection === "right"
                  ? "translate-x-10 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <div className={`relative w-full h-[calc(100%-2rem)] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-white/20 transition-transform duration-300 ${
                zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}>
                <Image
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`${hotelName} - Photo ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  onClick={() => setZoomed((z) => !z)}
                />
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-200 cursor-pointer active:scale-90 shadow-lg shadow-black/20"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="relative shrink-0 py-3 px-4 sm:px-6">
            <div
              ref={thumbStripRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide justify-center max-w-4xl mx-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((img, i) => (
                <button
                  key={`thumb-${i}`}
                  onClick={() => {
                    const dir = i > currentIndex ? "left" : "right";
                    goTo(i, dir);
                  }}
                  className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                    i === currentIndex
                      ? "ring-2 ring-white shadow-lg shadow-white/20 opacity-100 scale-110"
                      : "opacity-40 hover:opacity-70 ring-1 ring-white/10"
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-3 max-w-xs mx-auto h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/40 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Preload adjacent images */}
          <div className="hidden">
            {[currentIndex - 1, currentIndex + 1].map((i) => {
              const idx = (i + images.length) % images.length;
              if (idx === currentIndex) return null;
              return (
                <Image
                  key={`preload-${idx}`}
                  src={images[idx]}
                  alt=""
                  width={1}
                  height={1}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
