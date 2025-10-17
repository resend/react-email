import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow className="text-left tabular-nums">
    <ResponsiveColumn className="m-3 max-w-fit [&>*]:m-0">
      <p className="text-2xl leading-relaxed font-bold tracking-tight text-gray-900">
        42
      </p>
      <p className="text-sm text-gray-500">The Answer</p>
    </ResponsiveColumn>
    <ResponsiveColumn className="m-3 max-w-fit [&>*]:m-0">
      <p className="text-2xl leading-relaxed font-bold tracking-tight text-gray-900">
        10M
      </p>
      <p className="text-sm text-gray-500">Days for Earth Mark II</p>
    </ResponsiveColumn>
    <ResponsiveColumn className="m-3 max-w-fit [&>*]:m-0">
      <p className="text-2xl leading-relaxed font-bold tracking-tight text-gray-900">
        2^276,709:1
      </p>
      <p className="text-sm text-gray-500">Improbability Drive odds</p>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
