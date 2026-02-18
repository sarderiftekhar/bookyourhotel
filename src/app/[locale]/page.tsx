import Hero from "@/components/home/Hero";
import PopularDestinations from "@/components/home/PopularDestinations";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import HotelGallery from "@/components/home/HotelGallery";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularDestinations />
      <HowItWorks />
      <Testimonials />
      <HotelGallery />
      <Newsletter />
    </>
  );
}
