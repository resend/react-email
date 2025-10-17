import { Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="text-lg font-medium text-gray-900 [&>:not(:last-child)]:mb-2">
    <Row>
      <div className="flex flex-1 flex-col">
        <div className="flex min-h-[112px] flex-col justify-end rounded-2xl bg-gray-50 p-6 [&>*]:m-0">
          <p className="mb-auto text-3xl font-bold tracking-tight tabular-nums">
            42
          </p>
          <div className="flex flex-col gap-2 [&>*]:m-0">
            <p>The Answer</p>
            <p className="text-sm text-gray-600">
              To life, the universe, and everything computed by Deep Thought.
            </p>
          </div>
        </div>
      </div>
    </Row>
    <Row>
      <div className="flex flex-1 flex-col">
        <div className="flex min-h-[192px] flex-col justify-end rounded-2xl bg-gray-900 p-6 text-white [&>*]:m-0">
          <p className="mb-auto text-3xl font-bold tracking-tight tabular-nums">
            10M
          </p>
          <div className="flex flex-col gap-2 [&>*]:m-0">
            <p>Years for Earth Mark II</p>
            <p className="text-sm text-gray-400">
              Time required by Magrathea to build a replacement Earth.
            </p>
          </div>
        </div>
      </div>
    </Row>
    <Row>
      <div className="flex flex-1 flex-col">
        <div className="flex min-h-[128px] flex-col justify-end rounded-2xl bg-indigo-600 p-6 text-white [&>*]:m-0">
          <p className="mb-auto text-3xl font-bold tracking-tight tabular-nums">
            2^276,709:1
          </p>
          <div className="flex flex-col gap-2 [&>*]:m-0">
            <p>Improbability Drive odds</p>
            <p className="text-sm text-indigo-200">
              Chances against successfully activating the infinite improbability
              drive.
            </p>
          </div>
        </div>
      </div>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
