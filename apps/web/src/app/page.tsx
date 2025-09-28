import HeroSection from '@/components/sections/hero';
import PatternsSection from '@/components/sections/patterns';
import PlaygroundSection from '@/components/sections/playground';
import PrimitivesSection from '@/components/sections/primitives';
import TestimonialSection from '@/components/sections/testimonial';
import ToolsSection from '@/components/sections/tools';

const Home = () => (
  <main>
    <HeroSection />
    <PlaygroundSection />
    <TestimonialSection />
    <PatternsSection />
    <PrimitivesSection />
    <ToolsSection />
  </main>
);

export default Home;
