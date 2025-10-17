import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <div className="flex flex-col items-center [&>*]:m-0">
        <p className="text-3xl leading-relaxed font-bold tracking-tight text-gray-900 tabular-nums">
          42
        </p>
        <p className="text-sm text-gray-500">The Answer</p>
      </div>
    </Column>
    <Column align="center">
      <div className="flex flex-col items-center [&>*]:m-0">
        <p className="text-3xl leading-relaxed font-bold tracking-tight text-gray-900 tabular-nums">
          10M
        </p>
        <p className="text-sm text-gray-500">Days for Earth Mark II</p>
      </div>
    </Column>
    <Column align="center">
      <div className="flex flex-col items-center [&>*]:m-0">
        <p className="text-3xl leading-relaxed font-bold tracking-tight text-gray-900 tabular-nums">
          2^276,709:1
        </p>
        <p className="text-sm text-gray-500">Improbability Drive odds</p>
      </div>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
