import { Footer } from '@/components/footer';
import HeroSection from '@/components/sections/hero';
import IntegrationSection from '@/components/sections/integration';
import PatternsSection from '@/components/sections/patterns';
import PlaygroundSection from '@/components/sections/playground';
import PrimitivesSection from '@/components/sections/primitives';
import TestimonialSection from '@/components/sections/testimonial';
import ToolsSection from '@/components/sections/tools';
import { Topbar } from '@/components/topbar';

const Home = () => (
  <main className="max-lg:overflow-x-clip">
    <div className="relative mx-auto flex flex-col justify-between px-2 md:max-w-7xl md:px-4">
      <Topbar />
    </div>
    <HeroSection />
    <div className="relative mx-auto flex flex-col justify-between px-2 md:max-w-7xl md:px-4">
      <PlaygroundSection />
      <TestimonialSection />
      <PatternsSection />
      <PrimitivesSection />
      <ToolsSection />
      <IntegrationSection />
      <Footer />
    </div>
  </main>
);

export default Home;
