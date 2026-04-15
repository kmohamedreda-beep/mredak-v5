import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Demos } from "@/components/sections/Demos";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Demos />
      <ContactSection />
    </>
  );
}
