import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutCgdaSection from "@/components/AboutCgdaSection";
import StudiosSection from "@/components/StudiosSection";
import GamesCarousel from "@/components/GamesCarousel";
import EventsSection from "@/components/EventsSection";
import PartnersSection from "@/components/PartnersSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutCgdaSection />
        <GamesCarousel />
        <StudiosSection />
        <EventsSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
