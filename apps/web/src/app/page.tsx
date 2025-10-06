import HeroSection from '@/components/sections/hero';
import IntegrationSection from '@/components/sections/integration';
import PatternsSection from '@/components/sections/patterns';
import PlaygroundSection from '@/components/sections/playground';
import PrimitivesSection from '@/components/sections/primitives';
import TestimonialSection from '@/components/sections/testimonial';
import ToolsSection from '@/components/sections/tools';

const Home = () => (
  <main className="max-lg:overflow-x-clip">
    <HeroSection />
    <PlaygroundSection />
    <TestimonialSection />
    <PatternsSection />
    <PrimitivesSection />
    <ToolsSection />
    <IntegrationSection />
  </main>
);

export default Home;
