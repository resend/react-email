import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/hero';
import { Topbar } from '@/components/topbar';

const PlaygroundSection = dynamic(() => import('@/components/sections/playground'));
const TestimonialSection = dynamic(() => import('@/components/sections/testimonial'));
const PatternsSection = dynamic(() => import('@/components/sections/patterns'));
const PrimitivesSection = dynamic(() => import('@/components/sections/primitives'));
const ToolsSection = dynamic(() => import('@/components/sections/tools'));
const IntegrationSection = dynamic(() => import('@/components/sections/integration'));
const Footer = dynamic(() => import('@/components/footer').then((mod) => ({ default: mod.Footer })));

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
