import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { VideoGrid } from "@/components/sections/VideoGrid";
import { Demos } from "@/components/sections/Demos";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <main className="bg-black">
      <Hero />
      <Services />
      <VideoGrid />
      <Demos /> 
      <ContactSection />
    </main>
  );
}