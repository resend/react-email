import Image from 'next/image';

import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { InteractiveDemo } from './interactive-demo';

const ToolsSection = () => {
  return (
    <section className="relative text-center space-y-24 my-56">
      <div className="space-y-8">
        <div className="max-w-full text-center space-y-6">
          <Heading size="9" weight="medium" className="text-white/80">
            Built-in deliverability tools
          </Heading>
          <div className="sm:px-20 md:max-w-2xl md:mx-auto">
            <Text size="5">
              Before you hit “send”, check how your email is doing with a set of
              tools to help you build better emails.
            </Text>
          </div>
        </div>
      </div>
      <InteractiveDemo />
      <Image
        alt=""
        className="pointer-events-none absolute inset-0 -top-40 z-[3] select-none mix-blend-lighten"
        fill
        priority
        src="/static/bg.png"
      />
    </section>
  );
};

export default ToolsSection;
