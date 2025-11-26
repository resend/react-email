import { Column, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section>
    <Row className="mb-2">
      <Column className="min-h-[112px] rounded-2xl bg-gray-100 p-4">
        <p className="mb-0 text-[24px] leading-[32px] font-bold tracking-tight tabular-nums text-gray-900">
          42
        </p>
        <div className="text-gray-700">
          <p className="mb-0 text-[15px] leading-[22px]">The Answer</p>
          <p className="mb-0 mt-1 text-[13px] leading-[18px] text-gray-600">
            To life, the universe, and everything computed by Deep Thought.
          </p>
        </div>
      </Column>
    </Row>
    <Row className="mb-2">
      <Column className="min-h-[192px] rounded-2xl bg-gray-900 p-4">
        <p className="mb-0 text-[24px] leading-[32px] font-bold tracking-tight tabular-nums text-gray-50">
          10M
        </p>
        <div className="text-gray-300">
          <p className="mb-0 text-[15px] leading-[22px]">
            Years for Earth Mark II
          </p>
          <p className="mb-0 mt-1 text-[13px] leading-[18px] text-gray-400">
            Time required by Magrathea to build a replacement Earth.
          </p>
        </div>
      </Column>
    </Row>
    <Row>
      <Column className="min-h-[128px] rounded-2xl bg-indigo-700 p-4">
        <p className="mb-0 text-[24px] leading-[32px] font-bold tracking-tight tabular-nums text-indigo-50">
          2^276,709:1
        </p>
        <div className="text-indigo-100">
          <p className="mb-0 text-[15px] leading-[22px]">
            Improbability Drive odds
          </p>
          <p className="mb-0 mt-1 text-[13px] leading-[18px] text-indigo-200">
            Chances against successfully activating the infinite improbability
            drive.
          </p>
        </div>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
