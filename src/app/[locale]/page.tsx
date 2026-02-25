import Hero from "@/components/home/Hero";
import PopularDestinations from "@/components/home/PopularDestinations";
import Testimonials from "@/components/home/Testimonials";
import RecommendedHotels from "@/components/home/RecommendedHotels";
import NearbyHotels from "@/components/home/NearbyHotels";
import HotelGallery from "@/components/home/HotelGallery";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NearbyHotels />
      <PopularDestinations />
      <Testimonials />
      <RecommendedHotels />
      <HotelGallery />
      <Newsletter />
    </>
  );
}
