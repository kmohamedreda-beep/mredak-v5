import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <AudioPlayer />
      <ContactSection />
    </>
  );
}
