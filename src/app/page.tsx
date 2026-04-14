import { AudioPortfolio } from "@/components/sections/AudioPortfolio";
import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudioPortfolio />
      <ContactSection />
    </>
  );
}
