"use client";
import Footer from "@/components/custom/footer";
import CategorySection from "@/components/custom/home/category-section";
import HeroSection from "@/components/custom/home/hero-section";
import RecomendedSection from "@/components/custom/home/recomended-section";
import RequestSection from "@/components/custom/home/request-section";
import Navbar from "@/components/custom/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="md:w-[85%] mx-auto mt-7">
        <HeroSection />
        <CategorySection category="kitchen appliances" image="kitchenBG.jpg" />
        <CategorySection category="computer and tech" image="computer.png" />
        <RequestSection />
        <RecomendedSection  />
      </div>
      <Footer />
    </div>
  );
}
